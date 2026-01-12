import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight mb-6 block">
              PEAKAS
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              九州から不動産取引の未来を。情報の透明性と取引の確実性を極限まで高めた、日本最高峰の次世代オンラインオークションプラットフォーム。
            </p>
          </div>

          {/* SERVICES */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-6 text-gray-300">SERVICES</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/buy" className="text-gray-400 hover:text-primary transition-colors">物件を探す</Link>
              </li>
              <li>
                <Link to="/sell" className="text-gray-400 hover:text-primary transition-colors">物件を売却する</Link>
              </li>
              <li>
                <Link to="/company" className="text-gray-400 hover:text-primary transition-colors">私たちの使命</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary transition-colors">よくあるご質問</Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-sm font-semibold tracking-widest mb-6 text-gray-300">COMPANY</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/company" className="text-gray-400 hover:text-primary transition-colors">会社概要</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">個人情報保護方針</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">利用規約</Link>
              </li>
              <li>
                <Link to="/legal" className="text-gray-400 hover:text-primary transition-colors">特定商取引に基づく表記</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>© 2026 PEAKAS. Technology for Trust.</p>
        </div>
      </div>
    </footer>
  );
};
