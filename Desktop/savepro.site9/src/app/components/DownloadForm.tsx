import { useState } from 'react';
import { Download, Loader2, Link as LinkIcon, Video, Music } from 'lucide-react';
import { toast } from 'sonner';

interface VideoData {
  title: string;
  author: string;
  cover: string;
  videoUrl: string;
  musicUrl?: string;
}

export default function DownloadForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error('الرجاء إدخال رابط تيك توك أولاً', { dir: 'ltr' });
      return;
    }

    setLoading(true);
    setVideoData(null);

    try {
      // Call the Vercel Serverless Function backend
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'حدث خطأ غير معروف');
      }

      setVideoData(result);
      toast.success('تم تجهيز الفيديو بنجاح!', { dir: 'ltr' });
      setUrl(''); // clear input on success

    } catch (err: any) {
      toast.error(err.message || 'فشل الاتصال بالخادم', { dir: 'ltr' });
      console.error('Download error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBrowserDownload = (mediaUrl: string, filename: string) => {
    // Open in a new tab to let the browser handle the download natively 
    // since Vercel serverless limits stream sizes.
    const a = document.createElement('a');
    a.href = mediaUrl;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div dir="ltr" className="w-full max-w-3xl mx-auto flex flex-col items-center z-20 relative">
      <form 
        onSubmit={handleSubmit} 
        className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/20 dark:border-slate-700/50 flex flex-col md:flex-row gap-2 transition-all relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pl-3 flex items-center pr-4 pointer-events-none">
            <LinkIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ضع رابط فيديو تيك توك هنا..."
            className="block w-full rounded-xl border-0 py-4 pr-12 pl-4 bg-transparent text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-blue-400 text-lg outline-none transition-all shadow-inner bg-white/50 dark:bg-black/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="relative flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
        >
          {loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-50 animate-pulse"></div>
          )}
          <span className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              <>
                <Download className="h-6 w-6" />
                تنزيل
              </>
            )}
          </span>
        </button>
      </form>

      {/* Processing Indicator */}
      {loading && (
        <div className="w-full mt-6 flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400 animate-pulse">
          <div className="h-1.5 flex-1 max-w-xs bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
          </div>
          <span className="text-sm font-medium">جاري جلب البيانات من الخادم...</span>
        </div>
      )}

      {/* Video Preview Card with Glassmorphism */}
      {videoData && (
        <div className="w-full mt-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-blue-900/10 border border-white/40 dark:border-slate-700/60 p-6 flex flex-col md:flex-row gap-8 items-center transition-all text-right animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex-shrink-0 border-4 border-white/50 dark:border-slate-800/50 shadow-lg">
            <img src={videoData.cover} alt="غلاف الفيديو" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
               <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Video className="w-5 h-5 text-white drop-shadow-md" />
               </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-6 w-full justify-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white line-clamp-2 leading-tight tracking-tight drop-shadow-sm">{videoData.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-1 justify-end">
                @{videoData.author}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => handleBrowserDownload(videoData.videoUrl, 'savepro-video.mp4')}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-1 active:translate-y-0 transition-all border border-blue-400/20"
              >
                <Download className="w-6 h-6" /> تحميل الفيديو (جودة عالية / بدون علامة)
              </button>
              
              {videoData.musicUrl && (
                <button
                  onClick={() => handleBrowserDownload(videoData.musicUrl, 'savepro-music.mp3')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-6 py-4 text-lg font-bold text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all border border-slate-200 dark:border-slate-600"
                >
                  <Music className="w-5 h-5 text-purple-500" /> تحميل الموسيقى (MP3)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
