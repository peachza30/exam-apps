// components/ui/searchable-select.jsx
"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SearchableSelect({
  value,
  onValueChange,
  options = [],
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  ...props
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  // Handle dropdown open/close
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  // Handle value change
  const handleValueChange = (newValue) => {
    onValueChange(newValue);
    setSearchTerm("");
  };

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      {...props}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Search Input */}
        <div className="flex items-center px-3 pb-2 sticky top-0 bg-popover z-10">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="h-px bg-border mb-1" />
        
        {/* Filtered Options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        ) : (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No results found
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

// PartnersList.jsx - Using the SearchableSelect component
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePathname, useRouter } from "next/navigation";
import LogoTfac from "@/public/images/logo/tfac.png";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";

import PartnerDataTable from "../_components/data-table/partner-table";
import SizeButton from "../_components/button/size-button";

const PartnersList = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // Partner categories
  const partnerCategories = [
    { value: "all", label: "All Partners" },
    { value: "premium", label: "Premium Partners" },
    { value: "standard", label: "Standard Partners" },
    { value: "basic", label: "Basic Partners" },
    { value: "enterprise", label: "Enterprise Partners" },
    { value: "startup", label: "Startup Partners" },
  ];

  // Partner regions
  const partnerRegions = [
    { value: "all", label: "All Regions" },
    { value: "north", label: "North America" },
    { value: "south", label: "South America" },
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia Pacific" },
    { value: "africa", label: "Africa" },
    { value: "middle-east", label: "Middle East" },
  ];

  return (
    <>
      <Card title="Users List">
        <CardHeader className="border-none pt-5 pl-6 pr-6">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-semibold text-default-900 whitespace-nowrap">
              Partner List
            </div>
            
            <div className="flex items-center gap-3">
              {/* Category Filter */}
              <SearchableSelect
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                options={partnerCategories}
                placeholder="Filter by category"
                searchPlaceholder="Search categories..."
                className="w-[200px] text-sm"
              />

              {/* Region Filter */}
              <SearchableSelect
                value={selectedRegion}
                onValueChange={setSelectedRegion}
                options={partnerRegions}
                placeholder="Filter by region"
                searchPlaceholder="Search regions..."
                className="w-[180px] text-sm"
              />

              <SizeButton />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PartnerDataTable 
            categoryFilter={selectedCategory}
            regionFilter={selectedRegion}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default PartnersList;