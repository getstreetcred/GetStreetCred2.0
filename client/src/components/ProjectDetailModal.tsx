import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Star, Calendar, Users } from "lucide-react";

export interface ProjectDetail {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  completionYear: number;
  category?: string;
}

interface ProjectDetailModalProps {
  project: ProjectDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitRating?: (projectId: string, rating: number, review?: string) => void;
}

export default function ProjectDetailModal({
  project,
  open,
  onOpenChange,
  onSubmitRating,
}: ProjectDetailModalProps) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!project) return null;

  const formatRatingCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const handleSubmitRating = () => {
    if (userRating > 0) {
      console.log(`Submitting rating for ${project.id}: ${userRating} stars`);
      console.log(`Review: ${review}`);
      onSubmitRating?.(project.id, userRating, review);
      setHasSubmitted(true);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setUserRating(0);
      setHoverRating(0);
      setReview("");
      setHasSubmitted(false);
    }
    onOpenChange(isOpen);
  };

  const displayRating = hoverRating || userRating;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover"
            data-testid="img-modal-project"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {project.category && (
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white border-0"
              data-testid="badge-modal-category"
            >
              {project.category}
            </Badge>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2
              className="text-2xl md:text-3xl font-bold text-white font-serif mb-2"
              data-testid="text-modal-title"
            >
              {project.name}
            </h2>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm md:text-base" data-testid="text-modal-location">
                {project.location}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="text-sm" data-testid="text-modal-year">
                Completed {project.completionYear}
              </span>
            </div>
            <div className="flex items-center gap-2">
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
              <span className="font-semibold" data-testid="text-modal-rating">
                {project.rating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({formatRatingCount(project.ratingCount)} ratings)
              </span>
            </div>
          </div>

          <div className="bg-card/50 rounded-lg p-4 border border-border">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              About this Project
            </h3>
            <p
              className="text-foreground leading-relaxed"
              data-testid="text-modal-description"
            >
              {project.description}
            </p>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="text-lg font-semibold mb-4" data-testid="text-rate-heading">
              {hasSubmitted ? "Thanks for your rating!" : "Rate this Project"}
            </h3>

            {hasSubmitted ? (
              <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < userRating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-foreground font-medium">
                  You rated this {userRating} star{userRating !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-sm text-muted-foreground">Your rating:</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(i + 1)}
                        data-testid={`button-star-${i + 1}`}
                        aria-label={`Rate ${i + 1} stars`}
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            i < displayRating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground hover:text-primary/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {displayRating > 0 && (
                    <span className="text-lg font-medium text-primary">
                      {displayRating} star{displayRating !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <Textarea
                  placeholder="Share your thoughts about this project (optional)"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="resize-none"
                  rows={3}
                  data-testid="input-review"
                />

                <Button
                  className="w-full"
                  disabled={userRating === 0}
                  onClick={handleSubmitRating}
                  data-testid="button-submit-rating"
                >
                  Submit Rating
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
