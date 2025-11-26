import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export interface FeaturedProject {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
}

interface HeroSectionProps {
  project: FeaturedProject;
  onProjectClick?: (projectId: string) => void;
}

export default function HeroSection({ project, onProjectClick }: HeroSectionProps) {
  const { user } = useAuth();
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-primary/50 text-primary" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-muted-foreground" />
        );
      }
    }
    return stars;
  };

  const formatRatingCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${project.imageUrl})` }}
        data-testid="hero-background-image"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
          <div className="hidden md:block w-40 h-52 border-4 border-primary rounded-lg overflow-hidden shadow-xl flex-shrink-0">
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-full object-cover"
              data-testid="hero-thumbnail"
            />
          </div>

          <div className="flex flex-col gap-4 max-w-xl">
            <Badge 
              variant="outline" 
              className="w-fit border-primary text-primary bg-black/40 backdrop-blur-sm"
              data-testid="badge-featured"
            >
              FEATURED PROJECT
            </Badge>

            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-serif tracking-tight"
              data-testid="text-project-name"
            >
              {project.name}
            </h1>

            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm md:text-base" data-testid="text-project-location">
                {project.location}
              </span>
            </div>

            <p 
              className="text-white/80 text-sm md:text-base leading-relaxed"
              data-testid="text-project-description"
            >
              {project.description}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {renderStars(project.rating)}
              </div>
              <span className="text-white font-semibold" data-testid="text-rating">
                {project.rating.toFixed(1)}
              </span>
              <span className="text-white/60 text-sm" data-testid="text-rating-count">
                ({formatRatingCount(project.ratingCount)} ratings)
              </span>
            </div>

            <Button
              size="lg"
              className="w-fit mt-2 px-8 bg-black/40 backdrop-blur-md border border-primary text-white"
              onClick={() => {
                console.log(`View project: ${project.id}`);
                onProjectClick?.(project.id);
              }}
              data-testid="button-rate-project"
            >
              {user ? "Rate the project" : "Join now to rate the project"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
