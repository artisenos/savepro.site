import { useState, useEffect } from "react";
import { Download, Link as LinkIcon, Zap, Video, CheckCircle2, ChevronDown, Music, Clock, Trash2, X } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
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

  const saveToHistory = (data: any) => {
    setHistory(prev => {
      const updated = [{ ...data, downloadedAt: Date.now() }, ...prev.filter(h => h.videoUrl !== data.videoUrl)].slice(0, 20);
      localStorage.setItem('savepro_history', JSON.stringify(updated));
      return updated;
    });
    setShowHistory(true);
  };

  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
    localStorage.removeItem('savepro_history');
    toast.success('تم مسح السجل');
  };

  const removeFromHistory = (videoUrl: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.videoUrl !== videoUrl);
      localStorage.setItem('savepro_history', JSON.stringify(updated));
      if (updated.length === 0) setShowHistory(false);
      return updated;
    });
  };

  const fetchVideoInfo = async (videoUrl: string) => {
    setIsLoading(true);
    setVideoData(null);
    try {
      const apiUrl = `/api/tikwm/`;
      const formData = new URLSearchParams();
      formData.append('url', videoUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': 'application/json'
        },
        body: formData
      });

      if (!response.ok) throw new Error("فشل الاتصال بالخادم");

      const result = await response.json();

      if (result.code !== 0 || !result.data) {
        throw new Error(result.msg || "تعذر العثور على الفيديو");
      }

      const data = result.data;
      const newVideoData = {
        title: data.title || "فيديو تيك توك",
        author: data.author?.nickname || "مستخدم تيك توك",
        cover: data.cover || "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
        videoUrl: data.play || data.wmplay,
        musicUrl: data.music
      };
      setVideoData(newVideoData);
      saveToHistory(newVideoData);
      toast.success("تم جلب الفيديو بنجاح");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "حدث خطأ أثناء جلب الفيديو، تأكد من صحة الرابط");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("الرجاء إدخال رابط صحيح");
      return;
    }
    if (!url.includes("tiktok.com")) {
      toast.error("الرجاء إدخال رابط تيك توك صحيح");
      return;
    }
    fetchVideoInfo(url);
  };

  const handleDirectDownload = async (fileUrl: string | undefined, type: 'video' | 'music') => {
    if (!fileUrl) {
      toast.error(`رابط ${type === 'video' ? 'الفيديو' : 'الموسيقى'} غير متوفر`);
      return;
    }

    const ext = type === 'video' ? 'mp4' : 'mp3';
    const filename = `savepro-${type}-${Date.now()}.${ext}`;
    const toastId = toast.loading(`جاري تحميل ${type === 'video' ? 'الفيديو' : 'الموسيقى'}...`);

    const triggerBlob = (blob: Blob) => {
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    };

    // 1st attempt: fetch directly (works when CDN allows CORS)
    try {
      const r = await fetch(fileUrl, { mode: 'cors' });
      if (r.ok) {
        triggerBlob(await r.blob());
        toast.success('تم التحميل بنجاح', { id: toastId });
        return;
      }
    } catch (_) { /* fall through */ }

    // 2nd attempt: allorigins proxy
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fileUrl)}`;
      const r = await fetch(proxyUrl);
      if (r.ok) {
        triggerBlob(await r.blob());
        toast.success('تم التحميل بنجاح', { id: toastId });
        return;
      }
    } catch (_) { /* fall through */ }

    // 3rd attempt: thingproxy fallback
    try {
      const proxyUrl = `https://thingproxy.freeboard.io/fetch/${fileUrl}`;
      const r = await fetch(proxyUrl);
      if (r.ok) {
        triggerBlob(await r.blob());
        toast.success('تم التحميل بنجاح', { id: toastId });
        return;
      }
    } catch (_) { /* fall through */ }

    // Final fallback: force-download via <a> with download attribute
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = filename;
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('تم بدء التحميل – تحقق من قائمة التنزيلات', { id: toastId });
    } catch (e) {
      toast.error('فشل التحميل، حاول مجدداً', { id: toastId });
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-900 py-16 md:py-24 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="absolute inset-0 z-0 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight max-w-4xl">
            تنزيل فيديو تيك توك <span className="text-blue-600 dark:text-blue-500">بدون علامة مائية</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl">
            أفضل طريقة لتنزيل مقاطع فيديو TikTok مجاناً وبجودة عالية. لا حاجة لتثبيت أي برامج، فقط انسخ الرابط وحمل!
          </p>

          <form onSubmit={handleDownload} className="w-full max-w-3xl bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-2 relative z-20 transition-colors">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-0 pl-3 flex items-center pr-4 pointer-events-none">
                <LinkIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ضع رابط فيديو تيك توك هنا..."
                className="block w-full rounded-xl border-0 py-4 pr-12 pl-4 bg-transparent text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:focus:ring-blue-500 text-lg outline-none transition-all"
                dir="rtl"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="h-6 w-6 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                <>
                  <Download className="h-6 w-6" />
                  تنزيل
                </>
              )}
            </button>
          </form>

          {/* Video Preview Card */}
          {videoData && (
            <div className="w-full max-w-3xl mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-6 items-center transition-colors z-20 relative text-right" dir="rtl">
              <div className="w-full md:w-1/3 aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex-shrink-0 border border-slate-200 dark:border-slate-700">
                <img src={videoData.cover} alt={`غلاف فيديو تيك توك: ${videoData.title} بواسطة ${videoData.author}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                     <Video className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4 w-full h-full justify-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2">{videoData.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">@{videoData.author}</p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <button
                    onClick={() => handleDirectDownload(videoData.videoUrl, 'video')}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    <Download className="w-5 h-5" />
                    تحميل الفيديو (بدون علامة)
                  </button>
                  {videoData.musicUrl && (
                    <button
                      onClick={() => handleDirectDownload(videoData.musicUrl, 'music')}
                      className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-800 px-6 py-4 text-lg font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-sm transition-all border border-slate-200 dark:border-slate-700"
                    >
                      <Music className="w-5 h-5" />
                      تحميل الموسيقى (MP3)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 z-20 relative">
            من خلال استخدام خدمتنا، فإنك توافق على شروط الاستخدام.
          </p>

        </div>
      </section>

      {/* Download History Section */}
      {showHistory && history.length > 0 && (
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                سجل التحميلات
              </h2>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                مسح الكل
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {history.map((item, idx) => (
                <div key={item.videoUrl + idx} className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group transition-all hover:shadow-md">
                  <div className="relative aspect-video bg-slate-200 dark:bg-slate-700">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFromHistory(item.videoUrl)}
                      className="absolute top-2 left-2 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      aria-label="حذف من السجل"
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
                      إعادة التحميل
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
              لماذا تختار SavePro لتحميل فيديوهات تيك توك؟
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              أفضل أداة تحميل تيك توك مجانية مع مميزات متقدمة لتحميل فيديوهات تيك توك بسهولة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">تحميل سريع</h3>
              <p className="text-slate-600 dark:text-slate-300">
                تحميل فيديوهات تيك توك بسرعة فائقة بدون انتظار طويل
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">بدون علامة مائية</h3>
              <p className="text-slate-600 dark:text-slate-300">
                احصل على فيديوهات تيك توك نظيفة بدون أي علامات مائية
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">تحميل الموسيقى</h3>
              <p className="text-slate-600 dark:text-slate-300">
                قم بتحميل موسيقى تيك توك بتنسيق MP3 بجودة عالية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-to-use" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              كيفية تحميل فيديوهات تيك توك
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              خطوات بسيطة لتحميل أي فيديو من تيك توك باستخدام موقعنا
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">انسخ الرابط</h3>
              <p className="text-slate-600 dark:text-slate-300">
                انسخ رابط الفيديو من تطبيق تيك توك أو الموقع
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">ألصق الرابط</h3>
              <p className="text-slate-600 dark:text-slate-300">
                الصق الرابط في مربع البحث في موقع SavePro
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">تحميل الفيديو</h3>
              <p className="text-slate-600 dark:text-slate-300">
                اضغط على زر التحميل واحصل على الفيديو فوراً
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 transition-colors scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              إجابات على أكثر الأسئلة شيوعاً حول استخدام SavePro
            </p>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <FaqItem
              question="هل أداة SavePro مجانية؟"
              answer="نعم، موقع SavePro مجاني بالكامل ولن يطلب منك أي رسوم لتنزيل الفيديوهات."
            />
            <FaqItem
              question="هل يمكنني تنزيل مقاطع فيديو TikTok على أجهزة iPhone / iPad؟"
              answer="نعم بالتأكيد. إذا كنت تستخدم نظام iOS، نوصي باستخدام متصفح Safari لإجراء التنزيل بسهولة."
            />
            <FaqItem
              question="هل أقوم بتنزيل الفيديوهات بدون علامة مائية فعلاً؟"
              answer="نعم، الميزة الأساسية لموقعنا هي إزالة العلامة المائية وشعار تيك توك من الفيديو ليظهر بشكل نقي."
            />
            <FaqItem
              question="هل أحتاج لتثبيت أي برنامج أو تطبيق؟"
              answer="لا، SavePro يعمل مباشرة من المتصفح. لا تحتاج لتثبيت أي شيء على جهازك."
            />
            <FaqItem
              question="ما هي جودة الفيديو الذي أقوم بتحميله؟"
              answer="يتم تحميل الفيديوهات بأعلى جودة متاحة من خوادم TikTok، عادة بدقة HD أو Full HD."
            />
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