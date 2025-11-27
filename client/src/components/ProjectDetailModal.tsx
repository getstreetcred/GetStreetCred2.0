import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Star, Calendar, Users, Trash2, Edit } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  scrollToRating?: boolean;
  onJoinNow?: () => void;
}

export default function ProjectDetailModal({
  project,
  open,
  onOpenChange,
  onSubmitRating,
  onEdit,
  onDelete,
  scrollToRating = false,
  onJoinNow,
}: ProjectDetailModalProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const ratingRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollToRating && ratingRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const target = ratingRef.current;
        if (container && target) {
          const offsetTop = target.offsetTop;
          container.scrollTo({
            top: offsetTop - 100,
            behavior: "smooth"
          });
        }
      }, 150);
    }
  }, [open, scrollToRating]);

  if (!project) return null;

  const formatRatingCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSubmitRating = async () => {
    if (userRating > 0) {
      try {
        // Generate a temporary UUID for anonymous users (TODO: Replace with actual user ID from auth)
        const userId = generateUUID();
        
        // Submit rating to backend
        const response = await fetch("/api/ratings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: project.id,
            userId: userId,
            rating: userRating,
            review: review || null,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit rating");
        }

        const data = await response.json();
        console.log(`Rating submitted for ${project.id}: ${userRating} stars`);
        console.log(`Review: ${review}`);
        
        // Call the callback with updated project data
        onSubmitRating?.(project.id, userRating, review, data.updatedProject);
        setHasSubmitted(true);
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
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

  const handleEdit = () => {
    onEdit?.(project.id);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      onDelete?.(project.id);
      onOpenChange(false);
    }
  };

  const displayRating = hoverRating || userRating;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
        <div className="relative w-full h-52 sm:h-64 flex-shrink-0">
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover"
            data-testid="img-modal-project"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4" ref={scrollContainerRef}>
          {project.category && (
            <Badge
              variant="outline"
              className="border-primary text-primary"
              data-testid="badge-modal-category"
            >
              {project.category}
            </Badge>
          )}

          <h2
            className="text-2xl font-bold font-serif"
            data-testid="text-modal-title"
          >
            {project.name}
          </h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-sm font-medium" data-testid="text-modal-year">
                  {project.completionYear}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium" data-testid="text-modal-rating">
                    {project.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({formatRatingCount(project.ratingCount)})
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium" data-testid="text-modal-location">
                  {project.location}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Reviews</p>
                <p className="text-sm font-medium">
                  {formatRatingCount(project.ratingCount)} ratings
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-base font-semibold mb-2">About This Project</h3>
            <p
              className="text-sm text-muted-foreground leading-relaxed"
              data-testid="text-modal-description"
            >
              {project.description}
            </p>
          </div>

          <div className="border-t border-border pt-4" ref={ratingRef}>
            {user ? (
              <>
                <h3 className="text-base font-semibold mb-3" data-testid="text-rate-heading">
                  {hasSubmitted ? "Thanks for your rating!" : "Rate this Project"}
                </h3>

                {hasSubmitted ? (
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < userRating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-foreground font-medium text-sm">
                      You rated this {userRating} star{userRating !== 1 ? "s" : ""}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Your rating:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                            onMouseEnter={() => setHoverRating(i + 1)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setUserRating(i + 1)}
                            data-testid={`button-star-${i + 1}`}
                            aria-label={`Rate ${i + 1} stars`}
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                i < displayRating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground hover:text-primary/50"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      {displayRating > 0 && (
                        <span className="text-sm font-medium text-primary">
                          {displayRating} star{displayRating !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <Textarea
                      placeholder="Share your thoughts about this project (optional)"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="resize-none text-sm"
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
              </>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Rating</h3>
                  <div className="flex items-center gap-2">
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
                    <span className="text-foreground font-semibold">
                      {project.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({project.ratingCount} ratings)
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={onJoinNow}
                  data-testid="button-join-now-rate"
                >
                  Join now to rate the project
                </Button>
              </div>
            )}
          </div>

          {user && (
            <div className="border-t border-border pt-4 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleEdit}
                data-testid="button-edit-project"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="secondary"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={handleDelete}
                data-testid="button-delete-project"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
