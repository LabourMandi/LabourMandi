import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  Star,
  MessageSquare,
  Shield,
  CheckCircle,
  Users,
  IndianRupee,
  Send,
  Share2,
  Heart,
  Flag,
  ArrowLeft,
} from "lucide-react";
import type { Job, Bid, User } from "@shared/schema";

const mockJob: Job & { employer?: Partial<User> } = {
  id: "1",
  employerId: "emp1",
  categoryId: "cat1",
  title: "Need 5 Skilled Masons for Building Construction",
  description: `We are looking for experienced masons for a 6-month commercial building project in Mumbai. 

The project involves:
- Brick and block work for a 5-story commercial building
- Foundation work and structural elements
- Interior and exterior wall construction
- Finishing work including plastering

We need a team of 5 skilled masons who can work together. The project is expected to start within 2 weeks of hiring.`,
  requirements: `- Minimum 5 years of experience in commercial construction
- Experience with brick and block masonry
- Own basic tools and equipment
- Ability to read and follow construction blueprints
- Physical fitness for demanding work
- Team work and communication skills`,
  budgetMin: "800",
  budgetMax: "1200",
  budgetType: "daily",
  location: "Mumbai, Maharashtra",
  duration: "6 months",
  experienceLevel: "expert",
  status: "open",
  bidsCount: 12,
  postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
  updatedAt: new Date(),
  employer: {
    id: "emp1",
    firstName: "ABC",
    lastName: "Builders",
    profileImageUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
    rating: "4.8",
    totalJobs: 45,
    location: "Mumbai, Maharashtra",
  },
};

const mockBids: (Bid & { worker?: Partial<User> })[] = [
  {
    id: "b1",
    jobId: "1",
    workerId: "w1",
    proposedRate: "1000",
    rateType: "daily",
    timeline: "Can start immediately",
    coverLetter: "I have 8 years of experience in commercial construction. My team of 5 has worked on similar projects.",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(),
    worker: {
      id: "w1",
      firstName: "Rajesh",
      lastName: "Kumar",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: "4.9",
      totalJobs: 23,
      location: "Mumbai",
    },
  },
  {
    id: "b2",
    jobId: "1",
    workerId: "w2",
    proposedRate: "950",
    rateType: "daily",
    timeline: "Available in 1 week",
    coverLetter: "Experienced mason with 6 years in the industry. I bring my own team and equipment.",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(),
    worker: {
      id: "w2",
      firstName: "Suresh",
      lastName: "Patel",
      profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      rating: "4.7",
      totalJobs: 18,
      location: "Thane",
    },
  },
  {
    id: "b3",
    jobId: "1",
    workerId: "w3",
    proposedRate: "1100",
    rateType: "daily",
    timeline: "Can start in 3 days",
    coverLetter: "Expert mason specializing in commercial buildings. Premium quality work guaranteed.",
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    updatedAt: new Date(),
    worker: {
      id: "w3",
      firstName: "Amit",
      lastName: "Singh",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      rating: "5.0",
      totalJobs: 31,
      location: "Navi Mumbai",
    },
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidTimeline, setBidTimeline] = useState("");
  const [bidCoverLetter, setBidCoverLetter] = useState("");
  const [bidRateType, setBidRateType] = useState("daily");

  const { data: job, isLoading: jobLoading } = useQuery<Job & { employer?: Partial<User> }>({
    queryKey: ["/api/jobs", id],
  });

  const { data: bids, isLoading: bidsLoading } = useQuery<(Bid & { worker?: Partial<User> })[]>({
    queryKey: ["/api/jobs", id, "bids"],
  });

  const submitBidMutation = useMutation({
    mutationFn: async (data: { proposedRate: string; timeline: string; coverLetter: string; rateType: string }) => {
      return apiRequest("POST", `/api/jobs/${id}/bids`, data);
    },
    onSuccess: () => {
      toast({ title: "Bid submitted successfully!" });
      setBidDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", id, "bids"] });
    },
    onError: () => {
      toast({ title: "Failed to submit bid", variant: "destructive" });
    },
  });

  // Use mock data
  const displayJob = mockJob;
  const displayBids = mockBids;

  const handleSubmitBid = () => {
    if (!bidAmount || !bidTimeline || !bidCoverLetter) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    submitBidMutation.mutate({
      proposedRate: bidAmount,
      timeline: bidTimeline,
      coverLetter: bidCoverLetter,
      rateType: bidRateType,
    });
  };

  const isEmployer = user?.id === displayJob.employerId;
  const isWorker = user?.role === "worker";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <Breadcrumbs items={[{ label: "Jobs", href: "/jobs" }, { label: displayJob.title }]} />

          <div className="mb-4">
            <Link href="/jobs">
              <Button variant="ghost" className="gap-2 pl-0" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="capitalize">{displayJob.experienceLevel}</Badge>
                        <Badge variant="secondary">{displayJob.status}</Badge>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] mb-4">
                        {displayJob.title}
                      </h1>
                      <div className="flex flex-wrap gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {displayJob.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {displayJob.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {formatTimeAgo(new Date(displayJob.postedAt!))}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">
                        ₹{Number(displayJob.budgetMin).toLocaleString()}-{Number(displayJob.budgetMax).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        per {displayJob.budgetType === "daily" ? "day" : displayJob.budgetType === "hourly" ? "hour" : "project"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Heart className="h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 text-destructive">
                      <Flag className="h-4 w-4" />
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{displayJob.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{displayJob.requirements}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Bids Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Bids ({displayBids.length})
                    </CardTitle>
                    <CardDescription>Workers who have submitted proposals</CardDescription>
                  </div>
                  {displayJob.status === "open" && isWorker && !isEmployer && (
                    <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="gap-2" data-testid="button-place-bid">
                          <Send className="h-4 w-4" />
                          Place Bid
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Submit Your Bid</DialogTitle>
                          <DialogDescription>
                            Provide your proposed rate and timeline for this job
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="bidAmount">Proposed Rate (₹)</Label>
                              <Input
                                id="bidAmount"
                                type="number"
                                placeholder="Enter amount"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                data-testid="input-bid-amount"
                              />
                            </div>
                            <div>
                              <Label htmlFor="rateType">Rate Type</Label>
                              <Select value={bidRateType} onValueChange={setBidRateType}>
                                <SelectTrigger data-testid="select-rate-type">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hourly">Per Hour</SelectItem>
                                  <SelectItem value="daily">Per Day</SelectItem>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="timeline">Timeline/Availability</Label>
                            <Input
                              id="timeline"
                              placeholder="e.g., Can start immediately, Available in 1 week"
                              value={bidTimeline}
                              onChange={(e) => setBidTimeline(e.target.value)}
                              data-testid="input-bid-timeline"
                            />
                          </div>
                          <div>
                            <Label htmlFor="coverLetter">Cover Letter</Label>
                            <Textarea
                              id="coverLetter"
                              placeholder="Describe your experience and why you're the best fit for this job..."
                              rows={5}
                              value={bidCoverLetter}
                              onChange={(e) => setBidCoverLetter(e.target.value)}
                              data-testid="input-bid-cover-letter"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setBidDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmitBid}
                            disabled={submitBidMutation.isPending}
                            data-testid="button-submit-bid"
                          >
                            {submitBidMutation.isPending ? "Submitting..." : "Submit Bid"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {displayBids.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No bids yet. Be the first to bid!</p>
                    </div>
                  ) : (
                    displayBids.map((bid) => (
                      <Card key={bid.id} className="hover-elevate" data-testid={`bid-card-${bid.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={bid.worker?.profileImageUrl} />
                              <AvatarFallback>
                                {bid.worker?.firstName?.[0] || "W"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    {bid.worker?.firstName} {bid.worker?.lastName}
                                  </span>
                                  <Badge variant="outline" className="gap-1">
                                    <Star className="h-3 w-3 fill-accent text-accent" />
                                    {bid.worker?.rating}
                                  </Badge>
                                </div>
                                <span className="text-xl font-bold text-primary">
                                  ₹{Number(bid.proposedRate).toLocaleString()}/{bid.rateType === "daily" ? "day" : bid.rateType === "hourly" ? "hr" : ""}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {bid.worker?.totalJobs} jobs completed • {bid.worker?.location}
                              </p>
                              <p className="text-sm mb-2">{bid.coverLetter}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {bid.timeline}
                                </span>
                                <div className="flex gap-2">
                                  <Link href={`/messages?user=${bid.workerId}`}>
                                    <Button size="sm" variant="outline" className="gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      Message
                                    </Button>
                                  </Link>
                                  {isEmployer && (
                                    <Button size="sm" data-testid={`button-accept-bid-${bid.id}`}>
                                      Accept Bid
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Employer Card */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Employer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={displayJob.employer?.profileImageUrl} />
                      <AvatarFallback className="text-lg">
                        {displayJob.employer?.firstName?.[0] || "E"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">
                        {displayJob.employer?.firstName} {displayJob.employer?.lastName}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {displayJob.employer?.location}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-bold">{displayJob.employer?.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="font-bold">{displayJob.employer?.totalJobs}</p>
                      <p className="text-xs text-muted-foreground">Jobs Posted</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                    <Shield className="h-4 w-4" />
                    <span>Verified Employer</span>
                  </div>

                  <Link href={`/messages?user=${displayJob.employerId}`}>
                    <Button variant="outline" className="w-full gap-2" data-testid="button-contact-employer">
                      <MessageSquare className="h-4 w-4" />
                      Contact Employer
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Job Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Bids</span>
                    <span className="font-semibold">{displayJob.bidsCount}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg. Bid</span>
                    <span className="font-semibold">₹1,017/day</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-semibold">
                      {new Date(displayJob.deadline!).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/jobs/2" className="block">
                    <div className="p-3 rounded-lg bg-muted/50 hover-elevate">
                      <p className="font-medium text-sm line-clamp-2 mb-1">
                        Electrician Required for Commercial Wiring
                      </p>
                      <p className="text-sm text-primary font-semibold">₹15,000-20,000</p>
                    </div>
                  </Link>
                  <Link href="/jobs/3" className="block">
                    <div className="p-3 rounded-lg bg-muted/50 hover-elevate">
                      <p className="font-medium text-sm line-clamp-2 mb-1">
                        Plumber for Residential Complex
                      </p>
                      <p className="text-sm text-primary font-semibold">₹600-800/day</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
