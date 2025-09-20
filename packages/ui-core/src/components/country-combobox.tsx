"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { countries, type Country } from "@smm/shared/src/countries";

interface CountryComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function CountryCombobox({
  value,
  onChange,
  placeholder = "Select a country",
  error,
  className,
}: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const selectedCountry = countries.find((country) => country.code === value);
  
  // Filter countries based on search (memoized for performance)
  const filteredCountries = React.useMemo(() => {
    if (!searchValue) return countries;
    const searchLower = searchValue.toLowerCase();
    return countries.filter((country) => 
      country.name.toLowerCase().includes(searchLower)
    );
  }, [searchValue]);

  // Reset search and highlighted index when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
      setHighlightedIndex(-1);
    } else {
      // Focus the search input when dropdown opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          // Clear any selection to prevent overwriting when typing
          searchInputRef.current.setSelectionRange(searchInputRef.current.value.length, searchInputRef.current.value.length);
        }
      }, 0);
    }
  }, [open]);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          setHighlightedIndex((prev) => 
            prev < filteredCountries.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          setHighlightedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredCountries.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
            onChange?.(filteredCountries[highlightedIndex].code);
            setOpen(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          break;
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown, true);
      return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
      };
    }
  }, [open, highlightedIndex, filteredCountries, onChange]);

  // Auto-scroll to keep highlighted item visible
  React.useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex] && scrollContainerRef.current) {
      const highlightedItem = itemRefs.current[highlightedIndex];
      const container = scrollContainerRef.current;
      
      const itemTop = highlightedItem.offsetTop;
      const itemBottom = itemTop + highlightedItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      
      // Scroll up if item is above visible area
      if (itemTop < containerTop) {
        container.scrollTop = itemTop;
      }
      // Scroll down if item is below visible area
      else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.clientHeight;
      }
    }
  }, [highlightedIndex]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!open) {
                  setOpen(true);
                }
              }
              // If it's a printable character and dropdown is closed, open it and start searching
              else if (!open && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
                e.preventDefault();
                setOpen(true);
                setSearchValue(e.key);
                setHighlightedIndex(-1);
              }
            }}
            className={cn(
              "w-full justify-between h-9 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
              "border-input bg-transparent text-foreground",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive ring-destructive/20 dark:ring-destructive/40",
              !error && "hover:border-input/80"
            )}
          >
            {selectedCountry ? selectedCountry.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[--radix-popover-trigger-width] p-0" 
          align="start"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <div 
            className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md"
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div className="flex items-center border-b px-3">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={(e) => {
                  // Position cursor at the end when input receives focus
                  setTimeout(() => {
                    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                  }, 0);
                }}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div ref={scrollContainerRef} className="h-48 overflow-auto">
              {filteredCountries.length === 0 ? (
                <div className="py-6 text-center text-sm">No country found.</div>
              ) : (
                <div className="p-1">
                  {filteredCountries.map((country, index) => (
                    <div
                      key={country.code}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      className={cn(
                        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        index === highlightedIndex && "bg-accent text-accent-foreground",
                        value === country.code && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => {
                        onChange?.(country.code);
                        setOpen(false);
                        setSearchValue("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === country.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {country.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
