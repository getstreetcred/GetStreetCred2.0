import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, MapPin, Trophy } from "lucide-react";
import { Link } from "wouter";

export interface TopProject {
  id: string;
  rank: number;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  category: string;
}

interface TopRatedSectionProps {
  projects: TopProject[];
  onProjectClick?: (projectId: string) => void;
  onViewAll?: () => void;
}

export default function TopRatedSection({
  projects,
  onProjectClick,
  onViewAll,
}: TopRatedSectionProps) {
  const formatRatingCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-primary text-primary-foreground";
      case 2:
        return "bg-muted text-foreground";
      case 3:
        return "bg-accent text-accent-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <section className="py-12 md:py-16 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold text-foreground font-serif"
                data-testid="text-top-rated-title"
              >
                Top Rated
              </h2>
              <p className="text-muted-foreground mt-1">
                The highest rated infrastructure masterpieces
              </p>
            </div>
          </div>

          <Link href="/top-rated">
            <Button
              variant="ghost"
              className="text-primary gap-2 -ml-4 sm:ml-0"
              onClick={() => {
                console.log("View all top rated clicked");
                onViewAll?.();
              }}
              data-testid="button-view-all-top-rated"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group cursor-pointer overflow-visible hover-elevate active-elevate-2 transition-all"
              onClick={() => {
                console.log(`Top rated project clicked: ${project.id}`);
                onProjectClick?.(project.id);
              }}
              data-testid={`card-top-rated-${project.id}`}
            >
              <div className="flex items-center gap-4 p-4">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg flex-shrink-0 ${getRankColor(
                    project.rank
                  )}`}
                  data-testid={`text-rank-${project.id}`}
                >
                  {project.rank}
                </div>

                <div className="w-20 h-14 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    data-testid={`img-top-rated-${project.id}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className="font-semibold text-foreground truncate group-hover:text-primary transition-colors"
                      data-testid={`text-name-top-${project.id}`}
                    >
                      {project.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      data-testid={`badge-category-top-${project.id}`}
                    >
                      {project.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span
                      className="text-sm truncate"
                      data-testid={`text-location-top-${project.id}`}
                    >
                      {project.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-primary text-primary" />
                    <span
                      className="font-semibold text-foreground"
                      data-testid={`text-rating-top-${project.id}`}
                    >
                      {project.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    ({formatRatingCount(project.ratingCount)})
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
