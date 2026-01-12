import { TrendingUp, Trophy, Globe, Smartphone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const CompanyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Large Icon */}
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <TrendingUp className="w-14 h-14 text-white" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Technology for Trust.
          </h1>

          {/* Taglines */}
          <p className="text-lg text-gray-600 mb-2">
            「不動産取引を、もっともフェアで透明な体験へ。」
          </p>
          <p className="text-lg text-gray-600">
            私たちは九州から、日本の不動産流通のデジタルシフトを牽引します。
          </p>
        </div>
      </section>

      {/* Vision and Company Profile Cards */}
      <section className="py-16 bg-[#0f172a]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* OUR VISION Card */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <h2 className="text-xl font-bold text-gray-900 tracking-wide">OUR VISION</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                情報の非対称性が強い不動産市場において、テクノロジーと法務の融合により、
                最高水準の透明性を提供。誰もが安心して資産を売買できる世界を創造することが使命です。
              </p>
            </div>

            {/* COMPANY PROFILE Card */}
            <div className="bg-[#1e293b] rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <h2 className="text-xl font-bold text-white tracking-wide">COMPANY PROFILE</h2>
              </div>
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-400 w-28 text-sm">COMPANY</span>
                  <span className="text-white text-sm">株式会社 PEAKAS</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-28 text-sm">OFFICE</span>
                  <span className="text-primary text-sm underline">福岡県福岡市中央区天神1丁目 1-1</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-28 text-sm">DIRECTOR</span>
                  <span className="text-primary text-sm underline">代表取締役 太郎 宏太郎</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 w-28 text-sm">LICENSE</span>
                  <span className="text-primary text-sm underline">福岡県知事(1)第12345号</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 成約率 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-500 mb-2">成約率</p>
              <p className="text-3xl font-bold text-gray-900">98.4%</p>
            </div>

            {/* 対応エリア */}
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-500 mb-2">対応エリア</p>
              <p className="text-3xl font-bold text-gray-900">九州全県</p>
            </div>

            {/* オンライン取引 */}
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-gray-500 mb-2">オンライン取引</p>
              <p className="text-3xl font-bold text-gray-900">100%対応</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyPage;

