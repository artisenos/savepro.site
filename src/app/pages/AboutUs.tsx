import { Users, Target, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <Users className="w-10 h-10 text-white" />
          </div>
          <div className="text-center md:text-start">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('aboutUsTitle')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Leading the future of digital content accessibility.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('aboutUsStory')}</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('aboutUsStoryContent')} SavePro started as a small project by a group of developers who were frustrated by the slow and ad-bloated downloaders available online. We envisioned a tool that was fast, clean, and respected user privacy.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('aboutUsMission')}</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('aboutUsMissionContent')} Our goal is to provide a seamless experience for creators and users alike to save their favorite moments from the internet safely and without compromises on quality.
            </p>
          </section>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-700/50 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-green-500" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t('aboutUsPrivacyExcellence')}</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
            {t('aboutUsPrivacyExcellenceContent')} At SavePro, we believe that your data belongs to you. We do not store any of your downloads on our servers, and we do not track your browsing history. Our system is built on a "stateless" architecture, ensuring that your privacy is maintained from the moment you paste a link to the moment you save your file.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-center shadow-sm">
              <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">0%</span>
              <span className="text-xs text-slate-500">Data Stored</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-center shadow-sm">
              <span className="block text-2xl font-bold text-cyan-600 dark:text-cyan-400">100%</span>
              <span className="text-xs text-slate-500">Secure</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-center shadow-sm">
              <span className="block text-2xl font-bold text-purple-600 dark:text-purple-400">No</span>
              <span className="text-xs text-slate-500">Registration</span>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-center shadow-sm">
              <span className="block text-2xl font-bold text-green-600 dark:text-green-400">Fast</span>
              <span className="text-xs text-slate-500">Servers</span>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20 dark:border-indigo-500/20 shadow-lg text-center">
          <p className="text-2xl font-black text-slate-800 dark:text-slate-200 italic leading-tight">
            "Providing technical excellence while respecting your digital autonomy."
          </p>
        </div>
      </div>
    </div>
  );
}
