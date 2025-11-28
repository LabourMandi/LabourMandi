import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  MessageSquare,
  Sun,
  Moon,
  Bell,
  CheckCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import type { Message as MessageType } from "@shared/schema";

interface Conversation {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    online: boolean;
  };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

const mockConversations: Conversation[] = [
  {
    id: "c1",
    user: { id: "u1", name: "Rajesh Kumar", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", online: true },
    lastMessage: "Thank you for accepting my bid. When can we start?",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 2,
  },
  {
    id: "c2",
    user: { id: "u2", name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", online: true },
    lastMessage: "I've reviewed the project details. The timeline looks good.",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: "c3",
    user: { id: "u3", name: "ABC Builders", avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100", online: false },
    lastMessage: "Payment has been released to your wallet",
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
  },
  {
    id: "c4",
    user: { id: "u4", name: "Amit Singh", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", online: false },
    lastMessage: "Can you provide more details about your experience?",
    lastMessageTime: new Date(Date.now() - 48 * 60 * 60 * 1000),
    unreadCount: 1,
  },
];

const mockMessages: Record<string, ChatMessage[]> = {
  c1: [
    { id: "m1", senderId: "u1", content: "Hi, I saw your job posting for skilled masons.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), status: "read" },
    { id: "m2", senderId: "me", content: "Yes, we need experienced masons for a 6-month project. Do you have a team?", timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000), status: "read" },
    { id: "m3", senderId: "u1", content: "I have a team of 5 masons with 5+ years experience each. We've worked on commercial projects before.", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), status: "read" },
    { id: "m4", senderId: "me", content: "Great! I've reviewed your bid and accepted it. Welcome aboard!", timestamp: new Date(Date.now() - 45 * 60 * 1000), status: "read" },
    { id: "m5", senderId: "u1", content: "Thank you for accepting my bid. When can we start?", timestamp: new Date(Date.now() - 30 * 60 * 1000), status: "delivered" },
  ],
  c2: [
    { id: "m1", senderId: "me", content: "Hi Priya, I noticed your profile. Would you be interested in a painting project?", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), status: "read" },
    { id: "m2", senderId: "u2", content: "Yes, I'd be interested. Could you share the details?", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), status: "read" },
    { id: "m3", senderId: "me", content: "It's for a school renovation project. Interior and exterior work for about 1 month.", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), status: "read" },
    { id: "m4", senderId: "u2", content: "I've reviewed the project details. The timeline looks good.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), status: "read" },
  ],
};

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
}

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover-elevate ${isSelected ? "bg-muted" : ""}`}
      onClick={onClick}
      data-testid={`conversation-${conversation.id}`}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.user.avatar} />
          <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
        </Avatar>
        {conversation.user.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium truncate">{conversation.user.name}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
          {conversation.unreadCount > 0 && (
            <Badge className="h-5 min-w-5 px-1.5 rounded-full">{conversation.unreadCount}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${isOwn ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}
      >
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          {isOwn && message.status === "read" && <CheckCheck className="h-3 w-3" />}
          {isOwn && message.status === "delivered" && <CheckCheck className="h-3 w-3 opacity-50" />}
          {isOwn && message.status === "sent" && <Clock className="h-3 w-3 opacity-50" />}
        </div>
      </div>
    </div>
  );
}

export default function Messages() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages.c1 || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || []);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "me",
      content: newMessage.trim(),
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const filteredConversations = mockConversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Breadcrumbs items={[{ label: "Messages" }]} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-hidden">
            <div className="flex h-full">
              {/* Conversations List */}
              <div className="w-80 border-r border-border flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-messages"
                    />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {filteredConversations.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No conversations found</p>
                      </div>
                    ) : (
                      filteredConversations.map((conv) => (
                        <ConversationItem
                          key={conv.id}
                          conversation={conv}
                          isSelected={selectedConversation?.id === conv.id}
                          onClick={() => setSelectedConversation(conv)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Area */}
              {selectedConversation ? (
                <div className="flex-1 flex flex-col">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.user.avatar} />
                          <AvatarFallback>{selectedConversation.user.name[0]}</AvatarFallback>
                        </Avatar>
                        {selectedConversation.user.online && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{selectedConversation.user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedConversation.user.online ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isOwn={msg.senderId === "me"}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                        data-testid="input-message"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        data-testid="button-send-message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold text-lg mb-2">No conversation selected</h3>
                    <p className="text-muted-foreground">
                      Select a conversation to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
