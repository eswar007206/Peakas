import { Link } from "react-router-dom";
import { Home, ArrowRight, Search, Sparkles, Loader2, Building2, MapPin, Star, TrendingUp, Gavel } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackPageView } from "@/hooks/useAnalytics";
import { usePublishedProperties } from "@/hooks/useProperties";
import { Header } from "@/components/Header";
import { CategoryCards } from "@/components/CategoryCards";
import { FeaturedProperties } from "@/components/FeaturedProperties";
import { CitySearch } from "@/components/CitySearch";
import { TrustBanner } from "@/components/TrustBanner";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCities } from "@/data/properties";

const Index = () => {
  const { data: properties = [], isLoading } = usePublishedProperties();
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [bhk, setBhk] = useState("");
  const cities = getCities();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (bhk) params.set("bhk", bhk);
    navigate(`/buy?${params.toString()}`);
  };

  useEffect(() => {
    trackPageView("home");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Professional Japanese Real Estate Style */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
        {/* Background with local image */}
        <div className="absolute inset-0">
          <img 
            src="/heroback.png" 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px]">
            {/* Left Side - Content */}
            <div className="space-y-6">
              {/* Auction Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-amber-400/40">
                <Gavel className="w-4 h-4 text-amber-300" />
                <span>不動産オークションプラットフォーム</span>
              </div>
              
              {/* Brand Logo in Hero */}
              <div className="mb-2">
                <img src="/logo.png" alt="PEAKAS" className="h-16 md:h-20 brightness-0 invert opacity-90" />
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                不動産を
                <span className="block mt-2 text-amber-300">オークションで。</span>
              </h1>
              
              {/* Description */}
              <p className="text-lg text-white/80 max-w-xl">
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    読み込み中...
                  </span>
                ) : (
                  <>透明性の高いオークション形式で、{properties.length}件以上の厳選物件を公正に取引。理想の住まいを最適な価格で。</>
                )}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-xl">{isLoading ? "--" : properties.length}+</p>
                    <p className="text-xs text-white/60">物件数</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-xl">8</p>
                    <p className="text-xs text-white/60">主要都市</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-10 h-10 bg-amber-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-bold text-xl">入札</p>
                    <p className="text-xs text-white/60">形式</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/buy"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
                >
                  <Search className="w-5 h-5" />
                  物件を探す
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  物件を掲載
                </Link>
              </div>
            </div>

            {/* Right Side - Vertical Search Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-border">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground">物件を探す</h3>
                  <p className="text-sm text-muted-foreground mt-1">{isLoading ? "..." : properties.length}件以上の物件から検索</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      <MapPin className="w-4 h-4 inline mr-2 text-black" />
                      都市
                    </label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="都市を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      <Home className="w-4 h-4 inline mr-2 text-black" />
                      間取り
                    </label>
                    <Select value={bhk} onValueChange={setBhk}>
                      <SelectTrigger className="w-full h-12">
                        <SelectValue placeholder="間取りを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 LDK</SelectItem>
                        <SelectItem value="2">2 LDK</SelectItem>
                        <SelectItem value="3">3 LDK</SelectItem>
                        <SelectItem value="4">4+ LDK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSearch} className="w-full h-12 text-base" size="lg">
                    <Search className="w-5 h-5 mr-2" />
                    物件を検索
                  </Button>

                  <p className="text-xs text-center text-muted-foreground pt-2">
                    オークション形式で透明な取引を実現
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <CategoryCards />

      {/* Featured Properties */}
      <FeaturedProperties properties={properties} isLoading={isLoading} />

      {/* Trust Banner */}
      <TrustBanner />

      {/* City Search */}
      <CitySearch />

      {/* How It Works */}
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                オークションで透明な不動産取引を
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                入札形式だから、公正な価格で取引が可能。<br />
                売主も買主も納得のいく不動産取引を実現します。
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/buy"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg"
                >
                  <Search className="w-5 h-5" />
                  物件一覧を見る
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-card text-foreground font-semibold rounded-xl border-2 border-primary/20 hover:border-primary/50 transition-all"
                >
                  <Home className="w-5 h-5" />
                  物件を掲載する
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
