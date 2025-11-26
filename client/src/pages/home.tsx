import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection, { type FeaturedProject } from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import TrendingSection from "@/components/TrendingSection";
import TopRatedSection, { type TopProject } from "@/components/TopRatedSection";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { type Project } from "@/components/ProjectCard";

import heroImage from "@assets/stock_images/hong_kong_zhuhai_mac_56c5fcf7.jpg";
import burjKhalifa from "@assets/stock_images/burj_khalifa_dubai_s_0d086f10.jpg";
import shanghaiTower from "@assets/stock_images/shanghai_tower_moder_9c776149.jpg";
import marinaBay from "@assets/stock_images/singapore_marina_bay_c37dd08f.jpg";
import changiJewel from "@assets/stock_images/singapore_changi_air_22d4cc43.jpg";
import tokyoSkytree from "@assets/stock_images/tokyo_skytree_tower__95808630.jpg";
import cityscape from "@assets/stock_images/modern_city_skyline__3c956477.jpg";

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup">("signin");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // todo: remove mock functionality - replace with API calls
  const featuredProject: FeaturedProject = {
    id: "hzmb-1",
    name: "Hong Kong-Zhuhai-Macau Bridge",
    location: "Pearl River Delta, China",
    description: "The world's longest sea crossing, spanning 55 kilometers. A marvel of modern engineering connecting Hong Kong, Macau, and mainland China.",
    imageUrl: heroImage,
    rating: 4.8,
    ratingCount: 2340,
  };

  // todo: remove mock functionality - replace with API calls
  const trendingProjects: Project[] = [
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

  // todo: remove mock functionality - replace with API calls
  const topRatedProjects: TopProject[] = [
    {
      id: "burj-top",
      rank: 1,
      name: "Burj Khalifa",
      location: "Dubai, UAE",
      imageUrl: burjKhalifa,
      rating: 4.9,
      ratingCount: 5420,
      category: "Skyscraper",
    },
    {
      id: "jewel-top",
      rank: 2,
      name: "Changi Airport Jewel",
      location: "Singapore",
      imageUrl: changiJewel,
      rating: 4.9,
      ratingCount: 2890,
      category: "Airport",
    },
    {
      id: "hzmb-top",
      rank: 3,
      name: "Hong Kong-Zhuhai-Macau Bridge",
      location: "Pearl River Delta, China",
      imageUrl: heroImage,
      rating: 4.8,
      ratingCount: 2340,
      category: "Bridge",
    },
    {
      id: "marina-top",
      rank: 4,
      name: "Marina Bay Sands",
      location: "Singapore",
      imageUrl: marinaBay,
      rating: 4.8,
      ratingCount: 4150,
      category: "Hotel",
    },
    {
      id: "shanghai-top",
      rank: 5,
      name: "Shanghai Tower",
      location: "Shanghai, China",
      imageUrl: shanghaiTower,
      rating: 4.7,
      ratingCount: 3210,
      category: "Skyscraper",
    },
  ];

  const handleSignIn = () => {
    setAuthModalTab("signin");
    setAuthModalOpen(true);
  };

  const handleJoinNow = () => {
    setAuthModalTab("signup");
    setAuthModalOpen(true);
  };

  const handleProjectClick = (projectId: string) => {
    console.log(`Navigate to project: ${projectId}`);
    // todo: Navigate to project detail page
  };

  const handleRateProject = (projectId: string) => {
    console.log(`Rate project: ${projectId}`);
    setAuthModalTab("signup");
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSignIn={handleSignIn} onJoinNow={handleJoinNow} />

      <main className="pt-16 md:pt-18">
        <HeroSection
          project={featuredProject}
          onRateProject={handleRateProject}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <TrendingSection
          projects={trendingProjects}
          onProjectClick={handleProjectClick}
        />

        <TopRatedSection
          projects={topRatedProjects}
          onProjectClick={handleProjectClick}
        />
      </main>

      <Footer />

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab={authModalTab}
      />
    </div>
  );
}
