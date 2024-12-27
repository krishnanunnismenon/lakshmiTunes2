import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function AdvancedSort({ sort, setSort, minPrice, setMinPrice, maxPrice, setMaxPrice }) {
  const handleMinPriceChange = (e) => {
    const value = Math.max(0, Math.min(Number(e.target.value), maxPrice));
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(minPrice, Math.min(Number(e.target.value), 100000));
    setMaxPrice(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sort">Sort By</Label>
        <Select id="sort" value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sorting option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
            <SelectItem value="rating-desc">Average Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Price Range</Label>
        <div className="flex items-center space-x-4 mt-2">
          <Input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            className="w-24"
          />
          <Slider
            min={0}
            max={100000}
            step={100}
            value={[minPrice, maxPrice]}
            onValueChange={([min, max]) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
            className="flex-grow"
          />
          <Input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
