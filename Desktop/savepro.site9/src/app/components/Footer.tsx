import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-12 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
              Save<span className="text-blue-600 dark:text-blue-500">Pro</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:text-right">
              أفضل أداة مجانية لتنزيل فيديوهات تيك توك بدون علامة مائية.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">سياسة الخصوصية</Link>
            <Link to="/terms-of-service" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">شروط الاستخدام</Link>
            <a href="mailto:contact@savepro.app" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">اتصل بنا</a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} SavePro. جميع الحقوق محفوظة. <br />
          نحن لسنا تابعين لـ TikTok أو ByteDance.
        </div>
      </div>
    </footer>
  );
}
