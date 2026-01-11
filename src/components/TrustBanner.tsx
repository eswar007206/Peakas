import { Building2, MapPin, Shield, Award } from "lucide-react";

const stats = [
  { icon: Building2, value: "100+", label: "厳選物件", description: "丁寛に選定" },
  { icon: MapPin, value: "8", label: "主要都市", description: "日本全国" },
  { icon: Shield, value: "100%", label: "確認済み", description: "品質保証" },
  { icon: Award, value: "Top", label: "高品質", description: "専門サポート" },
];

export const TrustBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">PEAKASが選ばれる理由</h2>
          <p className="text-muted-foreground mt-2">日本の不動産における信頼のパートナー</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-6 text-center shadow-card border border-border hover:border-primary/30 transition-all">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-black" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <p className="font-medium text-foreground mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
