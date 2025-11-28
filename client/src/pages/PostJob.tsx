import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Sparkles,
  Wand2,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const jobCategories = [
  { id: "construction", name: "Construction" },
  { id: "plumbing", name: "Plumbing" },
  { id: "electrical", name: "Electrical" },
  { id: "painting", name: "Painting" },
  { id: "carpentry", name: "Carpentry" },
  { id: "masonry", name: "Masonry" },
  { id: "welding", name: "Welding" },
  { id: "roofing", name: "Roofing" },
  { id: "flooring", name: "Flooring" },
  { id: "hvac", name: "HVAC" },
];

const durations = [
  "Less than 1 week",
  "1-2 weeks",
  "2-4 weeks",
  "1-3 months",
  "3-6 months",
  "More than 6 months",
];

const jobFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().min(50, "Description must be at least 50 characters").max(2000),
  requirements: z.string().min(20, "Requirements must be at least 20 characters").max(1000),
  location: z.string().min(3, "Please enter a location"),
  budgetMin: z.string().min(1, "Please enter minimum budget"),
  budgetMax: z.string().min(1, "Please enter maximum budget"),
  budgetType: z.enum(["hourly", "daily", "fixed"]),
  duration: z.string().min(1, "Please select duration"),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"]),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function PostJob() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [aiSuggesting, setAiSuggesting] = useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      description: "",
      requirements: "",
      location: "",
      budgetMin: "",
      budgetMax: "",
      budgetType: "daily",
      duration: "",
      experienceLevel: "intermediate",
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormValues) => {
      return apiRequest("POST", "/api/jobs", data);
    },
    onSuccess: () => {
      toast({ title: "Job posted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      navigate("/dashboard/jobs");
    },
    onError: () => {
      toast({ title: "Failed to post job", variant: "destructive" });
    },
  });

  const handleAiSuggest = async () => {
    setAiSuggesting(true);
    // Simulate AI suggestion
    setTimeout(() => {
      const title = form.getValues("title");
      const category = form.getValues("categoryId");
      
      if (category === "masonry") {
        form.setValue("description", `We are looking for experienced masons for our construction project in ${form.getValues("location") || "your location"}.

The work involves:
- Brick and block laying for walls
- Foundation preparation and leveling
- Mortar mixing and application
- Quality finishing work

The ideal candidate should be punctual, hardworking, and able to work as part of a team.`);
        form.setValue("requirements", `Required qualifications:
- Minimum 3 years of masonry experience
- Experience with brick and block work
- Own basic masonry tools
- Physical fitness for demanding work
- Reliable and punctual`);
      } else if (category === "electrical") {
        form.setValue("description", `Seeking a licensed electrician for our project in ${form.getValues("location") || "your location"}.

Scope of work:
- Electrical wiring installation
- Switch and socket installation
- Panel board setup
- Safety testing and certification

The work must comply with all local electrical codes and safety standards.`);
        form.setValue("requirements", `Required qualifications:
- Valid electrical license
- Minimum 2 years of experience
- Knowledge of safety codes
- Own tools and testing equipment
- Good communication skills`);
      } else {
        form.setValue("description", `We are seeking a skilled professional for ${title || "our project"} in ${form.getValues("location") || "your location"}.

The ideal candidate will have relevant experience and be committed to delivering quality work on time. We value professionalism, reliability, and attention to detail.`);
        form.setValue("requirements", `Required qualifications:
- Proven experience in the field
- Own tools and equipment
- Reliable and punctual
- Good communication skills
- Commitment to quality work`);
      }
      
      setAiSuggesting(false);
      toast({ title: "AI suggestions applied!" });
    }, 1500);
  };

  const onSubmit = (data: JobFormValues) => {
    createJobMutation.mutate(data);
  };

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ["title", "categoryId", "description", "requirements"] as const
      : ["location", "budgetMin", "budgetMax", "budgetType", "duration", "experienceLevel"] as const;
    
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign in to Post a Job</h2>
              <p className="text-muted-foreground mb-6">
                You need to be logged in to post a job on LabourMandi
              </p>
              <a href="/api/login">
                <Button className="w-full" data-testid="button-login-to-post">
                  Sign In to Continue
                </Button>
              </a>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 max-w-3xl">
          <Breadcrumbs items={[{ label: "Post Job" }]} />

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-[Poppins] mb-2">Post a New Job</h1>
            <p className="text-muted-foreground">
              Describe your job requirements and find the perfect worker
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
              </div>
              <span className="hidden sm:inline font-medium">Job Details</span>
            </div>
            <div className={`flex-1 h-1 rounded ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {step > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
              </div>
              <span className="hidden sm:inline font-medium">Budget & Duration</span>
            </div>
            <div className={`flex-1 h-1 rounded ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                3
              </div>
              <span className="hidden sm:inline font-medium">Review</span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 1: Job Details */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Job Details
                    </CardTitle>
                    <CardDescription>
                      Provide basic information about the job
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Need 5 Skilled Masons for Building Construction"
                              {...field}
                              data-testid="input-job-title"
                            />
                          </FormControl>
                          <FormDescription>
                            A clear, specific title helps attract the right workers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-job-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jobCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAiSuggest}
                        disabled={aiSuggesting || !form.getValues("title")}
                        className="gap-2"
                        data-testid="button-ai-suggest"
                      >
                        <Sparkles className={`h-4 w-4 ${aiSuggesting ? "animate-spin" : ""}`} />
                        {aiSuggesting ? "Generating..." : "AI Suggestions"}
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the job in detail..."
                              rows={6}
                              {...field}
                              data-testid="input-job-description"
                            />
                          </FormControl>
                          <FormDescription>
                            Include scope of work, deliverables, and any specific details
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List the skills, experience, and qualifications needed..."
                              rows={4}
                              {...field}
                              data-testid="input-job-requirements"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="button" onClick={nextStep} className="gap-2" data-testid="button-next-step">
                        Next <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Budget & Duration */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5" />
                      Budget & Duration
                    </CardTitle>
                    <CardDescription>
                      Set your budget and timeline for this job
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                                placeholder="e.g., Mumbai, Maharashtra"
                                className="pl-10"
                                {...field}
                                data-testid="input-job-location"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hourly" id="hourly" />
                                <Label htmlFor="hourly">Hourly</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="daily" id="daily" />
                                <Label htmlFor="daily">Daily</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fixed" id="fixed" />
                                <Label htmlFor="fixed">Fixed Price</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="budgetMin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Budget (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 500"
                                {...field}
                                data-testid="input-budget-min"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budgetMax"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Budget (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 1000"
                                {...field}
                                data-testid="input-budget-max"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-duration">
                                <SelectValue placeholder="Select project duration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {durations.map((dur) => (
                                <SelectItem key={dur} value={dur}>
                                  {dur}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level Required</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-experience">
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                              <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                              <SelectItem value="expert">Expert (5+ years)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="gap-2" data-testid="button-next-step-2">
                        Next <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Review & Submit
                    </CardTitle>
                    <CardDescription>
                      Review your job posting before submitting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Job Title</p>
                        <p className="font-semibold">{form.getValues("title")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-semibold capitalize">{form.getValues("categoryId")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{form.getValues("location")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Budget</p>
                        <p className="font-semibold text-primary">
                          ₹{Number(form.getValues("budgetMin")).toLocaleString()} - ₹{Number(form.getValues("budgetMax")).toLocaleString()}
                          {" / "}
                          {form.getValues("budgetType") === "daily" ? "day" : form.getValues("budgetType") === "hourly" ? "hour" : "project"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{form.getValues("duration")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Experience Level</p>
                        <p className="font-semibold capitalize">{form.getValues("experienceLevel")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="whitespace-pre-wrap">{form.getValues("description")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Requirements</p>
                        <p className="whitespace-pre-wrap">{form.getValues("requirements")}</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={createJobMutation.isPending}
                        className="gap-2"
                        data-testid="button-post-job-submit"
                      >
                        {createJobMutation.isPending ? (
                          "Posting..."
                        ) : (
                          <>
                            Post Job <CheckCircle className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
