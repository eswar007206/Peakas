import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PropertyForm } from "@/components/PropertyForm";
import { trackPageView } from "@/lib/analytics";
import { CheckCircle2, Clock, Eye, Shield } from "lucide-react";

const Sell = () => {
  useEffect(() => {
    trackPageView("sell");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              物件を売却する
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              無料で物件を掲載し、買主様と直接つながりましょう。
              仲介手数料なし、隠れたコストもありません。
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-card rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <p className="text-sm font-medium text-foreground">無料掲載</p>
            </div>
            <div className="bg-card rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-5 h-5 text-black" />
              </div>
              <p className="text-sm font-medium text-foreground">高い視認性</p>
            </div>
            <div className="bg-card rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5 text-black" />
              </div>
              <p className="text-sm font-medium text-foreground">簡単な手続き</p>
            </div>
            <div className="bg-card rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5 text-black" />
              </div>
              <p className="text-sm font-medium text-foreground">本人確認済み</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              物件情報
            </h2>
            <PropertyForm />
          </div>

          {/* Note */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            物件は審査後、24時間以内に公開されます。
            ログイン不要です。
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Sell;
