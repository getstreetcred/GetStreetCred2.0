import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

interface LocationFilterProps {
  locations: string[];
  selectedLocation?: string;
  searchQuery?: string;
  onSelectLocation?: (location: string) => void;
  onSearchChange?: (query: string) => void;
}

export default function LocationFilter({
  locations,
  selectedLocation = "all",
  searchQuery = "",
  onSelectLocation,
  onSearchChange,
}: LocationFilterProps) {
  return (
    <div className="w-full bg-background py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-5 border border-border/50">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Explore & Discover
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Location
                </label>
                <Select value={selectedLocation} onValueChange={onSelectLocation}>
                  <SelectTrigger 
                    className="w-full border-border/50 hover:border-border transition-colors" 
                    data-testid="select-location"
                  >
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" data-testid="option-location-all">
                      All Locations
                    </SelectItem>
                    {locations.map((location) => (
                      <SelectItem 
                        key={location} 
                        value={location}
                        data-testid={`option-location-${location.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Search Bar */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Project Name or Description
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="e.g., 'Burj', 'Bridge', 'Tower'..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pl-10 border-border/50 focus:border-border transition-colors"
                    data-testid="input-search-projects"
                  />
                </div>
              </div>
            </div>
            
            {(selectedLocation !== "all" || searchQuery) && (
              <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                {selectedLocation !== "all" && searchQuery ? (
                  `Filtering by location: ${selectedLocation} and search: "${searchQuery}"`
                ) : selectedLocation !== "all" ? (
                  `Showing projects from: ${selectedLocation}`
                ) : (
                  `Searching for: "${searchQuery}"`
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
