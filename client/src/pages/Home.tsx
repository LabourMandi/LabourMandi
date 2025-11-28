import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Briefcase,
  FileText,
  Wallet,
  TrendingUp,
  Bell,
  MessageSquare,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronRight,
  Sun,
  Moon,
  Star,
  MapPin,
  Users,
} from "lucide-react";
import type { Job, Bid, Notification, Transaction } from "@shared/schema";

interface DashboardStats {
  activeJobs: number;
  totalBids: number;
  pendingBids: number;
  walletBalance: string;
  earnings: string;
  completedJobs: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  href,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  href?: string;
}) {
  const content = (
    <Card className="hover-elevate">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-1">
                {trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function ActivityItem({
  icon: Icon,
  title,
  description,
  time,
  type,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  type: "bid" | "job" | "message" | "payment";
}) {
  const colors = {
    bid: "bg-blue-500/10 text-blue-500",
    job: "bg-green-500/10 text-green-500",
    message: "bg-purple-500/10 text-purple-500",
    payment: "bg-orange-500/10 text-orange-500",
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover-elevate">
      <div className={`h-10 w-10 rounded-lg ${colors[type]} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentJobs, isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", "recent"],
  });

  const { data: recentBids, isLoading: bidsLoading } = useQuery<Bid[]>({
    queryKey: ["/api/bids", "recent"],
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications", "unread"],
  });

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Breadcrumbs items={[{ label: "Dashboard" }]} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} data-testid="button-theme-toggle-dashboard">
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications-dashboard">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6 custom-scrollbar">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold font-[Poppins] mb-2">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your account today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsLoading ? (
                [...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <>
                  <StatCard
                    title="Active Jobs"
                    value={stats?.activeJobs || 0}
                    icon={Briefcase}
                    trend="up"
                    trendValue="+12%"
                    href="/dashboard/jobs"
                  />
                  <StatCard
                    title="Pending Bids"
                    value={stats?.pendingBids || 0}
                    icon={FileText}
                    href="/dashboard/bids"
                  />
                  <StatCard
                    title="Wallet Balance"
                    value={`₹${Number(stats?.walletBalance || user?.walletBalance || 0).toLocaleString("en-IN")}`}
                    icon={Wallet}
                    href="/wallet"
                  />
                  <StatCard
                    title="Total Earnings"
                    value={`₹${Number(stats?.earnings || 0).toLocaleString("en-IN")}`}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="+8%"
                  />
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Link href="/post-job">
                <Card className="hover-elevate cursor-pointer bg-primary text-primary-foreground">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold">Post a New Job</p>
                      <p className="text-sm opacity-80">Find skilled workers</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/jobs">
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Browse Jobs</p>
                      <p className="text-sm text-muted-foreground">Find work opportunities</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/marketplace">
                <Card className="hover-elevate cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Equipment Market</p>
                      <p className="text-sm text-muted-foreground">Rent heavy equipment</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest updates and notifications</CardDescription>
                    </div>
                    <Link href="/notifications">
                      <Button variant="ghost" size="sm" className="gap-1" data-testid="button-view-all-activity">
                        View All <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ActivityItem
                      icon={FileText}
                      title="New bid received"
                      description="Rajesh Kumar bid ₹15,000 on 'Mason for Commercial Building'"
                      time="2h ago"
                      type="bid"
                    />
                    <ActivityItem
                      icon={CheckCircle}
                      title="Job completed"
                      description="'Plumber for Residential Complex' marked as completed"
                      time="5h ago"
                      type="job"
                    />
                    <ActivityItem
                      icon={MessageSquare}
                      title="New message"
                      description="Priya Sharma sent you a message"
                      time="1d ago"
                      type="message"
                    />
                    <ActivityItem
                      icon={Wallet}
                      title="Payment received"
                      description="₹25,000 credited to your wallet"
                      time="2d ago"
                      type="payment"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Recent Jobs */}
              <div>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle>Your Jobs</CardTitle>
                      <CardDescription>Active job postings</CardDescription>
                    </div>
                    <Link href="/dashboard/jobs">
                      <Button variant="ghost" size="sm" className="gap-1">
                        View All <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {jobsLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-sm line-clamp-1">Mason for Commercial Building</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              Mumbai
                              <span className="mx-1">•</span>
                              <FileText className="h-3 w-3" />
                              8 bids
                            </div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-sm line-clamp-1">Electrician Needed</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              Pune
                              <span className="mx-1">•</span>
                              <FileText className="h-3 w-3" />
                              5 bids
                            </div>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-sm line-clamp-1">Painter for Home</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              Delhi
                              <span className="mx-1">•</span>
                              <FileText className="h-3 w-3" />
                              12 bids
                            </div>
                          </div>
                          <Badge>In Progress</Badge>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
