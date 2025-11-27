import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface LocationFilterProps {
  locations: string[];
  selectedLocation?: string;
  onSelectLocation?: (location: string) => void;
}

export default function LocationFilter({
  locations,
  selectedLocation = "all",
  onSelectLocation,
}: LocationFilterProps) {
  return (
    <div className="w-full bg-card/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-4">
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
      </div>
    </div>
  );
}
