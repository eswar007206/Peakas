import { Link } from "react-router-dom";
import { Property } from "@/hooks/useProperties";
import { MapPin, Calendar } from "lucide-react";
import { trackPropertyClick } from "@/hooks/useAnalytics";
import { formatPrice, formatDate } from "@/lib/formatPrice";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const handleClick = () => {
    trackPropertyClick(property.id, {
      title: property.title,
      price: property.start_price,
      city: property.city,
      bhk: property.bhk,
    });
  };

  return (
    <Link
      to={`/property/${property.id}`}
      onClick={handleClick}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer animate-fade-in border border-border hover:border-primary/20 block"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-md">
            {property.bhk} LDK
          </span>
          <span className="px-2.5 py-1 bg-card/95 backdrop-blur-sm text-foreground text-xs font-medium rounded-md capitalize">
            {property.property_type === "apartment" ? "マンション" : "戸建"}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm truncate">{property.location}、{property.city}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">価格</p>
            <p className="text-lg font-bold text-price">{formatPrice(property.start_price)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">掲載日</p>
            <div className="flex items-center gap-1 text-sm text-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(property.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
