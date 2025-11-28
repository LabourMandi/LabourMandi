import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Shield,
  Star,
  Briefcase,
  Clock,
  Calendar,
  Edit,
  CheckCircle,
  Plus,
  X,
  Sun,
  Moon,
  Bell,
} from "lucide-react";
import { Link } from "wouter";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  hourlyRate: z.string().optional(),
  availability: z.enum(["available", "busy", "unavailable"]).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const availableSkills = [
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
  "Plastering",
  "Concrete Work",
];

export default function Profile() {
  const { user, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(user?.skills || ["Masonry", "Plastering"]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "Experienced construction professional with expertise in commercial and residential projects.",
      location: user?.location || "Mumbai, Maharashtra",
      phone: user?.phone || "",
      hourlyRate: user?.hourlyRate || "150",
      availability: (user?.availability as "available" | "busy" | "unavailable") || "available",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return apiRequest("PATCH", "/api/users/profile", data);
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully!" });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <DashboardSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Breadcrumbs items={[{ label: "Profile" }]} />
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

          <main className="flex-1 overflow-auto p-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              {/* Profile Header */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.profileImageUrl || undefined} />
                        <AvatarFallback className="text-2xl">
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold">
                          {user?.firstName || "User"} {user?.lastName}
                        </h1>
                        {user?.phoneVerified && (
                          <Badge variant="outline" className="gap-1 text-green-600 border-green-200">
                            <Shield className="h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2 capitalize">{user?.role || "Worker"}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {form.getValues("location") || "Location not set"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          {user?.rating || "4.8"} ({user?.totalReviews || 45} reviews)
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {user?.totalJobs || 156} jobs completed
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={isEditing ? "secondary" : "default"}
                      className="gap-2"
                      onClick={() => setIsEditing(!isEditing)}
                      data-testid="button-edit-profile"
                    >
                      <Edit className="h-4 w-4" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="about" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Personal Information</CardTitle>
                          <CardDescription>
                            Update your personal details
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      data-testid="input-first-name"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      data-testid="input-last-name"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    disabled={!isEditing}
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                    data-testid="input-bio"
                                  />
                                </FormControl>
                                <FormDescription>
                                  Brief description for your profile
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        {...field}
                                        disabled={!isEditing}
                                        className="pl-9"
                                        placeholder="City, State"
                                        data-testid="input-location"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <Input
                                        {...field}
                                        disabled={!isEditing}
                                        className="pl-9"
                                        placeholder="+91 XXXXXXXXXX"
                                        data-testid="input-phone"
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Work Preferences */}
                      {user?.role === "worker" && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Work Preferences</CardTitle>
                            <CardDescription>
                              Set your rates and availability
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="hourlyRate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Hourly Rate (₹)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        {...field}
                                        disabled={!isEditing}
                                        placeholder="150"
                                        data-testid="input-hourly-rate"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="availability"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Availability</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      disabled={!isEditing}
                                    >
                                      <FormControl>
                                        <SelectTrigger data-testid="select-availability">
                                          <SelectValue placeholder="Select availability" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="busy">Busy</SelectItem>
                                        <SelectItem value="unavailable">Unavailable</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {isEditing && (
                        <div className="flex justify-end gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            data-testid="button-save-profile"
                          >
                            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      )}
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="skills">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills & Expertise</CardTitle>
                      <CardDescription>
                        Add or remove skills to showcase your expertise
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-3">Your Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="gap-1 px-3 py-1"
                            >
                              {skill}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-destructive"
                                onClick={() => removeSkill(skill)}
                              />
                            </Badge>
                          ))}
                          {selectedSkills.length === 0 && (
                            <p className="text-muted-foreground text-sm">No skills added yet</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-3">Add Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {availableSkills
                            .filter((s) => !selectedSkills.includes(s))
                            .map((skill) => (
                              <Button
                                key={skill}
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => addSkill(skill)}
                              >
                                <Plus className="h-3 w-3" />
                                {skill}
                              </Button>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reviews</CardTitle>
                      <CardDescription>
                        What clients say about your work
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        {
                          name: "ABC Builders",
                          rating: 5,
                          date: "2 weeks ago",
                          comment: "Excellent work on our commercial project. Very professional and completed on time.",
                        },
                        {
                          name: "Tech Infra Ltd",
                          rating: 5,
                          date: "1 month ago",
                          comment: "Great attention to detail. Would definitely hire again.",
                        },
                        {
                          name: "Green Homes",
                          rating: 4,
                          date: "2 months ago",
                          comment: "Good quality work. Minor delays but overall satisfied.",
                        },
                      ].map((review, index) => (
                        <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{review.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{review.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="portfolio">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                      <div>
                        <CardTitle>Portfolio</CardTitle>
                        <CardDescription>
                          Showcase your previous work
                        </CardDescription>
                      </div>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Project
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { title: "Commercial Building", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" },
                          { title: "Residential Complex", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400" },
                          { title: "Office Interior", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400" },
                        ].map((project, index) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="aspect-video">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <p className="font-medium">{project.title}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
