import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import HeroSection, { type FeaturedProject } from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import LocationFilter from "@/components/LocationFilter";
import TrendingSection from "@/components/TrendingSection";
import TopRatedSection, { type TopProject } from "@/components/TopRatedSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ProjectDetailModal, { type ProjectDetail } from "@/components/ProjectDetailModal";
import AddProjectModal from "@/components/AddProjectModal";
import { type Project } from "@/components/ProjectCard";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";


export default function Home() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [scrollToRating, setScrollToRating] = useState(false);

  // Fetch projects from API
  const { data: apiProjects = [] } = useQuery({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      // Transform snake_case to camelCase
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
        isFeatured: p.isFeatured || p.is_featured,
      }));
    },
  });

  // Fetch featured project from API
  const { data: apiFeaturedProject } = useQuery({
    queryKey: ["/api/featured-project"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/featured-project");
        if (!response.ok) return null;
        const data = await response.json();
        return {
          id: data.id,
          name: data.name,
          location: data.location,
          description: data.description,
          imageUrl: data.imageUrl || data.image_url,
          rating: data.rating ? parseFloat(data.rating) : 0,
          ratingCount: data.ratingCount || data.rating_count || 0,
        };
      } catch {
        return null;
      }
    },
  });

  const featuredProject: FeaturedProject | null = apiFeaturedProject || null;

  // Use only API projects - no fallback to mock data
  const trendingProjects: Project[] = apiProjects;

  const topRatedProjects: TopProject[] = trendingProjects
    .sort((a, b) => {
      const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating) : a.rating;
      const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating) : b.rating;
      return ratingB - ratingA; // Sort by rating descending (highest first)
    })
    .slice(0, 5)
    .map((p, idx) => ({
      ...p,
      rank: idx + 1,
      category: p.category || "Infrastructure",
    }));

  const handleSignIn = () => {
    setAuthModalTab("signin");
    setAuthModalOpen(true);
  };

  const handleJoinNow = () => {
    setAuthModalTab("signup");
    setAuthModalOpen(true);
  };

  const handleProjectClick = (projectId: string, shouldScrollToRating: boolean = false) => {
    console.log(`Opening project: ${projectId}`);
    setScrollToRating(shouldScrollToRating);
    
    // Check if it's the featured project
    if (featuredProject && projectId === featuredProject.id) {
      const projectDetail: ProjectDetail = {
        id: featuredProject.id,
        name: featuredProject.name,
        location: featuredProject.location,
        imageUrl: featuredProject.imageUrl,
        rating: featuredProject.rating,
        ratingCount: featuredProject.ratingCount,
        completionYear: 0,
        category: "Infrastructure",
        description: featuredProject.description,
      };
      setSelectedProject(projectDetail);
      setProjectModalOpen(true);
      return;
    }
    
    const project = trendingProjects.find(p => p.id === projectId);
    
    if (project) {
      const projectDetail: ProjectDetail = {
        id: project.id,
        name: project.name,
        location: project.location,
        imageUrl: project.imageUrl,
        rating: project.rating,
        ratingCount: project.ratingCount,
        completionYear: project.completionYear,
        category: project.category || "Infrastructure",
        description: project.description || "An impressive modern infrastructure project showcasing innovative engineering and design.",
        userId: project.userId,
      };
      setSelectedProject(projectDetail);
      setProjectModalOpen(true);
    }
  };

  const handleSubmitRating = (projectId: string, rating: number, review?: string, updatedProject?: any) => {
    console.log(`Rating submitted for ${projectId}: ${rating} stars`);
    if (review) {
      console.log(`Review: ${review}`);
    }
    // Refresh projects to show updated ratings
    queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
  };

  const handleRateProject = (projectId: string) => {
    console.log(`Rate project: ${projectId}`);
    setAuthModalTab("signup");
    setAuthModalOpen(true);
  };

  // Extract unique locations from projects
  const uniqueLocations = Array.from(
    new Set(trendingProjects.map(p => p.location))
  ).sort();

  // Filter by category, location, and search query
  const filteredTrendingProjects = trendingProjects
    .filter(project => {
      const categoryMatch = selectedCategory === "all" || 
        project.category?.toLowerCase() === selectedCategory.toLowerCase() || 
        (selectedCategory === "hotel" && project.category === "Hotel & Casino");
      
      const locationMatch = selectedLocation === "all" || project.location === selectedLocation;
      
      const searchMatch = searchQuery === "" || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && locationMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort by rating count (number of reviews) in descending order - most reviewed first
      const countA = Math.max(0, typeof a.ratingCount === 'string' ? parseInt(a.ratingCount, 10) : (a.ratingCount || 0));
      const countB = Math.max(0, typeof b.ratingCount === 'string' ? parseInt(b.ratingCount, 10) : (b.ratingCount || 0));
      
      // Primary sort: by rating count (most reviewed first) - DESCENDING order
      if (countA !== countB) {
        return countB - countA; // Higher count first (descending)
      }
      
      // Secondary sort: if counts are equal, sort by rating (highest rating first)
      const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating) : (a.rating || 0);
      const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating) : (b.rating || 0);
      return ratingB - ratingA; // Higher rating first (descending)
    });
  

  const filteredTopRatedProjects = filteredTrendingProjects
    .sort((a, b) => {
      const ratingA = typeof a.rating === 'string' ? parseFloat(a.rating) : a.rating;
      const ratingB = typeof b.rating === 'string' ? parseFloat(b.rating) : b.rating;
      return ratingB - ratingA;
    })
    .slice(0, 5)
    .map((p, idx) => ({
      ...p,
      rank: idx + 1,
      category: p.category || "Infrastructure",
    }));

  const handleProjectAdded = () => {
    // Refresh projects from API
    queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    setAddProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleEditProject = (projectId: string) => {
    const project = trendingProjects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(project);
      setAddProjectModalOpen(true);
      setProjectModalOpen(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    console.log(`Delete project: ${projectId}, user:`, user);
    
    if (!user) {
      alert("Please sign in to delete a project");
      return;
    }

    try {
      console.log("Sending delete request with userId:", user.id, "userRole:", user.role);
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userRole: user.role,
        }),
      });

      console.log("Delete response status:", response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error("Invalid response from server");
      }
      
      if (!response.ok) {
        console.error("Delete failed with status:", response.status, "Response:", data);
        throw new Error(data.error || "Failed to delete project");
      }

      console.log(`Project deleted: ${projectId}`, data);
      // Refresh projects list
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setProjectModalOpen(false);
      alert("Project deleted successfully");
    } catch (error: any) {
      console.error("Error deleting project:", error?.message || error);
      alert(error?.message || "Failed to delete project. Please try again.");
    }
  };

  const handleSetFeaturedProject = async (projectId: string) => {
    if (!user || user.role !== "admin") {
      alert("Only admins can set featured projects");
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole: user.role }),
      });

      if (!response.ok) {
        throw new Error("Failed to set featured project");
      }

      // Refresh projects and featured project
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/featured-project"] });
      alert("Project set as featured!");
    } catch (error: any) {
      console.error("Error setting featured project:", error);
      alert(error?.message || "Failed to set featured project");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onSignIn={handleSignIn} 
        onJoinNow={handleJoinNow}
        onAddProject={() => setAddProjectModalOpen(true)}
      />

      <main className="pt-16 md:pt-18">
        <HeroSection
          project={featuredProject}
          onProjectClick={handleProjectClick}
          onButtonClick={handleJoinNow}
        />

        <LocationFilter
          locations={uniqueLocations}
          selectedLocation={selectedLocation}
          searchQuery={searchQuery}
          onSelectLocation={(location) => {
            setSelectedLocation(location);
            // Reset category and search when location changes to show all projects from that location
            if (location !== "all") {
              setSelectedCategory("all");
              setSearchQuery("");
              // Scroll to projects section after location selection
              setTimeout(() => {
                const projectsSection = document.getElementById("trending-section");
                if (projectsSection) {
                  projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 100);
            }
          }}
          onSearchChange={setSearchQuery}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <TrendingSection
          projects={filteredTrendingProjects}
          onProjectClick={handleProjectClick}
        />

        <TopRatedSection
          projects={filteredTopRatedProjects}
          onProjectClick={handleProjectClick}
        />
      </main>

      <Footer />

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />

      <ProjectDetailModal
        project={selectedProject}
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        onSubmitRating={handleSubmitRating}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        scrollToRating={scrollToRating}
        onJoinNow={handleJoinNow}
        onSetFeatured={handleSetFeaturedProject}
        isFeatured={selectedProject?.id === apiFeaturedProject?.id}
      />

      <AddProjectModal
        open={addProjectModalOpen}
        onOpenChange={(open) => {
          setAddProjectModalOpen(open);
          if (!open) setEditingProject(null);
        }}
        onProjectAdded={handleProjectAdded}
        editingProject={editingProject}
      />
    </div>
  );
}
