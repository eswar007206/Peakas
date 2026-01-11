import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const cities = [
  { name: "Tokyo", properties: 25, image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80" },
  { name: "Osaka", properties: 18, image: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=400&q=80" },
  { name: "Yokohama", properties: 22, image: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?w=400&q=80" },
  { name: "Nagoya", properties: 15, image: "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=400&q=80" },
  { name: "Sapporo", properties: 12, image: "https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?w=400&q=80" },
  { name: "Fukuoka", properties: 14, image: "https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=400&q=80" },
  { name: "Kobe", properties: 10, image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400&q=80" },
  { name: "Kyoto", properties: 16, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80" },
];

export const CitySearch = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            エリアで探す
          </h2>
          <p className="text-muted-foreground mt-2">
            日本の主要都市の物件を検索
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city) => (
            <Link
              key={city.name}
              to={`/buy?city=${city.name}`}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] shadow-card hover:shadow-card-hover transition-all"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{city.properties}件</span>
                </div>
                <h3 className="text-white font-bold text-lg group-hover:text-primary transition-colors">
                  {city.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
