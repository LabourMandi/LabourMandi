import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertJobSchema, insertBidSchema, insertToolSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ConnectedClient {
  ws: WebSocket;
  userId: string;
}

const connectedClients: Map<string, ConnectedClient> = new Map();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // ============= AUTH ROUTES =============
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============= USER ROUTES =============
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.patch("/api/users/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.updateUser(userId, req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.get("/api/workers", async (req, res) => {
    try {
      const { location, skills } = req.query;
      const workers = await storage.getWorkers({
        location: location as string,
        skills: skills ? (skills as string).split(",") : undefined,
      });
      res.json(workers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get workers" });
    }
  });

  // ============= JOB ROUTES =============
  app.get("/api/jobs", async (req, res) => {
    try {
      const { category, location, status } = req.query;
      const jobs = await storage.getJobs({
        category: category as string,
        location: location as string,
        status: status as string,
      });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to get job" });
    }
  });

  app.post("/api/jobs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertJobSchema.parse({
        ...req.body,
        employerId: userId,
      });
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  app.patch("/api/jobs/:id", isAuthenticated, async (req, res) => {
    try {
      const job = await storage.updateJob(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  app.get("/api/jobs/:id/bids", async (req, res) => {
    try {
      const bids = await storage.getBidsByJob(req.params.id);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bids" });
    }
  });

  // ============= BID ROUTES =============
  app.post("/api/jobs/:id/bids", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertBidSchema.parse({
        ...req.body,
        jobId: req.params.id,
        workerId: userId,
      });
      const bid = await storage.createBid(validatedData);
      
      // Send real-time notification to job owner
      const job = await storage.getJob(req.params.id);
      if (job) {
        const notification = {
          type: "new_bid",
          jobId: req.params.id,
          bidId: bid.id,
          message: `New bid of ₹${bid.proposedRate} received on your job`,
        };
        broadcastToUser(job.employerId, notification);
      }
      
      res.status(201).json(bid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating bid:", error);
      res.status(500).json({ message: "Failed to create bid" });
    }
  });

  app.get("/api/bids", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bids = await storage.getBidsByWorker(userId);
      res.json(bids);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bids" });
    }
  });

  app.patch("/api/bids/:id", isAuthenticated, async (req: any, res) => {
    try {
      const bid = await storage.updateBid(req.params.id, req.body);
      
      // Notify worker about bid status change
      if (bid && req.body.status) {
        const notification = {
          type: "bid_update",
          bidId: bid.id,
          status: req.body.status,
          message: `Your bid has been ${req.body.status}`,
        };
        broadcastToUser(bid.workerId, notification);
      }
      
      res.json(bid);
    } catch (error) {
      res.status(500).json({ message: "Failed to update bid" });
    }
  });

  // ============= TOOL/EQUIPMENT ROUTES =============
  app.get("/api/tools", async (req, res) => {
    try {
      const { category, location } = req.query;
      const tools = await storage.getTools({
        category: category as string,
        location: location as string,
      });
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tools" });
    }
  });

  app.get("/api/tools/:id", async (req, res) => {
    try {
      const tool = await storage.getTool(req.params.id);
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tool" });
    }
  });

  app.post("/api/tools", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertToolSchema.parse({
        ...req.body,
        ownerId: userId,
      });
      const tool = await storage.createTool(validatedData);
      res.status(201).json(tool);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error creating tool:", error);
      res.status(500).json({ message: "Failed to create tool" });
    }
  });

  app.get("/api/tool-categories", async (req, res) => {
    try {
      const categories = await storage.getToolCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tool categories" });
    }
  });

  app.get("/api/job-categories", async (req, res) => {
    try {
      const categories = await storage.getJobCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get job categories" });
    }
  });

  // ============= MESSAGING ROUTES =============
  app.get("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  app.get("/api/conversations/:id/messages", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/conversations/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const message = await storage.createMessage({
        conversationId: req.params.id,
        senderId: userId,
        content: req.body.content,
      });
      
      // Send real-time message to the other participant
      const conversation = await storage.getConversationById(req.params.id);
      if (conversation) {
        const recipientId = conversation.participant1Id === userId 
          ? conversation.participant2Id 
          : conversation.participant1Id;
        broadcastToUser(recipientId, {
          type: "new_message",
          conversationId: req.params.id,
          message,
        });
      }
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // ============= TRANSACTION ROUTES =============
  app.get("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get transactions" });
    }
  });

  app.post("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transaction = await storage.createTransaction({
        ...req.body,
        userId,
      });
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Mock Razorpay payment endpoints
  app.post("/api/payments/create-order", isAuthenticated, async (req: any, res) => {
    try {
      const { amount } = req.body;
      // Mock Razorpay order creation
      const order = {
        id: `order_${Date.now()}`,
        amount: amount * 100, // Razorpay uses paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        status: "created",
      };
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { orderId, paymentId, amount, type = "deposit" } = req.body;
      
      // Mock payment verification - always succeeds
      const transaction = await storage.createTransaction({
        userId,
        type,
        amount: amount.toString(),
        description: `Payment via Razorpay: ${paymentId}`,
        status: "completed",
        referenceId: paymentId,
      });
      
      res.json({ success: true, transaction });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify payment" });
    }
  });

  // ============= NOTIFICATION ROUTES =============
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to get notifications" });
    }
  });

  app.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // ============= AI MATCHING ROUTES =============
  app.post("/api/ai/match-workers", isAuthenticated, async (req: any, res) => {
    try {
      const { jobDescription, requirements, location } = req.body;
      const workers = await storage.getWorkers({ location });
      
      const prompt = `You are an AI assistant for a construction labor marketplace in India called LabourMandi. 
      Given the following job requirements, rank the workers by their suitability.
      
      Job Description: ${jobDescription}
      Requirements: ${requirements?.join(", ") || "None specified"}
      Location: ${location || "Any"}
      
      Available Workers (JSON):
      ${JSON.stringify(workers.slice(0, 10), null, 2)}
      
      Please return a JSON array of worker IDs ranked by suitability, with a brief explanation for each.
      Format: [{"workerId": "...", "score": 0-100, "reason": "..."}]`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json(result);
    } catch (error) {
      console.error("AI matching error:", error);
      res.status(500).json({ message: "Failed to match workers" });
    }
  });

  app.post("/api/ai/chat-assistant", isAuthenticated, async (req: any, res) => {
    try {
      const { message, context } = req.body;
      
      const systemPrompt = `You are a helpful AI assistant for LabourMandi, a construction labor marketplace in India. 
      Help users with:
      - Finding suitable workers for their construction projects
      - Understanding job posting best practices
      - Equipment rental advice
      - Construction industry guidance
      Keep responses concise and practical.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      });

      res.json({ 
        message: response.choices[0].message.content,
        usage: response.usage,
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // ============= DASHBOARD ROUTES =============
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const stats = await storage.getDashboardStats(userId);
      
      res.json({
        ...stats,
        walletBalance: user?.walletBalance || "0",
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  // ============= WEBSOCKET SETUP =============
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", `http://${req.headers.host}`);
    const userId = url.searchParams.get("userId");
    
    if (userId) {
      connectedClients.set(userId, { ws, userId });
      console.log(`WebSocket connected: ${userId}`);
      
      ws.on("close", () => {
        connectedClients.delete(userId);
        console.log(`WebSocket disconnected: ${userId}`);
      });

      ws.on("message", async (data) => {
        try {
          const message = JSON.parse(data.toString());
          handleWebSocketMessage(userId, message);
        } catch (error) {
          console.error("WebSocket message error:", error);
        }
      });
    }
  });

  function broadcastToUser(userId: string, data: any) {
    const client = connectedClients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  async function handleWebSocketMessage(userId: string, message: any) {
    switch (message.type) {
      case "typing":
        // Broadcast typing indicator to conversation participants
        if (message.conversationId && message.recipientId) {
          broadcastToUser(message.recipientId, {
            type: "typing",
            conversationId: message.conversationId,
            userId,
          });
        }
        break;
      case "ping":
        broadcastToUser(userId, { type: "pong" });
        break;
    }
  }

  return httpServer;
}
