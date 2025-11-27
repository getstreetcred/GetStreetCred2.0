import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Building2, LayoutGrid, Plane, Train, Landmark, Building, Home, Road } from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: typeof Building2;
}

interface CategoryFilterProps {
  categories?: Category[];
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

const defaultCategories: Category[] = [
  { id: "all", label: "All Projects", icon: LayoutGrid },
  { id: "skyscraper", label: "Skyscrapers", icon: Building2 },
  { id: "bridge", label: "Bridges", icon: Landmark },
  { id: "airport", label: "Airports", icon: Plane },
  { id: "railway", label: "Railways", icon: Train },
  { id: "stadium", label: "Stadiums", icon: Building },
  { id: "residential", label: "Residential", icon: Home },
  { id: "roads", label: "Roads", icon: Road },
];

export default function CategoryFilter({
  categories = defaultCategories,
  selectedCategory = "all",
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="w-full bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2 py-4">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              const Icon = category.icon;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "secondary"}
                  className={`flex-shrink-0 gap-2 ${
                    isSelected ? "" : "text-muted-foreground"
                  }`}
                  onClick={() => {
                    console.log(`Category selected: ${category.id}`);
                    onSelectCategory?.(category.id);
                  }}
                  data-testid={`button-category-${category.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </div>
  );
}
