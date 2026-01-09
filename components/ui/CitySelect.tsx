"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, MapPin, Plus } from "lucide-react";

export interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  // Optional extra info for display
  county?: string | null;
  region?: string | null;
}

interface CitySelectProps {
  label?: string;
  value: string; // The city name (string)
  onChange: (value: string) => void;
  cities: City[]; // Available cities from API
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export function CitySelect({
  label,
  value,
  onChange,
  cities,
  placeholder = "Select a city...",
  error,
  helperText,
}: CitySelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync internal input value with prop value initially
  useEffect(() => {
    // If value matches a known city, set input to that city name.
    // If it's a custom value, set it to that too.
    setInputValue(value);
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
        // On close, ensure the parent has the latest value if needed, 
        // though we update onChange immediately on selection/typing usually.
        // If the user typed something but didn't select, we treat it as a custom entry.
        // We already called onChange in handleInputChange, so we are good.
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (cityName: string) => {
    setInputValue(cityName);
    onChange(cityName);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setOpen(true);
    onChange(newValue); // Allow custom values immediately
  };

  const handleCreateOption = () => {
    // Treat current input as the selected value
    onChange(inputValue);
    setOpen(false);
  };

  const showCreateOption =
    inputValue &&
    !cities.some((c) => c.name.toLowerCase() === inputValue.toLowerCase());

  return (
    <div className="w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-[oklch(0.35_0.02_280)] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            className={`block w-full rounded-xl border bg-white pl-4 pr-10 py-3 text-[oklch(0.25_0.02_280)] transition-all duration-200 focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-[oklch(0.85_0.01_280)] focus:border-[oklch(0.65_0.25_15)] focus:ring-[oklch(0.65_0.25_15/0.2)]"
                }`}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setOpen(true)}
            onFocus={() => setOpen(true)}
            autoComplete="off"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[oklch(0.55_0.02_280)]">
             <ChevronsUpDown className="w-4 h-4 opacity-50" />
          </div>
        </div>

        {open && (
           <div className="absolute z-50 w-full mt-1 bg-white border border-[oklch(0.85_0.01_280)] rounded-xl shadow-lg max-h-60 overflow-auto py-1">
             {filteredCities.length === 0 && !inputValue && (
                <div className="px-4 py-2 text-sm text-[oklch(0.55_0.02_280)]">
                  Start typing to search...
                </div>
             )}

             {filteredCities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelect(city.name)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center hover:bg-[oklch(0.97_0.01_280)] transition-colors ${
                    city.name === value ? "bg-[oklch(0.95_0.01_280)] font-medium" : ""
                  }`}
                >
                   <MapPin className="w-4 h-4 mr-2 text-[oklch(0.55_0.02_280)]" />
                   <div>
                     {city.name}
                     {city.region && (
                       <span className="ml-2 text-xs text-[oklch(0.55_0.02_280)]">
                          {city.region}
                       </span>
                     )}
                   </div>
                   {city.name === value && (
                      <Check className="ml-auto w-4 h-4 text-[oklch(0.65_0.25_15)]" />
                   )}
                </button>
             ))}

             {showCreateOption && (
                <button
                  type="button"
                  onClick={handleCreateOption}
                  className="w-full text-left px-4 py-2 text-sm flex items-center text-[oklch(0.65_0.25_15)] font-medium hover:bg-[oklch(0.97_0.01_280)] border-t border-[oklch(0.95_0.01_280)] mt-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Use "{inputValue}"
                </button>
              )}
           </div>
        )}
      </div>
      {(error || helperText) && (
        <p
          className={`mt-1.5 text-sm ${
            error ? "text-red-600" : "text-[oklch(0.55_0.02_280)]"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
