"use client";

import React, { useState, useEffect, useRef } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@smm/ui-core";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Loader } from "@googlemaps/js-api-loader";

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

interface LocationPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationChange: (lat: number | null, lon: number | null) => void;
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const coordinates = latitude && longitude && 
    typeof latitude === 'number' && typeof longitude === 'number' 
    ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : "";

  // Update input value when coordinates change from outside
  useEffect(() => {
    setInputValue(coordinates);
  }, [coordinates]);

  // Initialize Google Maps when popover opens
  useEffect(() => {
    if (isOpen) {
      // Add a small delay to ensure the popover content is rendered
      const timer = setTimeout(() => {
        if (mapRef.current) {
          // Always reinitialize the map to ensure it works properly
          initializeMap();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Popover is closing - clean up the map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
      if (autocompleteRef.current) {
        autocompleteRef.current = null;
      }
    };
  }, []);

  // Update map when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current) {
      if (latitude && longitude) {
        const position = { lat: latitude, lng: longitude };
        mapInstanceRef.current.setCenter(position);
        mapInstanceRef.current.setZoom(15);
        
        if (markerRef.current) {
          markerRef.current.setPosition(position);
        } else {
          markerRef.current = new google.maps.Marker({
            position,
            map: mapInstanceRef.current,
            draggable: true,
          });

          markerRef.current.addListener("dragend", () => {
            const markerPosition = markerRef.current!.getPosition();
            if (markerPosition) {
              onLocationChange(markerPosition.lat(), markerPosition.lng());
            }
          });
        }
      } else {
        // Clear marker if coordinates are null, but keep map centered on default location
        if (markerRef.current) {
          markerRef.current.setMap(null);
          markerRef.current = null;
        }
        
        // Reset map to default center (Zambia) when coordinates are cleared
        mapInstanceRef.current.setCenter({ lat: -15.4167, lng: 28.2833 });
        mapInstanceRef.current.setZoom(10);
        
        // Trigger resize to ensure map renders properly after clearing
        setTimeout(() => {
          if (mapInstanceRef.current) {
            google.maps.event.trigger(mapInstanceRef.current, 'resize');
          }
        }, 100);
      }
    }
  }, [latitude, longitude, onLocationChange]);

  const initializeMap = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        throw new Error("Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.");
      }

      const loader = new Loader({
        apiKey,
        version: "weekly",
        libraries: ["places"]
      });

      await loader.load();

      // Ensure map container has dimensions
      if (mapRef.current) {
        mapRef.current.style.width = "400px";
        mapRef.current.style.height = "200px";
      }

      // Clear any existing map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = new google.maps.Map(mapRef.current!, {
        center: latitude && longitude 
          ? { lat: latitude, lng: longitude }
          : { lat: -15.4167, lng: 28.2833 }, // Default to Zambia
        zoom: 10,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_LEFT,
        },
        streetViewControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });

      // Add custom CSS to make controls smaller
      const style = document.createElement('style');
      style.textContent = `
        .gm-style-mtc {
          transform: scale(0.8);
          transform-origin: top left;
        }
        .gm-style-mtc button {
          font-size: 14px !important;
          padding: 0 12px !important;
          height: 32px !important;
        }
        .gm-fullscreen-control {
          transform: scale(0.8);
          transform-origin: top right;
        }
        .gm-bundled-control {
          transform: scale(0.8);
          transform-origin: bottom right;
        }
        .gm-bundled-control button {
          width: 32px !important;
          height: 32px !important;
        }
        /* Zoom controls */
        .gm-style-cc {
          transform: scale(0.8) !important;
          transform-origin: bottom right !important;
        }
        .gm-style-cc button {
          width: 32px !important;
          height: 32px !important;
          font-size: 12px !important;
        }
        /* Zoom controls - correct selectors */
        .gmnoprint[data-control-width="40"][data-control-height="81"] {
          transform: scale(0.8) !important;
          transform-origin: bottom right !important;
          z-index: 1000 !important;
          position: absolute !important;
          right: 25px !important;
          bottom: 50px !important;
        }
        .gmnoprint[data-control-width="40"][data-control-height="81"] button {
          width: 32px !important;
          height: 32px !important;
          z-index: 1001 !important;
          position: relative !important;
        }
        .gmnoprint[data-control-width="40"][data-control-height="81"] div {
          width: 32px !important;
          height: 65px !important;
          z-index: 1000 !important;
        }
        /* Remove any overlays that might be blocking the controls */
        .gmnoprint[data-control-width="40"][data-control-height="81"] div[style*="background-color: rgb(230, 230, 230)"] {
          display: none !important;
        }
          /* More specific zoom control targeting */
          div[style*="position: absolute"][style*="right: 0px"][style*="bottom: 0px"] {
            transform: scale(0.8) !important;
            transform-origin: bottom right !important;
          }
          div[style*="position: absolute"][style*="right: 0px"][style*="bottom: 0px"] button {
            width: 32px !important;
            height: 32px !important;
          }
          /* Override Google Places autocomplete focus styling */
          gmp-place-autocomplete,
          gmp-place-autocomplete:focus,
          gmp-place-autocomplete:focus-within,
          gmp-place-autocomplete:focus-visible {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          gmp-place-autocomplete input,
          gmp-place-autocomplete input:focus,
          gmp-place-autocomplete input:focus-visible {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          /* Target any nested elements that might have focus styling */
          gmp-place-autocomplete *:focus,
          gmp-place-autocomplete *:focus-visible {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
        `;
      document.head.appendChild(style);

      mapInstanceRef.current = map;

      // Add marker if coordinates exist
      if (latitude && longitude) {
        const marker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          draggable: true,
        });
        markerRef.current = marker;

        // Update coordinates when marker is dragged
        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          if (position) {
            onLocationChange(position.lat(), position.lng());
          }
        });
      }

      // Initialize Places Autocomplete using the new Places API
      if (searchInputRef.current) {
        try {
          // Create the new PlaceAutocompleteElement
          const autocomplete = new google.maps.places.PlaceAutocompleteElement({
            componentRestrictions: { country: 'zm' }, // Restrict to Zambia
          });

          // Replace the input with the autocomplete element
          const searchContainer = searchInputRef.current.parentElement;
          if (searchContainer) {
            // Remove the original input completely
            searchInputRef.current.remove();
            
            // Create a wrapper div that looks like the original input
            const wrapper = document.createElement('div');
            wrapper.className = 'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';
            
            // Style the autocomplete element to fill the wrapper
            autocomplete.style.cssText = `
              width: 100%;
              height: 100%;
              border: none;
              outline: none;
              background: transparent;
              font-size: inherit;
              color: inherit;
              padding: 0;
              margin: 0;
              box-shadow: none;
            `;
            
            // Add the autocomplete element to the wrapper
            wrapper.appendChild(autocomplete);
            
            // Add the wrapper to the container
            searchContainer.appendChild(wrapper);
          }

          autocompleteRef.current = autocomplete;

          // Listen for place selection using the correct new API event
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          autocomplete.addEventListener("gmp-select", async (event: any) => {
            
            try {
              // Get the place from the event
              const place = event.placePrediction.toPlace();
              
              // Fetch the required fields
              await place.fetchFields({
                fields: ["displayName", "formattedAddress", "location"],
              });
              
              
              if (place.location) {
                
                // The location might be a LatLng object or have different structure
                let lat, lng;
                
                if (typeof place.location.lat === 'function') {
                  // It's a LatLng object
                  lat = place.location.lat();
                  lng = place.location.lng();
                } else if (typeof place.location.lat === 'number') {
                  // It's a literal object
                  lat = place.location.lat;
                  lng = place.location.lng;
                } else {
                  return;
                }
                
                
                // Validate coordinates
                if (typeof lat !== 'number' || typeof lng !== 'number' || 
                    isNaN(lat) || isNaN(lng)) {
                  return;
                }
                
                
                // Update map center
                map.setCenter({ lat, lng });
                map.setZoom(15);

                // Update or create marker
                if (markerRef.current) {
                  markerRef.current.setPosition({ lat, lng });
                } else {
                  markerRef.current = new google.maps.Marker({
                    position: { lat, lng },
                    map: map,
                    draggable: true,
                  });

                  markerRef.current.addListener("dragend", () => {
                    const position = markerRef.current!.getPosition();
                    if (position) {
                      onLocationChange(position.lat(), position.lng());
                    }
                  });
                }

                onLocationChange(lat, lng);
              }
            } catch {
            }
          });
          
        } catch {
          setError("Failed to initialize location search. Please try entering coordinates manually.");
        }
      }

      // Add click listener to map
      map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();

          // Update or create marker
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
          } else {
            markerRef.current = new google.maps.Marker({
              position: { lat, lng },
              map: map,
              draggable: true,
            });

            markerRef.current.addListener("dragend", () => {
              const position = markerRef.current!.getPosition();
              if (position) {
                onLocationChange(position.lat(), position.lng());
              }
            });
          }

          onLocationChange(lat, lng);
        }
      });

    } catch (err) {
      let errorMessage = "Failed to load map";
      if (err instanceof Error) {
        if (err.message.includes("API key")) {
          errorMessage = "Invalid API key. Please check your Google Maps API key.";
        } else if (err.message.includes("quota")) {
          errorMessage = "API quota exceeded. Please check your Google Cloud billing.";
        } else if (err.message.includes("referer")) {
          errorMessage = "Domain not allowed. Please check API key restrictions.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoordinateChange = (value: string) => {
    setInputValue(value);
    
    // If input is empty, clear the location
    if (value.trim() === "") {
      onLocationChange(null, null);
      return;
    }
    
    const parts = value.split(",").map(part => part.trim());
    
    if (parts.length === 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      
      // Validate coordinates
      if (!isNaN(lat) && !isNaN(lng) && 
          lat >= -90 && lat <= 90 && 
          lng >= -180 && lng <= 180) {
        
        // Only update if coordinates are different to prevent loops
        if (latitude !== lat || longitude !== lng) {
          onLocationChange(lat, lng);
        }
      }
    }
  };

  const clearLocation = () => {
    setInputValue("");
    onLocationChange(null, null);
    
    // Reset map to default view if it's initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: -15.4167, lng: 28.2833 });
      mapInstanceRef.current.setZoom(10);
      
      // Trigger resize to ensure map renders properly after clearing
      setTimeout(() => {
        if (mapInstanceRef.current) {
          google.maps.event.trigger(mapInstanceRef.current, 'resize');
        }
      }, 100);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {coordinates || "Pick a location"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-w-[90vw] max-h-[90vh]" align="start">
        <div className="p-2 border-b">
          <Input 
            ref={searchInputRef}
            id="search" 
            placeholder="Search for a place..."
            className="h-8"
          />
        </div>
        
        <div className="relative h-[200px] w-[400px] max-w-[80vw]">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm">Loading map...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="text-center text-red-500 p-4 max-w-sm">
                <MapPin className="mx-auto h-12 w-12 mb-2" />
                <p className="text-sm font-medium">Error loading map</p>
                <p className="text-xs mt-1 break-words">{error}</p>
                <div className="mt-3 text-xs text-gray-600">
                  <p className="font-medium">Troubleshooting steps:</p>
                  <ul className="text-left mt-1 space-y-1">
                    <li>• Check if API key is set in .env.local</li>
                    <li>• Verify Google Maps API is enabled</li>
                    <li>• Check browser console for details</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ 
              width: "400px", 
              height: "200px", 
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc"
            }}
          />
        </div>
        
        <div className="p-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="coordinates" className="text-sm">Coordinates</Label>
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearLocation}
                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
          <Input 
            id="coordinates" 
            placeholder="Enter latitude, longitude (e.g., -15.4167, 28.2833)"
            value={inputValue}
            onChange={(e) => handleCoordinateChange(e.target.value)}
            className="h-8 mt-1"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
