import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCities, getLocalities } from "@/data/properties";
import { trackFilterChange } from "@/lib/analytics";
import { RotateCcw, SlidersHorizontal } from "lucide-react";

export interface FilterState {
  bhk: string[];
  priceRange: [number, number]; // In actual dollars
  city: string;
  locality: string;
  sortBy: string;
}

interface PropertyFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const bhkOptions = ["1 LDK", "2 LDK", "3 LDK", "4+ LDK"];
const sortOptions = [
  { value: "newest", label: "新着順" },
  { value: "oldest", label: "古い順" },
  { value: "price_low", label: "価格：安い順" },
  { value: "price_high", label: "価格：高い順" },
];

// Min and max price in Japanese Yen
const MIN_PRICE = 0;
const MAX_PRICE = 600000000; // ¥6億 (600 million yen)
const PRICE_STEP = 10000000; // ¥1000万 (10 million yen) steps

const formatSliderPrice = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(1)}億`;
  }
  if (value >= 10000) {
    return `¥${Math.round(value / 10000)}万`;
  }
  return `¥${value}`;
};

export const PropertyFilters = ({ filters, onFiltersChange }: PropertyFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const cities = getCities();
  const localities = localFilters.city ? getLocalities(localFilters.city) : [];

  useEffect(() => { setLocalFilters(filters); }, [filters]);

  const handleBhkToggle = (bhk: string) => {
    const newBhk = localFilters.bhk.includes(bhk) ? localFilters.bhk.filter((b) => b !== bhk) : [...localFilters.bhk, bhk];
    const newFilters = { ...localFilters, bhk: newBhk };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    trackFilterChange({ bhk: newBhk });
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: [value[0], value[1]] as [number, number] };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCityChange = (city: string) => {
    const newFilters = { ...localFilters, city, locality: "" };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    trackFilterChange({ city });
  };

  const handleLocalityChange = (locality: string) => {
    const newFilters = { ...localFilters, locality };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    trackFilterChange({ locality });
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...localFilters, sortBy };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
    trackFilterChange({ sortBy });
  };

  const handleReset = () => {
    const defaultFilters: FilterState = { bhk: [], priceRange: [MIN_PRICE, MAX_PRICE], city: "", locality: "", sortBy: "newest" };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    trackFilterChange({ reset: true });
  };

  return (
    <div className="bg-card rounded-lg p-4 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-black" />
          <h3 className="font-semibold text-base">絞り込み</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:bg-primary hover:text-white h-7 text-xs px-2">
          <RotateCcw className="w-3 h-3 mr-1" />リセット
        </Button>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">間取り</Label>
        <div className="flex flex-wrap gap-1.5">
          {bhkOptions.map((bhk) => (
            <button key={bhk} onClick={() => handleBhkToggle(bhk)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-all ${localFilters.bhk.includes(bhk) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:border-primary/50"}`}>
              {bhk}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">価格帯</Label>
        
        {/* Manual Input Fields */}
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            placeholder="最小"
            value={localFilters.priceRange[0] > 0 ? Math.round(localFilters.priceRange[0] / 10000) : ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) * 10000 : 0;
              const newFilters = { ...localFilters, priceRange: [Math.min(val, localFilters.priceRange[1]), localFilters.priceRange[1]] as [number, number] };
              setLocalFilters(newFilters);
              onFiltersChange(newFilters);
            }}
            className="text-xs h-8 flex-1"
          />
          <span className="text-muted-foreground text-xs">〜</span>
          <Input
            type="number"
            placeholder="最大"
            value={localFilters.priceRange[1] > 0 ? Math.round(localFilters.priceRange[1] / 10000) : ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) * 10000 : MAX_PRICE;
              const newFilters = { ...localFilters, priceRange: [localFilters.priceRange[0], Math.max(val, localFilters.priceRange[0])] as [number, number] };
              setLocalFilters(newFilters);
              onFiltersChange(newFilters);
            }}
            className="text-xs h-8 flex-1"
          />
          <span className="text-xs text-muted-foreground">万円</span>
        </div>
        
        {/* Dual Range Slider */}
        <div>
          <div className="text-xs text-muted-foreground mb-1 text-center">
            {formatSliderPrice(localFilters.priceRange[0])} - {formatSliderPrice(localFilters.priceRange[1])}
          </div>
          <Slider 
            value={localFilters.priceRange} 
            onValueChange={handlePriceChange} 
            min={MIN_PRICE} 
            max={MAX_PRICE} 
            step={PRICE_STEP} 
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
            <span>¥0</span>
            <span>¥6億</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">都市</Label>
        <Select value={localFilters.city} onValueChange={handleCityChange}>
          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="都市を選択" /></SelectTrigger>
          <SelectContent>{cities.map((city) => (<SelectItem key={city} value={city}>{city}</SelectItem>))}</SelectContent>
        </Select>
      </div>

      {localities.length > 0 && (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">エリア</Label>
          <Select value={localFilters.locality} onValueChange={handleLocalityChange}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="エリアを選択" /></SelectTrigger>
            <SelectContent>{localities.map((locality) => (<SelectItem key={locality} value={locality}>{locality}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">並び替え</Label>
        <Select value={localFilters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{sortOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent>
        </Select>
      </div>
    </div>
  );
};
