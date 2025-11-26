import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
      <DialogContent className="sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover"
            data-testid="img-modal-project"
          />
          {project.category && (
            <Badge
              variant="secondary"
              className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white border-0"
              data-testid="badge-modal-category"
            >
              {project.category}
            </Badge>
          )}
        </div>

        <DialogHeader>
          <DialogTitle
            className="text-2xl font-bold font-serif"
            data-testid="text-modal-title"
          >
            {project.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span className="text-sm" data-testid="text-modal-location">
                {project.location}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span className="text-sm" data-testid="text-modal-year">
                Completed {project.completionYear}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(project.rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span
              className="text-lg font-semibold"
              data-testid="text-modal-rating"
            >
              {project.rating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {formatRatingCount(project.ratingCount)} ratings
              </span>
            </div>
          </div>

          <p
            className="text-foreground/80 leading-relaxed"
            data-testid="text-modal-description"
          >
            {project.description}
          </p>

          <div className="border-t border-border pt-4 mt-4">
            <h4 className="font-semibold mb-3" data-testid="text-rate-heading">
              {hasSubmitted ? "Thanks for your rating!" : "Rate this project"}
            </h4>

            {hasSubmitted ? (
              <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg border border-primary/20">
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
                <div className="flex items-center gap-2">
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
                    <span className="text-lg font-medium text-foreground ml-2">
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
