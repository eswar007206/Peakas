import { Gavel, Eye, Shield, Scale } from "lucide-react";

const stats = [
  { icon: Gavel, value: "入札", label: "オークション形式", description: "公正な価格決定" },
  { icon: Eye, value: "100%", label: "透明性", description: "取引情報を公開" },
  { icon: Shield, value: "確認済", label: "物件審査", description: "厳選された物件のみ" },
  { icon: Scale, value: "公正", label: "適正価格", description: "市場が価格を決定" },
];

export const TrustBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-card to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">オークション形式のメリット</h2>
          <p className="text-muted-foreground mt-2">透明性と公正さで選ばれるプラットフォーム</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-6 text-center shadow-card border border-border hover:border-amber-400/50 transition-all">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-amber-600">
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
