import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import type { Project } from "@/components/ProjectCard";

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  profilePictureUrl: z.string().url("Must be a valid URL").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect to home if not logged in
  useEffect(() => {
    if (user === null) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.email || "",
      password: "",
      profilePictureUrl: user?.profilePictureUrl || "",
    },
  });

  // Fetch user's projects
  const { data: userProjects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["/api/user-projects", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/user-projects/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      return data.map((p: any) => ({
        id: p.id,
        name: p.name,
        location: p.location,
        description: p.description,
        imageUrl: p.imageUrl || p.image_url,
        category: p.category,
        completionYear: p.completionYear || p.completion_year,
        rating: p.rating ? parseFloat(p.rating) : 0,
        ratingCount: p.ratingCount || p.rating_count || 0,
        userId: p.userId || p.user_id,
      }));
    },
    enabled: !!user?.id,
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: data.username,
          password: data.password || undefined,
          profilePictureUrl: data.profilePictureUrl || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      // Update auth context with new user data
      (window as any).__updateAuthUser?.(updatedUser);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  const initials = user.email
    .split("@")[0]
    .split(".")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-back-profile"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold" data-testid="text-profile-title">
            My Profile
          </h1>
          <div className="w-10" />
        </div>

        {/* Profile Card */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                {user?.profilePictureUrl && (
                  <AvatarImage src={user.profilePictureUrl} alt={user.email} />
                )}
                <AvatarFallback data-testid="avatar-profile">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold" data-testid="text-profile-email">
                  {user.email}
                </h2>
                <p className="text-sm text-muted-foreground capitalize" data-testid="text-profile-role">
                  {user.role} Account
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="secondary"
                size="sm"
                data-testid="button-edit-profile"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username / Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your username"
                          data-testid="input-username-edit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Leave blank to keep current password"
                          data-testid="input-password-edit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePictureUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter image URL"
                          data-testid="input-profile-pic-edit"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    data-testid="button-save-profile"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }}
                    data-testid="button-cancel-profile"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </Card>

        {/* User Projects Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4" data-testid="text-my-projects-heading">
            My Projects
          </h2>
          {isLoadingProjects ? (
            <p className="text-muted-foreground" data-testid="text-loading-projects">
              Loading projects...
            </p>
          ) : userProjects.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4" data-testid="text-no-projects">
                You haven't created any projects yet
              </p>
              <Button onClick={() => setLocation("/")} data-testid="button-explore-home">
                Explore Home
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userProjects.map((project: Project) => (
                <Card key={project.id} className="overflow-hidden hover-elevate" data-testid={`card-project-${project.id}`}>
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1" data-testid={`text-project-name-${project.id}`}>
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3" data-testid={`text-project-location-${project.id}`}>
                      {project.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary font-medium" data-testid={`text-project-rating-${project.id}`}>
                        ⭐ {project.rating.toFixed(1)} ({project.ratingCount})
                      </span>
                      {project.category && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded" data-testid={`badge-category-${project.id}`}>
                          {project.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={logout}
            data-testid="button-logout-profile"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
