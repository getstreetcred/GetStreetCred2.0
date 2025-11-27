import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Calendar } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  completionYear: number;
  category?: string;
  description?: string;
  userId?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick?: (projectId: string) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const formatRatingCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card
      className="group cursor-pointer overflow-visible hover-elevate active-elevate-2 transition-all duration-300"
      onClick={() => {
        console.log(`Project clicked: ${project.id}`);
        onClick?.(project.id);
      }}
      data-testid={`card-project-${project.id}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-md">
        <img
          src={project.imageUrl}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          data-testid={`img-project-${project.id}`}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {project.category && (
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white border-0"
            data-testid={`badge-category-${project.id}`}
          >
            {project.category}
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3 
          className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors"
          data-testid={`text-name-${project.id}`}
        >
          {project.name}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-sm line-clamp-1" data-testid={`text-location-${project.id}`}>
            {project.location}
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(project.rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground" data-testid={`text-rating-${project.id}`}>
              {project.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({formatRatingCount(project.ratingCount)})
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-xs" data-testid={`text-year-${project.id}`}>
              {project.completionYear}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
