import { Link } from "react-router-dom";
import { Gavel, TrendingUp, Clock, Sparkles } from "lucide-react";

const categories = [
  {
    title: "オークション物件",
    subtitle: "入札で理想の物件を",
    icon: Gavel,
    link: "/buy",
    bgColor: "bg-amber-100",
  },
  {
    title: "物件を出品",
    subtitle: "オークションに出品する",
    icon: TrendingUp,
    link: "/sell",
    bgColor: "bg-green-100",
  },
  {
    title: "新着オークション",
    subtitle: "最新の出品物件",
    icon: Sparkles,
    link: "/buy?type=new",
    bgColor: "bg-blue-100",
  },
  {
    title: "まもなく終了",
    subtitle: "入札チャンスをお見逃しなく",
    icon: Clock,
    link: "/buy?ending=soon",
    bgColor: "bg-orange-100",
  },
];

export const CategoryCards = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.link}
              className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/30"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.bgColor} mb-4`}>
                <category.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {category.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
