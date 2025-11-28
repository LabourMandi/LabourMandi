import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  IndianRupee,
  Clock,
  Phone,
  CheckCircle,
  Wrench,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Tool, ToolCategory } from "@shared/schema";

const toolCategories: ToolCategory[] = [
  { id: "jcb", name: "JCB", slug: "jcb", icon: "jcb", description: "JCB and Backhoe Loaders", imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400", createdAt: new Date() },
  { id: "hydra", name: "Hydra Crane", slug: "hydra", icon: "hydra", description: "Hydraulic Mobile Cranes", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", createdAt: new Date() },
  { id: "crane", name: "Tower Crane", slug: "crane", icon: "crane", description: "Tower and Overhead Cranes", imageUrl: "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=400", createdAt: new Date() },
  { id: "bulldozer", name: "Bulldozer", slug: "bulldozer", icon: "bulldozer", description: "Bulldozers and Crawlers", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", createdAt: new Date() },
  { id: "excavator", name: "Excavator", slug: "excavator", icon: "excavator", description: "Excavators and Diggers", imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=400", createdAt: new Date() },
  { id: "mixer", name: "Concrete Mixer", slug: "mixer", icon: "mixer", description: "Transit and Batch Mixers", imageUrl: "https://images.unsplash.com/photo-1562077981-4d7eafd44932?w=400", createdAt: new Date() },
  { id: "forklift", name: "Forklift", slug: "forklift", icon: "forklift", description: "Forklifts and Pallet Trucks", imageUrl: "https://images.unsplash.com/photo-1560435650-7ec2e17ba926?w=400", createdAt: new Date() },
  { id: "roller", name: "Road Roller", slug: "roller", icon: "roller", description: "Compactors and Rollers", imageUrl: "https://images.unsplash.com/photo-1621955511667-e2c316e4575d?w=400", createdAt: new Date() },
  { id: "paver", name: "Paver", slug: "paver", icon: "paver", description: "Asphalt and Block Pavers", imageUrl: "https://images.unsplash.com/photo-1558618047-f4c511eed3c0?w=400", createdAt: new Date() },
  { id: "compactor", name: "Plate Compactor", slug: "compactor", icon: "compactor", description: "Plate and Rammer Compactors", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", createdAt: new Date() },
  { id: "generator", name: "Generator", slug: "generator", icon: "generator", description: "Diesel and Power Generators", imageUrl: "https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?w=400", createdAt: new Date() },
  { id: "scaffolding", name: "Scaffolding", slug: "scaffolding", icon: "scaffolding", description: "Scaffolding and Access Equipment", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400", createdAt: new Date() },
];

const mockTools: (Tool & { category?: ToolCategory })[] = [
  // JCB
  { id: "t1", ownerId: "o1", categoryId: "jcb", name: "JCB 3DX Backhoe Loader", description: "Powerful backhoe loader for excavation and loading. Well maintained.", specifications: { power: "76 HP", capacity: "1 cubic meter", year: 2021 }, dailyRate: "5500", hourlyRate: "800", weeklyRate: "32000", location: "Mumbai", imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800", images: [], availability: "available", rating: "4.8", totalRentals: 45, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[0] },
  { id: "t2", ownerId: "o1", categoryId: "jcb", name: "JCB 4DX Super Loader", description: "Heavy-duty loader with extended reach. Perfect for large projects.", specifications: { power: "92 HP", capacity: "1.3 cubic meter", year: 2022 }, dailyRate: "6500", hourlyRate: "950", weeklyRate: "38000", location: "Pune", imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800", images: [], availability: "available", rating: "4.9", totalRentals: 32, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[0] },
  { id: "t3", ownerId: "o2", categoryId: "jcb", name: "JCB 2DX Compact Loader", description: "Compact backhoe for tight spaces. Ideal for urban construction.", specifications: { power: "55 HP", capacity: "0.6 cubic meter", year: 2020 }, dailyRate: "4000", hourlyRate: "600", weeklyRate: "24000", location: "Delhi", imageUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800", images: [], availability: "rented", rating: "4.6", totalRentals: 28, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[0] },
  // Hydra Crane
  { id: "t4", ownerId: "o2", categoryId: "hydra", name: "14 Ton Hydra Crane", description: "Mobile hydraulic crane with 14 ton capacity. Experienced operator available.", specifications: { capacity: "14 Ton", boom: "12m", year: 2021 }, dailyRate: "8500", hourlyRate: "1200", weeklyRate: "50000", location: "Mumbai", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800", images: [], availability: "available", rating: "4.7", totalRentals: 56, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[1] },
  { id: "t5", ownerId: "o3", categoryId: "hydra", name: "20 Ton Hydra Mobile Crane", description: "Heavy duty hydra crane for large lifting operations.", specifications: { capacity: "20 Ton", boom: "18m", year: 2022 }, dailyRate: "12000", hourlyRate: "1800", weeklyRate: "70000", location: "Bangalore", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800", images: [], availability: "available", rating: "4.9", totalRentals: 41, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[1] },
  // Tower Crane
  { id: "t6", ownerId: "o3", categoryId: "crane", name: "Tower Crane TC6015", description: "Self-erecting tower crane. Perfect for high-rise construction.", specifications: { capacity: "6 Ton", height: "45m", radius: "50m" }, dailyRate: "25000", hourlyRate: null, weeklyRate: "150000", location: "Mumbai", imageUrl: "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=800", images: [], availability: "available", rating: "4.8", totalRentals: 12, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[2] },
  // Bulldozer
  { id: "t7", ownerId: "o4", categoryId: "bulldozer", name: "Komatsu D65EX Bulldozer", description: "Heavy-duty bulldozer for land clearing and grading.", specifications: { power: "205 HP", blade: "4.1m wide", year: 2020 }, dailyRate: "15000", hourlyRate: "2200", weeklyRate: "85000", location: "Chennai", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", images: [], availability: "available", rating: "4.7", totalRentals: 23, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[3] },
  { id: "t8", ownerId: "o4", categoryId: "bulldozer", name: "CAT D6 Crawler Dozer", description: "Versatile crawler dozer for earthmoving operations.", specifications: { power: "185 HP", blade: "3.8m wide", year: 2021 }, dailyRate: "14000", hourlyRate: "2000", weeklyRate: "80000", location: "Hyderabad", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", images: [], availability: "maintenance", rating: "4.5", totalRentals: 18, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[3] },
  // Excavator
  { id: "t9", ownerId: "o5", categoryId: "excavator", name: "Hitachi ZX200 Excavator", description: "20-ton excavator with powerful digging capabilities.", specifications: { capacity: "0.9 cubic meter", depth: "6.5m", year: 2021 }, dailyRate: "9000", hourlyRate: "1300", weeklyRate: "52000", location: "Mumbai", imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800", images: [], availability: "available", rating: "4.8", totalRentals: 67, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[4] },
  { id: "t10", ownerId: "o5", categoryId: "excavator", name: "CAT 320 Hydraulic Excavator", description: "High-performance excavator for heavy earthworks.", specifications: { capacity: "1.0 cubic meter", depth: "7m", year: 2022 }, dailyRate: "10000", hourlyRate: "1500", weeklyRate: "58000", location: "Pune", imageUrl: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=800", images: [], availability: "available", rating: "4.9", totalRentals: 54, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[4] },
  // Concrete Mixer
  { id: "t11", ownerId: "o6", categoryId: "mixer", name: "Transit Mixer 6 Cubic", description: "6 cubic meter transit mixer truck.", specifications: { capacity: "6 cubic meter", drum: "Standard", year: 2020 }, dailyRate: "7000", hourlyRate: null, weeklyRate: "40000", location: "Delhi", imageUrl: "https://images.unsplash.com/photo-1562077981-4d7eafd44932?w=800", images: [], availability: "available", rating: "4.6", totalRentals: 89, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[5] },
  // Forklift
  { id: "t12", ownerId: "o6", categoryId: "forklift", name: "Toyota 3-Ton Forklift", description: "Reliable diesel forklift for material handling.", specifications: { capacity: "3 Ton", lift: "4.5m", year: 2021 }, dailyRate: "3500", hourlyRate: "500", weeklyRate: "20000", location: "Mumbai", imageUrl: "https://images.unsplash.com/photo-1560435650-7ec2e17ba926?w=800", images: [], availability: "available", rating: "4.7", totalRentals: 112, createdAt: new Date(), updatedAt: new Date(), category: toolCategories[6] },
];

const locations = ["All Locations", "Mumbai", "Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad"];

function ToolCard({ tool }: { tool: Tool & { category?: ToolCategory } }) {
  const availabilityColors = {
    available: "bg-green-500/10 text-green-600",
    rented: "bg-orange-500/10 text-orange-600",
    maintenance: "bg-red-500/10 text-red-600",
  };

  return (
    <Link href={`/marketplace/tool/${tool.id}`}>
      <Card className="hover-elevate cursor-pointer h-full overflow-hidden" data-testid={`tool-card-${tool.id}`}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={tool.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400"}
            alt={tool.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <Badge
            className={`absolute top-3 right-3 capitalize ${availabilityColors[tool.availability as keyof typeof availabilityColors]}`}
          >
            {tool.availability}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-1">{tool.name}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{tool.rating}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{tool.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" />
            <span>{tool.location}</span>
            <span className="mx-1">•</span>
            <span>{tool.totalRentals} rentals</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="text-lg font-bold text-primary">₹{Number(tool.dailyRate).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">per day</p>
            </div>
            <Button size="sm" data-testid={`button-rent-${tool.id}`}>
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function CategoryCard({ category }: { category: ToolCategory }) {
  const toolCount = mockTools.filter((t) => t.categoryId === category.id).length;

  return (
    <Link href={`/marketplace/${category.slug}`}>
      <Card className="hover-elevate cursor-pointer overflow-hidden h-full" data-testid={`category-${category.slug}`}>
        <div className="aspect-video relative overflow-hidden">
          <img
            src={category.imageUrl || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400"}
            alt={category.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-semibold text-white text-lg">{category.name}</h3>
            <p className="text-white/80 text-sm">{toolCount}+ available</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function Marketplace() {
  const { category } = useParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const selectedCategory = category
    ? toolCategories.find((c) => c.slug === category)
    : null;

  const displayTools = mockTools.filter((tool) => {
    const matchesCategory = !category || tool.categoryId === category;
    const matchesSearch = !searchQuery || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "All Locations" || tool.location === selectedLocation;
    const matchesPrice = Number(tool.dailyRate) >= priceRange[0] && Number(tool.dailyRate) <= priceRange[1];
    
    return matchesCategory && matchesSearch && matchesLocation && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8">
          <Breadcrumbs
            items={
              selectedCategory
                ? [
                    { label: "Marketplace", href: "/marketplace" },
                    { label: selectedCategory.name },
                  ]
                : [{ label: "Marketplace" }]
            }
          />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-[Poppins] mb-2">
              {selectedCategory ? selectedCategory.name : "Equipment Marketplace"}
            </h1>
            <p className="text-muted-foreground">
              {selectedCategory
                ? selectedCategory.description
                : "Rent heavy-duty construction equipment from verified owners"}
            </p>
          </div>

          {/* Category Navigation (if not in a category) */}
          {!selectedCategory && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Browse by Category</h2>
                <Button variant="ghost" className="gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {toolCategories.slice(0, 6).map((cat) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </div>
            </section>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search equipment..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-equipment"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[160px]" data-testid="select-location">
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
                <SelectTrigger className="w-[150px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2" data-testid="button-filters">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your equipment search</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-4 block">
                        Daily Rate: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={30000}
                        step={500}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block">Availability</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Available Now</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Include Rented</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block">Rating</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="rating" className="rounded-full" />
                          <span className="text-sm flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" /> 4.5+
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="rating" className="rounded-full" defaultChecked />
                          <span className="text-sm flex items-center gap-1">
                            <Star className="h-3 w-3 fill-accent text-accent" /> 4.0+
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="rating" className="rounded-full" />
                          <span className="text-sm">Any Rating</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden md:flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {displayTools.length} {displayTools.length === 1 ? "result" : "results"}
              {selectedCategory && ` in ${selectedCategory.name}`}
            </p>
          </div>

          {/* Equipment Grid */}
          {displayTools.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No equipment found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedLocation("All Locations");
                    setPriceRange([0, 30000]);
                  }}
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {displayTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}

          {/* All Categories (when viewing specific category) */}
          {selectedCategory && (
            <section className="mt-16">
              <h2 className="text-xl font-semibold mb-6">Browse Other Categories</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {toolCategories
                  .filter((c) => c.id !== selectedCategory.id)
                  .slice(0, 6)
                  .map((cat) => (
                    <CategoryCard key={cat.id} category={cat} />
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
