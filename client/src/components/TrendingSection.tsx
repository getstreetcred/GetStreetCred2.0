import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ProjectCard, { type Project } from "./ProjectCard";
import { Link } from "wouter";

interface TrendingSectionProps {
  projects: Project[];
  onProjectClick?: (projectId: string) => void;
  onViewAll?: () => void;
}

export default function TrendingSection({ 
  projects, 
  onProjectClick,
  onViewAll 
}: TrendingSectionProps) {
  return (
    <section id="trending-section" className="py-12 md:py-16 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 
              className="text-2xl md:text-3xl font-bold text-foreground font-serif"
              data-testid="text-section-title"
            >
              Trending Projects
            </h2>
            <p className="text-muted-foreground mt-1" data-testid="text-section-subtitle">
              Discover and rate the world's most iconic structures
            </p>
          </div>
          
          <Link href="/trending">
            <Button
              variant="ghost"
              className="text-primary gap-2 -ml-4 sm:ml-0"
              onClick={() => {
                console.log("View all clicked");
                onViewAll?.();
              }}
              data-testid="button-view-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={onProjectClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
