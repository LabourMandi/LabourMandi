import { db } from "./db";
import { eq, desc, and, or, ilike, sql } from "drizzle-orm";
import {
  users,
  jobs,
  bids,
  tools,
  toolCategories,
  jobCategories,
  conversations,
  messages,
  transactions,
  notifications,
  type User,
  type InsertUser,
  type UpsertUser,
  type Job,
  type InsertJob,
  type Bid,
  type InsertBid,
  type Tool,
  type InsertTool,
  type ToolCategory,
  type JobCategory,
  type Conversation,
  type Message,
  type InsertMessage,
  type Transaction,
  type InsertTransaction,
  type Notification,
  type InsertNotification,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  getWorkers(filters?: { location?: string; skills?: string[] }): Promise<User[]>;

  // Jobs
  getJobs(filters?: { category?: string; location?: string; status?: string }): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, data: Partial<Job>): Promise<Job | undefined>;
  getJobsByEmployer(employerId: string): Promise<Job[]>;

  // Bids
  getBidsByJob(jobId: string): Promise<Bid[]>;
  getBidsByWorker(workerId: string): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBid(id: string, data: Partial<Bid>): Promise<Bid | undefined>;

  // Tools/Equipment
  getTools(filters?: { category?: string; location?: string }): Promise<Tool[]>;
  getTool(id: string): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  getToolCategories(): Promise<ToolCategory[]>;
  getJobCategories(): Promise<JobCategory[]>;

  // Messages
  getConversations(userId: string): Promise<Conversation[]>;
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Transactions
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;

  // Conversations
  getConversationById(id: string): Promise<Conversation | undefined>;
  createConversation(participant1Id: string, participant2Id: string): Promise<Conversation>;

  // Dashboard
  getDashboardStats(userId: string): Promise<{
    activeJobs: number;
    totalBids: number;
    pendingBids: number;
    completedJobs: number;
    earnings: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getWorkers(filters?: { location?: string; skills?: string[] }): Promise<User[]> {
    let query = db.select().from(users).where(eq(users.role, "worker"));
    return query.orderBy(desc(users.rating));
  }

  // Jobs
  async getJobs(filters?: { category?: string; location?: string; status?: string }): Promise<Job[]> {
    return db.select().from(jobs).orderBy(desc(jobs.postedAt));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async updateJob(id: string, data: Partial<Job>): Promise<Job | undefined> {
    const [job] = await db
      .update(jobs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async getJobsByEmployer(employerId: string): Promise<Job[]> {
    return db.select().from(jobs).where(eq(jobs.employerId, employerId)).orderBy(desc(jobs.postedAt));
  }

  // Bids
  async getBidsByJob(jobId: string): Promise<Bid[]> {
    return db.select().from(bids).where(eq(bids.jobId, jobId)).orderBy(desc(bids.createdAt));
  }

  async getBidsByWorker(workerId: string): Promise<Bid[]> {
    return db.select().from(bids).where(eq(bids.workerId, workerId)).orderBy(desc(bids.createdAt));
  }

  async createBid(bid: InsertBid): Promise<Bid> {
    const [newBid] = await db.insert(bids).values(bid).returning();
    
    // Increment bids count on job
    await db
      .update(jobs)
      .set({ bidsCount: sql`${jobs.bidsCount} + 1` })
      .where(eq(jobs.id, bid.jobId));
    
    return newBid;
  }

  async updateBid(id: string, data: Partial<Bid>): Promise<Bid | undefined> {
    const [bid] = await db
      .update(bids)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(bids.id, id))
      .returning();
    return bid;
  }

  // Tools/Equipment
  async getTools(filters?: { category?: string; location?: string }): Promise<Tool[]> {
    let query = db.select().from(tools);
    if (filters?.category) {
      query = query.where(eq(tools.categoryId, filters.category)) as any;
    }
    return query.orderBy(desc(tools.rating));
  }

  async getTool(id: string): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.id, id));
    return tool;
  }

  async createTool(tool: InsertTool): Promise<Tool> {
    const [newTool] = await db.insert(tools).values(tool).returning();
    return newTool;
  }

  async getToolCategories(): Promise<ToolCategory[]> {
    return db.select().from(toolCategories);
  }

  async getJobCategories(): Promise<JobCategory[]> {
    return db.select().from(jobCategories);
  }

  // Messages
  async getConversations(userId: string): Promise<Conversation[]> {
    return db
      .select()
      .from(conversations)
      .where(or(eq(conversations.participant1Id, userId), eq(conversations.participant2Id, userId)))
      .orderBy(desc(conversations.lastMessageAt));
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    
    // Update conversation last message time
    await db
      .update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    
    return newMessage;
  }

  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    
    // Update user wallet balance
    const user = await this.getUser(transaction.userId);
    if (user) {
      const amount = Number(transaction.amount);
      const currentBalance = Number(user.walletBalance || 0);
      const newBalance = ["credit", "deposit", "earning"].includes(transaction.type)
        ? currentBalance + amount
        : currentBalance - amount;
      
      await db
        .update(users)
        .set({ walletBalance: newBalance.toString() })
        .where(eq(users.id, transaction.userId));
    }
    
    return newTransaction;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Conversations
  async getConversationById(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(participant1Id: string, participant2Id: string): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values({ participant1Id, participant2Id })
      .returning();
    return conversation;
  }

  // Dashboard Stats
  async getDashboardStats(userId: string): Promise<{
    activeJobs: number;
    totalBids: number;
    pendingBids: number;
    completedJobs: number;
    earnings: string;
  }> {
    const user = await this.getUser(userId);
    const userRole = user?.role || "worker";

    if (userRole === "employer") {
      const userJobs = await db
        .select()
        .from(jobs)
        .where(eq(jobs.employerId, userId));
      
      const activeJobs = userJobs.filter(j => j.status === "open").length;
      const completedJobs = userJobs.filter(j => j.status === "completed").length;
      
      const allBids = await Promise.all(
        userJobs.map(j => this.getBidsByJob(j.id))
      );
      const totalBids = allBids.flat().length;
      const pendingBids = allBids.flat().filter(b => b.status === "pending").length;

      return {
        activeJobs,
        totalBids,
        pendingBids,
        completedJobs,
        earnings: "0",
      };
    } else {
      // Worker stats
      const workerBids = await this.getBidsByWorker(userId);
      const acceptedBids = workerBids.filter(b => b.status === "accepted");
      const pendingBids = workerBids.filter(b => b.status === "pending").length;
      const completedJobs = acceptedBids.filter(b => b.status === "accepted").length;

      const userTransactions = await this.getTransactions(userId);
      const earnings = userTransactions
        .filter(t => t.type === "earning")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        activeJobs: acceptedBids.length,
        totalBids: workerBids.length,
        pendingBids,
        completedJobs,
        earnings: earnings.toString(),
      };
    }
  }
}

export const storage = new DatabaseStorage();
