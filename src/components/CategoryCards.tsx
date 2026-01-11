import { Link } from "react-router-dom";
import { Building2, Home, TrendingUp, Clock } from "lucide-react";

const categories = [
  {
    title: "物件を購入",
    subtitle: "理想の住まいを探す",
    icon: Home,
    link: "/buy",
    bgColor: "bg-primary/10",
  },
  {
    title: "物件を売却",
    subtitle: "物件を掲載する",
    icon: TrendingUp,
    link: "/sell",
    bgColor: "bg-green-100",
  },
  {
    title: "新着物件",
    subtitle: "最新の物件情報",
    icon: Building2,
    link: "/buy?type=new",
    bgColor: "bg-blue-100",
  },
  {
    title: "即入居可",
    subtitle: "すぐにお引越し可能",
    icon: Clock,
    link: "/buy?ready=true",
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
