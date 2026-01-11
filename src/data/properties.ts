export interface Property {
  id: string;
  title: string;
  bhk: 1 | 2 | 3 | 4;
  start_price: number;
  location: string;
  city: string;
  images: string[];
  status: "draft" | "published";
  created_at: string;
  property_type: "apartment" | "house";
  description?: string;
}

const cities = ["Tokyo", "Osaka", "Yokohama", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto"];
const localities: Record<string, string[]> = {
  Tokyo: ["Shibuya", "Shinjuku", "Minato", "Setagaya", "Meguro", "Nakano", "Suginami", "Chiyoda"],
  Osaka: ["Umeda", "Namba", "Tennoji", "Shinsaibashi", "Abeno", "Yodogawa", "Higashiyodogawa", "Kita"],
  Yokohama: ["Minato Mirai", "Kannai", "Naka", "Kohoku", "Tsuzuki", "Aoba", "Totsuka", "Sakae"],
  Nagoya: ["Naka", "Chikusa", "Higashi", "Showa", "Atsuta", "Meito", "Tenpaku", "Mizuho"],
  Sapporo: ["Chuo", "Kita", "Higashi", "Shiroishi", "Toyohira", "Nishi", "Teine", "Atsubetsu"],
  Fukuoka: ["Hakata", "Chuo", "Higashi", "Minami", "Sawara", "Jonan", "Nishi", "Shime"],
  Kobe: ["Chuo", "Nada", "Higashinada", "Hyogo", "Nagata", "Suma", "Tarumi", "Kita"],
  Kyoto: ["Nakagyo", "Shimogyo", "Higashiyama", "Sakyo", "Ukyo", "Fushimi", "Kamigyo", "Minami"],
};

const propertyImages = [
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80",
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
];

const titles = [
  "Modern Apartment",
  "Luxury Mansion",
  "Stylish Residence",
  "Premium Living",
  "Urban Designer Flat",
  "Cozy Corner Suite",
  "Executive Tower",
  "Garden View Home",
  "Skyline Penthouse",
  "Contemporary House",
];

function generateProperty(index: number): Property {
  const city = cities[index % cities.length];
  const cityLocalities = localities[city];
  const locality = cityLocalities[index % cityLocalities.length];
  const bhk = ((index % 4) + 1) as 1 | 2 | 3 | 4;
  
  // Price ranges by bedrooms (in thousands)
  const priceRanges: Record<number, [number, number]> = {
    1: [250, 600],     // $250K - $600K
    2: [450, 1200],    // $450K - $1.2M
    3: [750, 2000],    // $750K - $2M
    4: [1200, 3500],   // $1.2M - $3.5M
  };
  
  const [minPrice, maxPrice] = priceRanges[bhk];
  const price = Math.floor(minPrice + Math.random() * (maxPrice - minPrice)) * 1000;
  
  const daysAgo = Math.floor(Math.random() * 90);
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);

  return {
    id: `prop-${String(index + 1).padStart(3, "0")}`,
    title: `${titles[index % titles.length]} in ${locality}`,
    bhk,
    start_price: price,
    location: locality,
    city,
    images: [propertyImages[index % propertyImages.length]],
    status: Math.random() > 0.1 ? "published" : "draft",
    created_at: createdDate.toISOString(),
    property_type: Math.random() > 0.3 ? "apartment" : "house",
    description: `Beautiful ${bhk} room ${Math.random() > 0.3 ? "apartment" : "house"} located in the heart of ${locality}, ${city}. Features modern amenities and excellent transportation access.`,
  };
}

export const dummyProperties: Property[] = Array.from({ length: 100 }, (_, i) => generateProperty(i));

export const getCities = () => cities;
export const getLocalities = (city: string) => localities[city] || [];
