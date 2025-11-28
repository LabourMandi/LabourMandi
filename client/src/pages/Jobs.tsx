import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Filter,
  ChevronDown,
  Grid3X3,
  List,
  Star,
  Users,
  IndianRupee,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Job } from "@shared/schema";

const categories = [
  "All Categories",
  "Construction",
  "Plumbing",
  "Electrical",
  "Painting",
  "Carpentry",
  "Masonry",
  "Welding",
  "Roofing",
  "Flooring",
];

const locations = [
  "All Locations",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Pune",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Ahmedabad",
];

const experienceLevels = ["beginner", "intermediate", "expert"];

const mockJobs: Job[] = [
  {
    id: "1",
    employerId: "emp1",
    categoryId: "cat1",
    title: "Need 5 Skilled Masons for Building Construction",
    description: "Looking for experienced masons for a 6-month commercial building project. Must have experience with brick and block work.",
    requirements: "5+ years experience, own tools",
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
  },
  {
    id: "2",
    employerId: "emp2",
    categoryId: "cat2",
    title: "Electrician Required for Commercial Wiring",
    description: "Need licensed electrician for complete wiring of a new office space. 2000 sq ft area.",
    requirements: "Licensed electrician, 3+ years commercial experience",
    budgetMin: "15000",
    budgetMax: "20000",
    budgetType: "fixed",
    location: "Pune, Maharashtra",
    duration: "2 weeks",
    experienceLevel: "intermediate",
    status: "open",
    bidsCount: 8,
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    employerId: "emp3",
    categoryId: "cat3",
    title: "Plumber for Residential Complex - 50 Units",
    description: "Experienced plumber needed for a residential complex with 50 units. Work includes installation of fixtures and piping.",
    requirements: "Experience with multi-unit projects",
    budgetMin: "600",
    budgetMax: "800",
    budgetType: "daily",
    location: "Bangalore, Karnataka",
    duration: "3 months",
    experienceLevel: "expert",
    status: "open",
    bidsCount: 15,
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    employerId: "emp4",
    categoryId: "cat4",
    title: "Painters Needed for School Renovation",
    description: "Looking for team of painters for school building renovation. Interior and exterior work.",
    requirements: "Team of 3-5 painters, own equipment",
    budgetMin: "50000",
    budgetMax: "75000",
    budgetType: "fixed",
    location: "Delhi",
    duration: "1 month",
    experienceLevel: "intermediate",
    status: "open",
    bidsCount: 6,
    postedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    employerId: "emp5",
    categoryId: "cat5",
    title: "Carpenter for Custom Furniture",
    description: "Need skilled carpenter for making custom office furniture. Includes desks, cabinets, and shelving.",
    requirements: "Experience with office furniture, portfolio required",
    budgetMin: "25000",
    budgetMax: "35000",
    budgetType: "fixed",
    location: "Chennai, Tamil Nadu",
    duration: "3 weeks",
    experienceLevel: "expert",
    status: "open",
    bidsCount: 10,
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    employerId: "emp6",
    categoryId: "cat6",
    title: "Welder for Steel Structure",
    description: "Experienced welder needed for industrial steel structure fabrication and installation.",
    requirements: "AWS certified preferred, safety equipment",
    budgetMin: "1000",
    budgetMax: "1500",
    budgetType: "daily",
    location: "Hyderabad, Telangana",
    duration: "2 months",
    experienceLevel: "expert",
    status: "open",
    bidsCount: 4,
    postedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatBudget(job: Job): string {
  const min = Number(job.budgetMin);
  const max = Number(job.budgetMax);
  const type = job.budgetType === "daily" ? "/day" : job.budgetType === "hourly" ? "/hr" : "";

  if (min && max) {
    return `₹${min.toLocaleString()}-${max.toLocaleString()}${type}`;
  }
  if (min) return `₹${min.toLocaleString()}${type}`;
  if (max) return `₹${max.toLocaleString()}${type}`;
  return "Negotiable";
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="hover-elevate cursor-pointer h-full" data-testid={`job-card-${job.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {job.experienceLevel === "expert" && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
                <Badge variant="secondary" className="capitalize text-xs">
                  {job.experienceLevel}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg line-clamp-2 mb-2">{job.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {job.duration}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {job.bidsCount} bids
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="font-bold text-lg text-primary">{formatBudget(job)}</p>
              <p className="text-xs text-muted-foreground">
                Posted {formatTimeAgo(new Date(job.postedAt!))}
              </p>
            </div>
            <Button size="sm" data-testid={`button-view-job-${job.id}`}>
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function JobCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="pt-4 border-t flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  budgetRange,
  setBudgetRange,
  selectedExperience,
  setSelectedExperience,
}: {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedLocation: string;
  setSelectedLocation: (v: string) => void;
  budgetRange: number[];
  setBudgetRange: (v: number[]) => void;
  selectedExperience: string[];
  setSelectedExperience: (v: string[]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger data-testid="select-category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Location</Label>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger data-testid="select-location">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Range */}
      <div>
        <Label className="text-sm font-medium mb-4 block">
          Budget Range: ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
        </Label>
        <Slider
          value={budgetRange}
          onValueChange={setBudgetRange}
          min={0}
          max={100000}
          step={1000}
          className="mb-2"
          data-testid="slider-budget"
        />
      </div>

      {/* Experience Level */}
      <div>
        <Label className="text-sm font-medium mb-3 block">Experience Level</Label>
        <div className="space-y-2">
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox
                id={`exp-${level}`}
                checked={selectedExperience.includes(level)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedExperience([...selectedExperience, level]);
                  } else {
                    setSelectedExperience(selectedExperience.filter((l) => l !== level));
                  }
                }}
                data-testid={`checkbox-${level}`}
              />
              <Label htmlFor={`exp-${level}`} className="capitalize cursor-pointer">
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategory("All Categories");
          setSelectedLocation("All Locations");
          setBudgetRange([0, 100000]);
          setSelectedExperience([]);
        }}
        data-testid="button-clear-filters"
      >
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );
}

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [budgetRange, setBudgetRange] = useState([0, 100000]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs", selectedCategory, selectedLocation, sortBy],
  });

  // Use mock data for now
  const displayJobs = mockJobs.filter((job) => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || true;
    const matchesLocation = selectedLocation === "All Locations" || 
      job.location?.includes(selectedLocation);
    const matchesBudget = Number(job.budgetMin || 0) >= budgetRange[0] && 
      Number(job.budgetMax || 100000) <= budgetRange[1];
    const matchesExperience = selectedExperience.length === 0 || 
      selectedExperience.includes(job.experienceLevel || "");
    
    return matchesSearch && matchesCategory && matchesLocation && matchesBudget && matchesExperience;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <Breadcrumbs items={[{ label: "Jobs" }]} />

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-[Poppins] mb-2">Browse Jobs</h1>
              <p className="text-muted-foreground">
                Find your next opportunity from {displayJobs.length} available jobs
              </p>
            </div>
            <Link href="/post-job">
              <Button className="gap-2" data-testid="button-post-job">
                <Briefcase className="h-4 w-4" />
                Post a Job
              </Button>
            </Link>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs by title, skills, or keywords..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-jobs"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                  <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                  <SelectItem value="bids">Most Bids</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-view-grid"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  data-testid="button-view-list"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" className="gap-2" data-testid="button-filter-mobile">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow down your job search</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      selectedLocation={selectedLocation}
                      setSelectedLocation={setSelectedLocation}
                      budgetRange={budgetRange}
                      setBudgetRange={setBudgetRange}
                      selectedExperience={selectedExperience}
                      setSelectedExperience={setSelectedExperience}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  <FilterSidebar
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    budgetRange={budgetRange}
                    setBudgetRange={setBudgetRange}
                    selectedExperience={selectedExperience}
                    setSelectedExperience={setSelectedExperience}
                  />
                </CardContent>
              </Card>
            </aside>

            {/* Jobs Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
                  {[...Array(6)].map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : displayJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search criteria
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All Categories");
                        setSelectedLocation("All Locations");
                        setBudgetRange([0, 100000]);
                        setSelectedExperience([]);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
                  {displayJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
