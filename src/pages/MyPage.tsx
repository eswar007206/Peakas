import { TrendingUp, Video, FileText, Calendar, FileCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TransactionStepper } from "@/components/TransactionStepper";

const MyPage = () => {
  // Sample property data for demonstration
  const sampleProperty = {
    title: "福岡市中央区浄水通り 邸宅",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    status: "最高額入札者として参加中",
    currentBid: "2億4800万円",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Current Transaction Progress Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h1 className="text-xl font-bold text-gray-900">現在の取引進捗</h1>
        </div>

        {/* Property Card with Bidding Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Property Image */}
            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={sampleProperty.image} 
                alt={sampleProperty.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property Info */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{sampleProperty.title}</h2>
                <div className="flex items-center gap-2 text-primary text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{sampleProperty.status}</span>
                </div>
              </div>

              {/* Bid Amount */}
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">現在の入札額</p>
                <p className="text-2xl md:text-3xl font-bold text-orange-500">{sampleProperty.currentBid}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Stepper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <TransactionStepper currentStep={4} />
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Virtual Briefing */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-gray-900">VIRTUAL BRIEFING</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              司法書士による重要事項説明（IT重説）の予約が可能です。オンラインで完結し、録画も保存されます。
            </p>
            <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              予約カレンダーを表示
            </button>
          </div>

          {/* Digital Contract */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-400">DIGITAL CONTRACT</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              クラウドサイン連携による電子署名。IT重説完了後に有効化されます。
            </p>
            <button className="w-full bg-gray-200 text-gray-400 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2" disabled>
              <FileCheck className="w-4 h-4" />
              重説完了後に有効化
            </button>
          </div>
        </div>

        {/* Future Vision Note */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-bold text-gray-900 mb-2">🏠 PrimeAuctionについて</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            これは不動産オークション形式のサービスです。将来的にはマイページから進捗確認や入札中の物件をチェックできるようになります。
            現在はMVPとして、サービスのコンセプトとユーザー体験をお見せしています。
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyPage;
