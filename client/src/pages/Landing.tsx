import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Search,
  MapPin,
  Briefcase,
  Users,
  Shield,
  Star,
  ChevronRight,
  Wrench,
  HardHat,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  Building2,
} from "lucide-react";
import { useState } from "react";

const jobCategories = [
  { name: "Construction", icon: Building2, count: 2450 },
  { name: "Plumbing", icon: Wrench, count: 890 },
  { name: "Electrical", icon: Zap, count: 1230 },
  { name: "Painting", icon: HardHat, count: 670 },
  { name: "Carpentry", icon: HardHat, count: 540 },
  { name: "Masonry", icon: Building2, count: 380 },
];

const featuredJobs = [
  {
    id: "1",
    title: "Need 5 Skilled Masons for Building Construction",
    employer: "ABC Builders",
    location: "Mumbai, Maharashtra",
    budget: "₹800-1200/day",
    bids: 12,
    postedAt: "2 hours ago",
    urgent: true,
  },
  {
    id: "2",
    title: "Electrician Required for Commercial Wiring",
    employer: "Tech Infra Ltd",
    location: "Pune, Maharashtra",
    budget: "₹15,000 (Fixed)",
    bids: 8,
    postedAt: "5 hours ago",
    urgent: false,
  },
  {
    id: "3",
    title: "Plumber for Residential Complex",
    employer: "Green Homes",
    location: "Bangalore, Karnataka",
    budget: "₹600-800/day",
    bids: 15,
    postedAt: "1 day ago",
    urgent: false,
  },
];

const equipmentCategories = [
  { name: "JCB", slug: "jcb", image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400" },
  { name: "Crane", slug: "crane", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" },
  { name: "Bulldozer", slug: "bulldozer", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { name: "Excavator", slug: "excavator", image: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=400" },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Contractor",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    content: "LabourMandi transformed how I find skilled workers. Within hours, I get verified bids from qualified professionals.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Skilled Worker",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    content: "I've doubled my income since joining. The platform connects me with quality jobs matching my skills perfectly.",
    rating: 5,
  },
];

const stats = [
  { label: "Active Workers", value: "50,000+", icon: Users },
  { label: "Jobs Completed", value: "1,00,000+", icon: CheckCircle },
  { label: "Cities Covered", value: "100+", icon: MapPin },
  { label: "Customer Rating", value: "4.8/5", icon: Star },
];

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920')",
          }}
        />
        <div className="absolute inset-0 hero-gradient" />
        
        <div className="relative z-10 container px-4 md:px-6 text-center">
          <Badge className="mb-6 bg-accent text-accent-foreground px-4 py-1.5">
            India's #1 Labor Marketplace
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-[Poppins] leading-tight">
            Find Skilled Labor or<br />
            <span className="text-accent">Post Your Next Project</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with verified workers, rent heavy equipment, and manage your
            construction projects - all in one place.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur rounded-xl p-2 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search jobs or skills..."
                  className="pl-10 h-12 border-0 bg-transparent text-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-hero-search"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Location..."
                  className="pl-10 h-12 border-0 bg-transparent text-foreground"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  data-testid="input-hero-location"
                />
              </div>
              <Link href={`/jobs?q=${searchQuery}&location=${searchLocation}`}>
                <Button size="lg" className="h-12 px-8" data-testid="button-hero-search">
                  <Search className="h-5 w-5 mr-2" />
                  Search Jobs
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link href="/jobs">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" data-testid="button-browse-jobs">
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            </Link>
            <Link href="/post-job">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" data-testid="button-post-job-cta">
                <HardHat className="h-4 w-4 mr-2" />
                Post a Job
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" data-testid="button-rent-equipment">
                <Wrench className="h-4 w-4 mr-2" />
                Rent Equipment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">Popular Categories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-[Poppins] mb-4">
              Browse Jobs by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find opportunities in your area of expertise or explore new skills
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {jobCategories.map((category) => (
              <Link key={category.name} href={`/jobs?category=${category.name.toLowerCase()}`}>
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} jobs</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge className="mb-4">Fresh Opportunities</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-[Poppins]">
                Featured Jobs
              </h2>
            </div>
            <Link href="/jobs">
              <Button variant="ghost" className="gap-2" data-testid="button-view-all-jobs">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {job.urgent && (
                        <Badge variant="destructive" className="mb-2">Urgent</Badge>
                      )}
                      <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.employer}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {job.postedAt}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="font-semibold text-primary">{job.budget}</p>
                      <p className="text-xs text-muted-foreground">{job.bids} bids</p>
                    </div>
                    <Link href={`/jobs/${job.id}`}>
                      <Button size="sm" data-testid={`button-view-job-${job.id}`}>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Marketplace */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge className="mb-4">Equipment Rental</Badge>
              <h2 className="text-3xl md:text-4xl font-bold font-[Poppins]">
                Heavy Equipment Marketplace
              </h2>
            </div>
            <Link href="/marketplace">
              <Button variant="ghost" className="gap-2" data-testid="button-browse-equipment">
                Browse All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {equipmentCategories.map((category) => (
              <Link key={category.slug} href={`/marketplace/${category.slug}`}>
                <Card className="hover-elevate cursor-pointer overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-semibold text-white text-lg">{category.name}</h3>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-[Poppins] mb-4">
              How LabourMandi Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and find the perfect match for your project
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Post Your Job</h3>
              <p className="text-muted-foreground">
                Describe your project requirements, budget, and timeline. It takes just 2 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Receive Bids</h3>
              <p className="text-muted-foreground">
                Verified workers send proposals with their rates and experience. Compare and choose.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Work Done</h3>
              <p className="text-muted-foreground">
                Hire the best match, track progress, and pay securely through our platform.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/post-job">
              <Button size="lg" className="gap-2" data-testid="button-get-started">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-[Poppins] mb-4">
              Trusted by Thousands
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-[Poppins] mb-4">
            Ready to Transform Your Workforce?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of employers and skilled workers who trust LabourMandi for their construction needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/api/login">
              <Button size="lg" variant="secondary" className="gap-2" data-testid="button-cta-signup">
                <Users className="h-5 w-5" />
                Sign Up Free
              </Button>
            </a>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-learn-more">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
