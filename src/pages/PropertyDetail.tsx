import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Calendar, Home, Maximize, Bath, Car, ChevronLeft, ChevronRight, Phone, Mail, Share2, Gavel } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/hooks/useProperties";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, formatDate } from "@/lib/formatPrice";
import { trackPageView } from "@/hooks/useAnalytics";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    trackPageView("property_detail");
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        setLoading(false);
        return;
      }

      setProperty(data);
      setLoading(false);
    };

    fetchProperty();
  }, [id]);

  const nextImage = () => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-[16/10] rounded-xl" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">物件が見つかりません</h1>
          <p className="text-muted-foreground mb-8">申し訳ございませんが、お探しの物件は見つかりませんでした。</p>
          <Link to="/buy">
            <Button>物件一覧に戻る</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&q=80"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>戻る</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? "bg-primary" : "bg-card/60"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg">
                  {property.bhk}LDK
                </span>
                <span className="px-3 py-1.5 bg-card/90 backdrop-blur-sm text-foreground text-sm font-medium rounded-lg capitalize">
                  {property.property_type === "apartment" ? "マンション" : "戸建"}
                </span>
              </div>
              
              {/* Auction Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-lg">
                  オークション中
                </span>
              </div>
            </div>

            {/* Property Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{property.location}、{property.city}</span>
              </div>
            </div>

            {/* Price & Bid Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">現在価格</p>
                  <p className="text-3xl font-bold text-orange-500">{formatPrice(property.start_price)}</p>
                </div>
                <button
                  disabled
                  className="w-full md:w-auto px-8 py-4 bg-gray-100 text-gray-400 font-semibold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200"
                >
                  <Gavel className="w-5 h-5" />
                  入札する（準備中）
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <Home className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">{property.bhk}LDK</p>
                <p className="text-xs text-muted-foreground">間取り</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <Maximize className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">--㎡</p>
                <p className="text-xs text-muted-foreground">専有面積</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <Bath className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">{property.bhk}</p>
                <p className="text-xs text-muted-foreground">バスルーム</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <Car className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">あり</p>
                <p className="text-xs text-muted-foreground">駐車場</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">物件について</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || `${property.location}、${property.city}に位置する素敵な${property.bhk}LDKの${property.property_type === "apartment" ? "マンション" : "戸建"}です。充実した設備と良好なアクセスが特徴です。`}
              </p>
            </div>

            {/* Details Table */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">物件詳細</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">物件種別</span>
                  <span className="font-medium text-foreground">{property.property_type === "apartment" ? "マンション" : "戸建"}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">間取り</span>
                  <span className="font-medium text-foreground">{property.bhk}LDK</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">都市</span>
                  <span className="font-medium text-foreground">{property.city}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">エリア</span>
                  <span className="font-medium text-foreground">{property.location}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">ステータス</span>
                  <span className="font-medium text-foreground">{property.status === "published" ? "公開中" : "非公開"}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">掲載日</span>
                  <span className="font-medium text-foreground">{formatDate(property.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">お問い合わせ</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  ご質問や内見のご予約は、お気軽にお問い合わせください。
                </p>
                
                <div className="space-y-3">
                  <Button className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    電話する
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Mail className="w-4 h-4" />
                    メールする
                  </Button>
                  <Button variant="ghost" className="w-full gap-2">
                    <Share2 className="w-4 h-4" />
                    共有する
                  </Button>
                </div>
              </div>

              {/* Listed Date */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">掲載日</p>
                    <p className="font-medium text-foreground">{formatDate(property.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
