import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCities } from "@/data/properties";

export const QuickSearch = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [bhk, setBhk] = useState("");
  const cities = getCities();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (bhk) params.set("bhk", bhk);
    navigate(`/buy?${params.toString()}`);
  };

  return (
    <div className="bg-card rounded-2xl shadow-card-hover p-6 max-w-4xl mx-auto -mt-8 relative z-10">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            <MapPin className="w-4 h-4 inline mr-1" />
            都市
          </label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-1">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            <Home className="w-4 h-4 inline mr-1" />
            間取り
          </label>
          <Select value={bhk} onValueChange={setBhk}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1LDK</SelectItem>
              <SelectItem value="2">2LDK</SelectItem>
              <SelectItem value="3">3LDK</SelectItem>
              <SelectItem value="4">4LDK以上</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2 flex items-end">
          <Button onClick={handleSearch} className="w-full md:w-auto md:px-8" size="lg">
            <Search className="w-4 h-4 mr-2" />
            物件を検索
          </Button>
        </div>
      </div>
    </div>
  );
};
