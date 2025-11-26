import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Upload, Calendar } from "lucide-react";

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded?: () => void;
  editingProject?: any;
}

const categories = [
  "Skyscraper",
  "Bridge",
  "Airport",
  "Railway",
  "Stadium",
  "Residential",
  "Hotel & Casino",
  "Tower",
  "Urban Development",
];

export default function AddProjectModal({
  open,
  onOpenChange,
  onProjectAdded,
  editingProject,
}: AddProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);
  const { toast } = useToast();
  const isEditing = !!editingProject;

  const form = useForm({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: editingProject ? {
      name: editingProject.name || "",
      location: editingProject.location || "",
      description: editingProject.description || "",
      imageUrl: editingProject.imageUrl || "",
      category: editingProject.category || "",
      completionYear: editingProject.completionYear || new Date().getFullYear(),
    } : {
      name: "",
      location: "",
      description: "",
      imageUrl: "",
      category: "",
      completionYear: new Date().getFullYear(),
    },
  });

  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => startYear + i
  ).reverse();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);
        form.setValue("imageUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const method = isEditing ? "PATCH" : "POST";
      const url = isEditing ? `/api/projects/${editingProject.id}` : "/api/projects";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "add"} project`);
      }

      const project = await response.json();
      console.log(`Project ${isEditing ? "updated" : "added"}:`, project);

      toast({
        title: "Success!",
        description: `${data.name} has been ${isEditing ? "updated" : "added"} to GetStreetCred.`,
      });

      form.reset();
      setImagePreview(null);
      setUploadedFile(null);
      onOpenChange(false);
      onProjectAdded?.();
    } catch (error) {
      console.error(`Error ${isEditing ? "updating" : "adding"} project:`, error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} project. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleYearSelect = (year: number) => {
    form.setValue("completionYear", year);
    setYearPickerOpen(false);
  };

  useEffect(() => {
    if (open && editingProject) {
      form.reset({
        name: editingProject.name || "",
        location: editingProject.location || "",
        description: editingProject.description || "",
        imageUrl: editingProject.imageUrl || "",
        category: editingProject.category || "",
        completionYear: editingProject.completionYear || new Date().getFullYear(),
      });
      setImagePreview(editingProject.imageUrl || null);
    } else if (open && !editingProject) {
      form.reset({
        name: "",
        location: "",
        description: "",
        imageUrl: "",
        category: "",
        completionYear: new Date().getFullYear(),
      });
      setImagePreview(null);
    }
  }, [open, editingProject, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Infrastructure Project"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the project details below."
              : "Share an amazing modern infrastructure project with the GetStreetCred community."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Burj Khalifa"
                      {...field}
                      data-testid="input-project-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Dubai, UAE"
                      {...field}
                      data-testid="input-project-location"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-project-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completionYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Year</FormLabel>
                  <FormControl>
                    <Popover open={yearPickerOpen} onOpenChange={setYearPickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          data-testid="button-year-picker"
                        >
                          <span>{field.value || "Select a year"}</span>
                          <Calendar className="w-4 h-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-0" align="start">
                        <div className="flex flex-col">
                          <div className="px-4 py-2 border-b border-border">
                            <p className="text-sm font-medium">Select Year</p>
                          </div>
                          <div className="h-64 overflow-y-auto">
                            <div className="grid grid-cols-4 gap-1 p-2">
                              {years.map((year) => (
                                <Button
                                  key={year}
                                  variant={field.value === year ? "default" : "outline"}
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={() => handleYearSelect(year)}
                                  data-testid={`year-option-${year}`}
                                >
                                  {year}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Project Image</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      {!imagePreview && !form.watch("imageUrl") ? (
                        <label
                          htmlFor="image-upload"
                          className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                          data-testid="image-upload-area"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                            <div className="text-sm text-muted-foreground text-center">
                              <p className="font-medium text-foreground">Click to upload an image</p>
                              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            data-testid="input-image-file"
                          />
                        </label>
                      ) : null}
                      {(imagePreview || form.watch("imageUrl")) && (
                        <div className="relative">
                          <img
                            src={imagePreview || form.watch("imageUrl")}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg"
                            data-testid="image-preview"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview(null);
                              setUploadedFile(null);
                              form.setValue("imageUrl", "");
                            }}
                            data-testid="button-remove-image"
                          >
                            Remove
                          </Button>
                          <label
                            htmlFor="image-upload"
                            className="absolute bottom-2 left-2 px-2 py-1 bg-background/80 rounded text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              data-testid="input-image-file"
                            />
                            Change image
                          </label>
                        </div>
                      )}
                      {!imagePreview && !form.watch("imageUrl") && <p className="text-xs text-muted-foreground">No image selected</p>}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this infrastructure project..."
                      className="resize-none"
                      rows={4}
                      {...field}
                      data-testid="input-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                data-testid="button-submit-project"
              >
                {isSubmitting ? (isEditing ? "Updating..." : "Adding...") : (isEditing ? "Update Project" : "Add Project")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
