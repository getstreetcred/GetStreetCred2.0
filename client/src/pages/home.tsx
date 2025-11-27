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

import heroImage from "@assets/stock_images/hong_kong_zhuhai_mac_56c5fcf7.jpg";
import burjKhalifa from "@assets/stock_images/burj_khalifa_dubai_s_0d086f10.jpg";
import shanghaiTower from "@assets/stock_images/shanghai_tower_moder_9c776149.jpg";
import marinaBay from "@assets/stock_images/singapore_marina_bay_c37dd08f.jpg";
import changiJewel from "@assets/stock_images/singapore_changi_air_22d4cc43.jpg";
import tokyoSkytree from "@assets/stock_images/tokyo_skytree_tower__95808630.jpg";
import cityscape from "@assets/stock_images/modern_city_skyline__3c956477.jpg";

// Mock projects for fallback
const MOCK_PROJECTS: Project[] = [
  {
    id: "burj-1",
    name: "Burj Khalifa",
    location: "Dubai, UAE",
    imageUrl: burjKhalifa,
    rating: 4.9,
    ratingCount: 5420,
    completionYear: 2010,
    category: "Skyscraper",
  },
  {
    id: "shanghai-1",
    name: "Shanghai Tower",
    location: "Shanghai, China",
    imageUrl: shanghaiTower,
    rating: 4.7,
    ratingCount: 3210,
    completionYear: 2015,
    category: "Skyscraper",
  },
  {
    id: "marina-1",
    name: "Marina Bay Sands",
    location: "Singapore",
    imageUrl: marinaBay,
    rating: 4.8,
    ratingCount: 4150,
    completionYear: 2010,
    category: "Hotel & Casino",
  },
  {
    id: "jewel-1",
    name: "Changi Airport Jewel",
    location: "Singapore",
    imageUrl: changiJewel,
    rating: 4.9,
    ratingCount: 2890,
    completionYear: 2019,
    category: "Airport",
  },
  {
    id: "skytree-1",
    name: "Tokyo Skytree",
    location: "Tokyo, Japan",
    imageUrl: tokyoSkytree,
    rating: 4.6,
    ratingCount: 3780,
    completionYear: 2012,
    category: "Tower",
  },
  {
    id: "downtown-1",
    name: "Dubai Downtown District",
    location: "Dubai, UAE",
    imageUrl: cityscape,
    rating: 4.5,
    ratingCount: 1920,
    completionYear: 2020,
    category: "Urban Development",
  },
];

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  "burj-1": "Standing at 828 meters, Burj Khalifa is the world's tallest building. This architectural marvel features 163 floors above ground and took 6 years to construct, showcasing the pinnacle of modern engineering and design.",
  "shanghai-1": "Shanghai Tower is a 632-meter supertall skyscraper featuring a unique twisted design that reduces wind loads. It houses offices, hotels, and observation decks with stunning views of the Pudong skyline.",
  "marina-1": "Marina Bay Sands is an integrated resort featuring three 55-story towers topped by a stunning SkyPark. The iconic design includes the world's largest rooftop infinity pool and has become Singapore's most recognizable landmark.",
  "jewel-1": "Changi Airport's Jewel is a nature-themed entertainment complex featuring the world's tallest indoor waterfall, the Rain Vortex. It seamlessly blends nature, shopping, and aviation in a stunning glass dome.",
  "skytree-1": "Tokyo Skytree stands at 634 meters as Japan's tallest structure. This broadcasting tower combines traditional Japanese aesthetics with cutting-edge technology and offers panoramic views of Tokyo from its observation decks.",
  "downtown-1": "Dubai Downtown is a large-scale urban development centered around the Burj Khalifa. It features world-class shopping, dining, and entertainment venues, representing the height of modern urban planning.",
};

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
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
        imageUrl: p.image_url,
        category: p.category,
        completionYear: p.completion_year,
        rating: p.rating ? parseFloat(p.rating) : 0,
        ratingCount: p.rating_count || 0,
      }));
    },
  });

  const featuredProject: FeaturedProject = {
    id: "hzmb-1",
    name: "Hong Kong-Zhuhai-Macau Bridge",
    location: "Pearl River Delta, China",
    description: "The world's longest sea crossing, spanning 55 kilometers. A marvel of modern engineering connecting Hong Kong, Macau, and mainland China.",
    imageUrl: heroImage,
    rating: 4.8,
    ratingCount: 2340,
  };

  // Use API projects if available, otherwise use fallback mock projects
  const trendingProjects: Project[] = apiProjects && apiProjects.length > 0 
    ? apiProjects 
    : MOCK_PROJECTS;

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
    if (projectId === featuredProject.id) {
      const projectDetail: ProjectDetail = {
        id: featuredProject.id,
        name: featuredProject.name,
        location: featuredProject.location,
        imageUrl: featuredProject.imageUrl,
        rating: featuredProject.rating,
        ratingCount: featuredProject.ratingCount,
        completionYear: 0,
        category: "Bridge",
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
        description: project.description || PROJECT_DESCRIPTIONS[project.id] || "An impressive modern infrastructure project showcasing innovative engineering and design.",
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

  // Filter projects based on selected category
  const filteredTrendingProjects = selectedCategory === "all" 
    ? trendingProjects 
    : trendingProjects.filter(project => 
        project.category?.toLowerCase() === selectedCategory.toLowerCase() || 
        (selectedCategory === "hotel" && project.category === "Hotel & Casino")
      );

  // Extract unique locations from projects
  const uniqueLocations = Array.from(
    new Set(trendingProjects.map(p => p.location))
  ).sort();

  // Filter by category and location
  const filteredTrendingProjects = trendingProjects
    .filter(project => {
      const categoryMatch = selectedCategory === "all" || 
        project.category?.toLowerCase() === selectedCategory.toLowerCase() || 
        (selectedCategory === "hotel" && project.category === "Hotel & Casino");
      
      const locationMatch = selectedLocation === "all" || project.location === selectedLocation;
      
      return categoryMatch && locationMatch;
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

  const handleDeleteProject = (projectId: string) => {
    console.log(`Delete project: ${projectId}`);
    // TODO: Implement delete functionality
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
          onSelectLocation={setSelectedLocation}
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
