import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Download, Link as LinkIcon, Zap, Video, CheckCircle2, ChevronDown, Music, Clock, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DownloadForm from "../components/DownloadForm";
import { useLanguage } from "../contexts/LanguageContext";
import SEO from "../components/SEO";

// Force any http:// URL to https://
const forceHttps = (url: string | undefined): string | undefined => {
  if (!url) return url;
  return url.replace(/^http:\/\//i, 'https://');
};

const API_INFO = '/api/info';
const API_DOWNLOAD = '/api/download';

type DownloadState = 'idle' | 'processing' | 'downloading';

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  // Helper to handle clicks on links inside translated HTML strings
  const handleHtmlClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      e.preventDefault();
      const href = target.getAttribute('href');
      if (href) {
        if (href.startsWith('http')) {
          window.open(href, '_blank');
        } else {
          navigate(href);
        }
      }
    }
  };


  useEffect(() => {
    try {
      const saved = localStorage.getItem('savepro_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        if (parsed.length > 0) setShowHistory(true);
      }
    } catch {}
  }, []);

  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
    localStorage.removeItem('savepro_history');
    toast.success(t('historyCleared'));
  };

  const removeFromHistory = (videoUrl: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.videoUrl !== videoUrl);
      localStorage.setItem('savepro_history', JSON.stringify(updated));
      if (updated.length === 0) setShowHistory(false);
      return updated;
    });
  };

  const handleDirectDownload = async (fileUrl: string | undefined, type: 'video' | 'music') => {
    if (!fileUrl) {
      toast.error(t(type === 'video' ? 'videoNotAvailable' : 'musicNotAvailable'));
      return;
    }

    const ext = type === 'video' ? 'mp4' : 'mp3';
    const filename = `savepro-${type}-${Date.now()}.${ext}`;

    const toastId = toast.loading(t(type === 'video' ? 'downloadingVideo' : 'downloadingMusic'));

    try {
      const proxyUrl = `${API_DOWNLOAD}?url=${encodeURIComponent(fileUrl)}&type=${type}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(t('downloadFailed').replace('{status}', response.status.toString()));
      }

      const blob = await response.blob();
      if (blob.size < 1000) {
        throw new Error(t('fileTooSmall'));
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      toast.success(t('downloadSuccess'), { id: toastId });
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.message || t('downloadFailedGeneric'), { id: toastId });
    }
  };

  return (
    <div dir="ltr" className="flex flex-col w-full">
      <SEO 
        description="Download TikTok videos without watermark for free. Fast, easy, and secure TikTok video downloader."
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 py-16 md:py-24 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50 dark:from-blue-900/20 dark:via-slate-950 dark:to-slate-950"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight max-w-4xl tracking-tight">
            {t('heroTitlePart1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 dark:from-cyan-400 dark:to-purple-500">{t('heroTitlePart2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl font-medium">
            {t('heroDesc')}
          </p>

          {/* Integrate the new DownloadForm */}
          <DownloadForm />



          <p 
            className="mt-4 text-sm text-slate-500 dark:text-slate-400 z-20 relative cursor-default" 
            dangerouslySetInnerHTML={{ __html: t('termsAgreement') }} 
            onClick={handleHtmlClick}
          />

        </div>
      </section>

      {/* Download History Section */}
      {showHistory && history.length > 0 && (
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                {t('historyTitle')}
              </h2>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t('clearHistory')}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {history.map((item, idx) => (
                <div key={item.videoUrl + idx} className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group transition-all hover:shadow-md">
                  <div className="relative aspect-video bg-slate-200 dark:bg-slate-700">
                    <img src={item.cover} alt={item.title} width="320" height="180" className="w-full h-full object-cover" loading="lazy" />
                    <button
                      onClick={() => removeFromHistory(item.videoUrl)}
                      className="absolute top-2 left-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      aria-label={t('removeFromHistoryAria') || 'Remove from history'}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">@{item.author}</p>
                    <button
                      onClick={() => handleDirectDownload(item.videoUrl, 'video')}
                      className="mt-2 w-full flex items-center justify-center gap-1 text-sm py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t('reDownload')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {t('featuresTitle')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t('featuresDesc')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('featureFastTitle')}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t('featureFastDesc')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('featureNoWatermarkTitle')}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t('featureNoWatermarkDesc')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('featureMusicTitle')}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t('featureMusicDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-to-use" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('howItWorksTitle')}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">{t('howItWorksDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('step1Title')}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t('step1Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('step2Title')}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t('step2Desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{t('step3Title')}</h3>
              <p className="text-slate-600 dark:text-slate-300">{t('step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 transition-colors scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('faqTitle')}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">{t('faqDesc')}</p>
          </div>
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <FaqItem question={t('faq1Q')} answer={t('faq1A')} />
            <FaqItem question={t('faq2Q')} answer={t('faq2A')} />
            <FaqItem question={t('faq3Q')} answer={t('faq3A')} />
            <FaqItem question={t('faq4Q')} answer={t('faq4A')} />
            <FaqItem question={t('faq5Q')} answer={t('faq5A')} />
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
      <button
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-right"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-slate-900 dark:text-white text-lg pr-2">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed pr-8">
          {answer}
        </div>
      )}
    </div>
  );
}