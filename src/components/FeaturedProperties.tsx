import { Property } from "@/hooks/useProperties";
import { MapPin, ArrowRight, Loader2, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import { trackPropertyClick } from "@/hooks/useAnalytics";
import { formatPrice } from "@/lib/formatPrice";

interface FeaturedPropertiesProps {
  properties: Property[];
  isLoading?: boolean;
}

export const FeaturedProperties = ({ properties, isLoading }: FeaturedPropertiesProps) => {
  const featured = properties.slice(0, 6);

  if (isLoading) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4 text-center py-20">
          <p className="text-muted-foreground">現在物件がありません。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              オークション出品中
            </h2>
            <p className="text-muted-foreground mt-1">
              入札受付中の厳選物件
            </p>
          </div>
          <Link
            to="/buy"
            className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            すべて見る <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              onClick={() => trackPropertyClick(property.id)}
              className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer block"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80"}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                    {property.bhk} LDK
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded flex items-center gap-1">
                    <Gavel className="w-3 h-3" />
                    入札受付中
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-xs text-white/80 mb-1">現在価格</p>
                  <p className="text-white text-lg font-bold">
                    {formatPrice(property.start_price)}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm">{property.location}、{property.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          to="/buy"
          className="md:hidden flex items-center justify-center gap-2 text-primary font-medium mt-6"
        >
          すべての物件を見る <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
