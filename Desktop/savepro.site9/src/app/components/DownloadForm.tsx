import { useState } from 'react';
import { Download, Loader2, Link as LinkIcon, Video, Music } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface VideoData {
  title: string;
  author: string;
  cover: string;
  videoUrl: string;
  musicUrl?: string;
}

export default function DownloadForm() {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error(t('emptyInputError'), { dir: 'ltr' });
      return;
    }

    setLoading(true);
    setVideoData(null);

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Error occurred');
      }

      setVideoData(result);
      toast.success(t('successMsg'), { dir: 'ltr' });
      setUrl('');

    } catch (err: any) {
      toast.error(err.message || 'Connection failed', { dir: 'ltr' });
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
      <motion.form 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onSubmit={handleSubmit} 
        className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,255,255,0.1)] border border-white/20 dark:border-cyan-500/20 flex flex-col md:flex-row gap-2 transition-all relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pl-3 flex items-center pr-4 pointer-events-none">
            <LinkIcon className="h-5 w-5 text-slate-400 dark:text-cyan-500/50" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="block w-full rounded-xl border-0 py-4 pr-12 pl-4 bg-transparent text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 text-lg outline-none transition-all shadow-inner bg-white/50 dark:bg-black/20"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="relative flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-600/30 hover:bg-cyan-500 hover:shadow-cyan-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
        >
          {loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-50 animate-pulse"></div>
          )}
          {/* Subtle Glow Animation */}
          <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-md animate-[pulse_2s_ease-in-out_infinite]"></div>
          
          <span className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                {t('processing')}
              </>
            ) : (
              <>
                <Download className="h-6 w-6" />
                {t('downloadBtn')}
              </>
            )}
          </span>
        </motion.button>
      </motion.form>

      {/* Processing Indicator */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="w-full mt-6 flex items-center justify-center gap-3 text-cyan-600 dark:text-cyan-400 animate-pulse"
        >
          <div className="h-1.5 flex-1 max-w-xs bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
          </div>
          <span className="text-sm font-medium">{t('fetchingData')}</span>
        </motion.div>
      )}

      {/* Video Preview Card with Glassmorphism */}
      {videoData && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full mt-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-cyan-900/10 border border-white/40 dark:border-cyan-500/30 p-6 flex flex-col md:flex-row gap-8 items-center transition-all text-right"
        >
          <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex-shrink-0 border-4 border-white/50 dark:border-slate-800/50 shadow-lg">
            <img src={videoData.cover} alt="Video Cover" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
               <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Video className="w-5 h-5 text-white drop-shadow-md" />
               </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-6 w-full justify-center">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white line-clamp-2 leading-tight tracking-tight drop-shadow-sm">{videoData.title}</h3>
              <p className="text-slate-500 dark:text-cyan-400 mt-2 font-medium flex items-center gap-1 justify-end">
                @{videoData.author}
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBrowserDownload(videoData.videoUrl, 'savepro-video.mp4')}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:from-cyan-500 hover:to-purple-500 transition-all border border-cyan-400/20"
              >
                <Download className="w-6 h-6" /> {t('videoQuality')}
              </motion.button>
              
              {videoData.musicUrl && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBrowserDownload(videoData.musicUrl, 'savepro-music.mp3')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-6 py-4 text-lg font-bold text-slate-800 dark:text-white hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all border border-slate-200 dark:border-slate-600"
                >
                  <Music className="w-5 h-5 text-purple-500" /> {t('musicQuality')}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
