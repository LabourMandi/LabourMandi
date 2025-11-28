import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs";
import JobDetail from "@/pages/JobDetail";
import PostJob from "@/pages/PostJob";
import Marketplace from "@/pages/Marketplace";
import Workers from "@/pages/Workers";
import Wallet from "@/pages/Wallet";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={isAuthenticated ? Home : Landing} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/jobs/:id" component={JobDetail} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/marketplace/:category" component={Marketplace} />
      <Route path="/workers" component={Workers} />
      
      {/* Auth Required Routes */}
      <Route path="/dashboard" component={Home} />
      <Route path="/dashboard/jobs" component={Home} />
      <Route path="/dashboard/bids" component={Home} />
      <Route path="/post-job" component={PostJob} />
      <Route path="/wallet" component={Wallet} />
      <Route path="/messages" component={Messages} />
      <Route path="/profile" component={Profile} />
      <Route path="/notifications" component={Home} />
      <Route path="/settings" component={Home} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
