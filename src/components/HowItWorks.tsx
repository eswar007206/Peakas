import { Search, Building2, Gavel, Handshake, ArrowRight } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: Search,
    title: "物件を探す",
    description: "厳選されたオークション物件を検索",
  },
  {
    step: 2,
    icon: Building2,
    title: "詳細を確認",
    description: "写真や物件情報、オークション条件を確認",
  },
  {
    step: 3,
    icon: Gavel,
    title: "入札する",
    description: "希望価格で入札。透明な競争で公正な取引",
  },
  {
    step: 4,
    icon: Handshake,
    title: "落札・契約",
    description: "落札後、専門スタッフがサポートいたします",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            オークションの流れ
          </h2>
          <p className="text-muted-foreground mt-2">
            透明な入札プロセスで安心の不動産取引
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-12 -right-3 z-10">
                  <ArrowRight className="w-6 h-6 text-amber-500" />
                </div>
              )}
              
              <div className="bg-card rounded-xl p-6 h-full shadow-card border border-border hover:border-amber-400/50 hover:shadow-card-hover transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-amber-600" />
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
