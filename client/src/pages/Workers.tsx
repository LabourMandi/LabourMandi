import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
  Star,
  Filter,
  Grid3X3,
  List,
  Briefcase,
  Clock,
  Shield,
  MessageSquare,
  Users,
  ChevronRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { User } from "@shared/schema";

const skills = [
  "Masonry",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Welding",
  "Roofing",
  "Flooring",
  "HVAC",
  "Tiling",
];

const locations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad"];

const mockWorkers: Partial<User>[] = [
  {
    id: "w1",
    firstName: "Rajesh",
    lastName: "Kumar",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    bio: "Expert mason with 10+ years of experience in commercial and residential construction. Specialized in brick and block work.",
    location: "Mumbai, Maharashtra",
    skills: ["Masonry", "Plastering", "Tiling"],
    experience: 10,
    hourlyRate: "150",
    availability: "available",
    rating: "4.9",
    totalJobs: 156,
    phoneVerified: true,
  },
  {
    id: "w2",
    firstName: "Suresh",
    lastName: "Patel",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    bio: "Licensed electrician with expertise in industrial and commercial wiring. Safety certified.",
    location: "Pune, Maharashtra",
    skills: ["Electrical", "Wiring", "Panel Installation"],
    experience: 8,
    hourlyRate: "200",
    availability: "available",
    rating: "4.8",
    totalJobs: 98,
    phoneVerified: true,
  },
  {
    id: "w3",
    firstName: "Amit",
    lastName: "Singh",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    bio: "Professional plumber specializing in residential and commercial plumbing systems.",
    location: "Delhi",
    skills: ["Plumbing", "Pipe Fitting", "Drainage"],
    experience: 6,
    hourlyRate: "180",
    availability: "busy",
    rating: "4.7",
    totalJobs: 72,
    phoneVerified: true,
  },
  {
    id: "w4",
    firstName: "Vikram",
    lastName: "Sharma",
    profileImageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200",
    bio: "Experienced carpenter with expertise in furniture making and interior woodwork.",
    location: "Bangalore, Karnataka",
    skills: ["Carpentry", "Furniture", "Cabinet Making"],
    experience: 12,
    hourlyRate: "220",
    availability: "available",
    rating: "5.0",
    totalJobs: 203,
    phoneVerified: true,
  },
  {
    id: "w5",
    firstName: "Ravi",
    lastName: "Verma",
    profileImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    bio: "Professional painter for interior and exterior work. Clean and timely delivery.",
    location: "Chennai, Tamil Nadu",
    skills: ["Painting", "Wall Texturing", "Waterproofing"],
    experience: 5,
    hourlyRate: "130",
    availability: "available",
    rating: "4.6",
    totalJobs: 45,
    phoneVerified: false,
  },
  {
    id: "w6",
    firstName: "Deepak",
    lastName: "Yadav",
    profileImageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200",
    bio: "Certified welder with experience in structural and industrial welding.",
    location: "Hyderabad, Telangana",
    skills: ["Welding", "Fabrication", "Steel Work"],
    experience: 7,
    hourlyRate: "250",
    availability: "available",
    rating: "4.8",
    totalJobs: 89,
    phoneVerified: true,
  },
  {
    id: "w7",
    firstName: "Manoj",
    lastName: "Gupta",
    profileImageUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200",
    bio: "Skilled roofer with expertise in all types of roofing systems.",
    location: "Mumbai, Maharashtra",
    skills: ["Roofing", "Waterproofing", "Insulation"],
    experience: 9,
    hourlyRate: "190",
    availability: "unavailable",
    rating: "4.7",
    totalJobs: 67,
    phoneVerified: true,
  },
  {
    id: "w8",
    firstName: "Santosh",
    lastName: "Reddy",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    bio: "Flooring specialist with expertise in tiles, marble, and wooden flooring.",
    location: "Bangalore, Karnataka",
    skills: ["Flooring", "Tiling", "Marble Work"],
    experience: 4,
    hourlyRate: "160",
    availability: "available",
    rating: "4.5",
    totalJobs: 34,
    phoneVerified: true,
  },
];

function WorkerCard({ worker }: { worker: Partial<User> }) {
  const availabilityColors = {
    available: "bg-green-500/10 text-green-600 border-green-200",
    busy: "bg-orange-500/10 text-orange-600 border-orange-200",
    unavailable: "bg-red-500/10 text-red-600 border-red-200",
  };

  return (
    <Card className="hover-elevate" data-testid={`worker-card-${worker.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarImage src={worker.profileImageUrl || undefined} />
            <AvatarFallback className="text-lg">
              {worker.firstName?.[0]}
              {worker.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {worker.firstName} {worker.lastName}
                </h3>
                {worker.phoneVerified && (
                  <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
                    <Shield className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <Badge
                variant="outline"
                className={`capitalize ${availabilityColors[worker.availability as keyof typeof availabilityColors]}`}
              >
                {worker.availability}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {worker.location}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                {worker.rating}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {worker.totalJobs} jobs
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {worker.bio}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {worker.skills?.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {(worker.skills?.length || 0) > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{(worker.skills?.length || 0) - 4}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <p className="font-bold text-lg text-primary">
                  ₹{Number(worker.hourlyRate).toLocaleString()}/hr
                </p>
                <p className="text-xs text-muted-foreground">
                  {worker.experience} years experience
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/messages?user=${worker.id}`}>
                  <Button size="sm" variant="outline" className="gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Message
                  </Button>
                </Link>
                <Link href={`/workers/${worker.id}`}>
                  <Button size="sm" data-testid={`button-view-worker-${worker.id}`}>
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Workers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [rateRange, setRateRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("rating");

  const displayWorkers = mockWorkers.filter((worker) => {
    const matchesSearch = !searchQuery ||
      `${worker.firstName} ${worker.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = selectedLocation === "All Locations" ||
      worker.location?.includes(selectedLocation);
    const matchesSkills = selectedSkills.length === 0 ||
      selectedSkills.some((s) => worker.skills?.includes(s));
    const matchesRate = Number(worker.hourlyRate) >= rateRange[0] && Number(worker.hourlyRate) <= rateRange[1];

    return matchesSearch && matchesLocation && matchesSkills && matchesRate;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <Breadcrumbs items={[{ label: "Find Workers" }]} />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-[Poppins] mb-2">Find Skilled Workers</h1>
              <p className="text-muted-foreground">
                Browse {displayWorkers.length} verified professionals
              </p>
            </div>
            <Link href="/post-job">
              <Button className="gap-2" data-testid="button-post-job">
                <Briefcase className="h-4 w-4" />
                Post a Job Instead
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workers by name, skill, or keyword..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-workers"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[160px]" data-testid="select-worker-location">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]" data-testid="select-sort-workers">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="jobs">Most Jobs</SelectItem>
                  <SelectItem value="rate-low">Rate: Low to High</SelectItem>
                  <SelectItem value="rate-high">Rate: High to Low</SelectItem>
                  <SelectItem value="experience">Most Experienced</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2" data-testid="button-worker-filters">
                    <Filter className="h-4 w-4" />
                    Filters
                    {selectedSkills.length > 0 && (
                      <Badge className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                        {selectedSkills.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Workers</SheetTitle>
                    <SheetDescription>Narrow down your search</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-4 block">
                        Hourly Rate: ₹{rateRange[0]} - ₹{rateRange[1]}
                      </Label>
                      <Slider
                        value={rateRange}
                        onValueChange={setRateRange}
                        min={0}
                        max={500}
                        step={10}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Skills</Label>
                      <div className="space-y-2">
                        {skills.map((skill) => (
                          <div key={skill} className="flex items-center gap-2">
                            <Checkbox
                              id={`skill-${skill}`}
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSkills([...selectedSkills, skill]);
                                } else {
                                  setSelectedSkills(selectedSkills.filter((s) => s !== skill));
                                }
                              }}
                            />
                            <Label htmlFor={`skill-${skill}`} className="cursor-pointer">
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Availability</Label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm text-green-600">Available</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-orange-600">Busy</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Verification</Label>
                      <div className="flex items-center gap-2">
                        <Checkbox id="verified-only" defaultChecked />
                        <Label htmlFor="verified-only" className="cursor-pointer">
                          Show verified workers only
                        </Label>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedSkills([]);
                        setRateRange([0, 500]);
                        setSelectedLocation("All Locations");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => setSelectedSkills(selectedSkills.filter((s) => s !== skill))}
                >
                  {skill}
                  <span className="ml-1">&times;</span>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSkills([])}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Workers List */}
          {displayWorkers.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No workers found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLocation("All Locations");
                    setSelectedSkills([]);
                    setRateRange([0, 500]);
                  }}
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {displayWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
