import { Users, Target, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('aboutUsTitle')}
          </h1>
        </div>

        <div className="space-y-12 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('aboutUsStory')}</h2>
            </div>
            <p>{t('aboutUsStoryContent')}</p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-red-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('aboutUsMission')}</h2>
            </div>
            <p>{t('aboutUsMissionContent')}</p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('aboutUsPrivacyExcellence')}</h2>
            </div>
            <p>{t('aboutUsPrivacyExcellenceContent')}</p>
          </section>

          <div className="mt-12 p-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20 dark:border-indigo-500/20 shadow-lg text-center">
            <p className="text-xl font-medium text-slate-800 dark:text-slate-200 italic">
              "Providing technical excellence while respecting your digital autonomy."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
