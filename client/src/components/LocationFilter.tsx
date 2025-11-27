import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
    <div className="w-full bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              Explore by Location:
            </span>
            <Select value={selectedLocation} onValueChange={onSelectLocation}>
              <SelectTrigger className="w-48" data-testid="select-location">
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
          
          <div className="flex items-center gap-2 w-full sm:w-64">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="flex-1"
              data-testid="input-search-projects"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
