import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin, Search, X } from "lucide-react";

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
  const [locationSearchOpen, setLocationSearchOpen] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState("");

  // Filter locations based on search input
  const filteredLocations = locationSearchInput === ""
    ? locations
    : locations.filter((loc) =>
        loc.toLowerCase().includes(locationSearchInput.toLowerCase())
      );

  const handleSelectLocation = (location: string) => {
    onSelectLocation?.(location);
    setLocationSearchOpen(false);
    setLocationSearchInput("");
  };

  const getDisplayLocation = () => {
    if (selectedLocation === "all") return "All Locations";
    return selectedLocation;
  };

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
              {/* Location Selector with Search */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Location
                </label>
                <Popover open={locationSearchOpen} onOpenChange={setLocationSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between border-border/50 hover:border-border transition-colors font-normal"
                      data-testid="button-location-selector"
                    >
                      <span className="text-foreground">{getDisplayLocation()}</span>
                      <Search className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <div className="flex flex-col gap-2 p-2">
                      <Input
                        placeholder="Search locations..."
                        value={locationSearchInput}
                        onChange={(e) => setLocationSearchInput(e.target.value)}
                        className="border-border/50"
                        data-testid="input-location-search"
                        autoFocus
                      />
                      <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                        <Button
                          variant="ghost"
                          className="justify-start text-sm"
                          onClick={() => handleSelectLocation("all")}
                          data-testid="option-location-all"
                        >
                          All Locations
                        </Button>
                        {filteredLocations.map((location) => (
                          <Button
                            key={location}
                            variant={selectedLocation === location ? "default" : "ghost"}
                            className="justify-start text-sm"
                            onClick={() => handleSelectLocation(location)}
                            data-testid={`option-location-${location.toLowerCase().replace(/\s/g, "-")}`}
                          >
                            {location}
                          </Button>
                        ))}
                        {filteredLocations.length === 0 && (
                          <div className="text-xs text-muted-foreground p-2 text-center">
                            No locations found
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim() !== "") {
                        // Scroll to projects section when Enter is pressed
                        setTimeout(() => {
                          const projectsSection = document.getElementById("trending-section");
                          if (projectsSection) {
                            projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
                          }
                        }, 100);
                      }
                    }}
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
