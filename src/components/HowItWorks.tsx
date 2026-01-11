import { Search, Building2, FileCheck, Key, ArrowRight } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Search,
    title: "物件を探す",
    description: "日本全国の厳選された物件を検索",
  },
  {
    step: 2,
    icon: Building2,
    title: "詳細を確認",
    description: "写真や物件情報をじっくりご覧ください",
  },
  {
    step: 3,
    icon: FileCheck,
    title: "お問い合わせ",
    description: "内見や詳細情報についてお気軽にご連絡ください",
  },
  {
    step: 4,
    icon: Key,
    title: "ご契約",
    description: "専門スタッフが丁寛にサポートいたします",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ご利用の流れ
          </h2>
          <p className="text-muted-foreground mt-2">
            理想の物件探しのステップ
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-12 -right-3 z-10">
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              )}
              
              <div className="bg-card rounded-xl p-6 h-full shadow-card border border-border hover:border-primary/30 hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
