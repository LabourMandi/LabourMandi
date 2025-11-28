import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Wallet,
  Bell,
  Settings,
  HardHat,
  Users,
  Wrench,
  TrendingUp,
  Star,
  Shield,
  LogOut,
} from "lucide-react";

export function DashboardSidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  const mainMenuItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/dashboard/bids", label: "My Bids", icon: FileText },
    { href: "/messages", label: "Messages", icon: MessageSquare, badge: 5 },
    { href: "/wallet", label: "Wallet", icon: Wallet },
    { href: "/notifications", label: "Notifications", icon: Bell, badge: 3 },
  ];

  const workerMenuItems = [
    { href: "/profile", label: "My Profile", icon: Users },
    { href: "/dashboard/reviews", label: "Reviews", icon: Star },
    { href: "/dashboard/earnings", label: "Earnings", icon: TrendingUp },
  ];

  const employerMenuItems = [
    { href: "/post-job", label: "Post a Job", icon: HardHat },
    { href: "/workers", label: "Find Workers", icon: Users },
    { href: "/marketplace", label: "Equipment", icon: Wrench },
  ];

  const settingsMenuItems = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/kyc", label: "KYC Verification", icon: Shield },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <HardHat className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-lg font-[Poppins]">
            Labour<span className="text-sidebar-primary">Mandi</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="custom-scrollbar">
        {/* User Profile Card */}
        {user && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {user.role}
                  </Badge>
                  {user.phoneVerified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href} data-testid={`sidebar-${item.href.replace(/\//g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className="ml-auto h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Worker Menu */}
        {user?.role === "worker" && (
          <SidebarGroup>
            <SidebarGroupLabel>Worker Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {workerMenuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Employer Menu */}
        {(user?.role === "employer" || user?.role === "admin") && (
          <SidebarGroup>
            <SidebarGroupLabel>Employer Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {employerMenuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/api/logout" className="text-destructive" data-testid="sidebar-logout">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
