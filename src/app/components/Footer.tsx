import { Link } from "react-router";
import { ShieldCheck, Mail, Info, ExternalLink, Download, Globe, Github } from "lucide-react";

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer dir="ltr" className="relative z-10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 mt-auto py-16 transition-all overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: About */}
          <div className="space-y-6">
            <Link to="/" onClick={handleScrollToTop} className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                Save<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Pro</span>
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Premium TikTok video downloader. Download high-quality videos without watermark instantly. Fast, free, and secure.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Secure Connection</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-500" />
              Quick Links
            </h3>
            <ul className="space-y-4 text-slate-600 dark:text-slate-300">
              <li><Link to="/" onClick={handleScrollToTop} className="hover:text-cyan-500 transition-colors flex items-center gap-2">Home</Link></li>
              <li><a href="#features" className="hover:text-cyan-500 transition-colors flex items-center gap-2">Features</a></li>
              <li><a href="#how-to-use" className="hover:text-cyan-500 transition-colors flex items-center gap-2">How to Use</a></li>
              <li><a href="#faq" className="hover:text-cyan-500 transition-colors flex items-center gap-2">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              Legal
            </h3>
            <ul className="space-y-4 text-slate-600 dark:text-slate-300">
              <li><Link to="/privacy-policy" onClick={handleScrollToTop} className="hover:text-purple-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" onClick={handleScrollToTop} className="hover:text-purple-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/dmca" onClick={handleScrollToTop} className="hover:text-purple-500 transition-colors">DMCA Compliance</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-500" />
              Support
            </h3>
            <ul className="space-y-4 text-slate-600 dark:text-slate-300">
              <li><Link to="/contact" onClick={handleScrollToTop} className="hover:text-cyan-500 transition-colors">Contact Us</Link></li>
              <li><a href="mailto:support@savepro.site" className="hover:text-cyan-500 transition-colors font-medium">support@savepro.site</a></li>
              <li className="pt-2">
                <div className="flex gap-4">
                  <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-cyan-500 hover:text-white transition-all"><Github className="w-5 h-5" /></a>
                  <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-purple-500 hover:text-white transition-all"><ExternalLink className="w-5 h-5" /></a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SavePro.site. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Systems Operational
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>v1.2.0-stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
