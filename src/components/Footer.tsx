import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold mb-4 block tracking-tight">
              PEAKAS
            </Link>
            <p className="text-sm text-background/70 mb-4">
              厳選された不動産物件を、信頼と実績でお届けします。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">クイックリンク</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/buy" className="hover:text-primary transition-colors">物件を購入</Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-primary transition-colors">物件を売却</Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-primary transition-colors">新着物件</Link>
              </li>
              <li>
                <Link to="/buy" className="hover:text-primary transition-colors">おすすめ物件</Link>
              </li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-semibold mb-4">主要都市</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link to="/buy?city=Tokyo" className="hover:text-primary transition-colors">東京</Link>
              </li>
              <li>
                <Link to="/buy?city=Osaka" className="hover:text-primary transition-colors">大阪</Link>
              </li>
              <li>
                <Link to="/buy?city=Yokohama" className="hover:text-primary transition-colors">横浜</Link>
              </li>
              <li>
                <Link to="/buy?city=Kyoto" className="hover:text-primary transition-colors">京都</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">お問い合わせ</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-background/70" />
                <span>support@peakas.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-background/70" />
                <span>0120-123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-background/70 mt-0.5" />
                <span>東京都渋谷区1-1-1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm text-background/50">
          <p>© 2026 PEAKAS. 理想の住まいをここから。</p>
        </div>
      </div>
    </footer>
  );
};
