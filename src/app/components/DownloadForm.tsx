import { useState } from 'react';
import { Download, Loader2, Link as LinkIcon, Video, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoData {
  title: string;
  author: string;
  cover: string;
  videoUrl: string;
  musicUrl?: string;
}

const API_INFO = '/api/info';
const API_DOWNLOAD = '/api/download';

export default function DownloadForm() {
  const { language, t } = useLanguage();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [videoDownloading, setVideoDownloading] = useState(false);
  const [musicDownloading, setMusicDownloading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [musicProgress, setMusicProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error(t('emptyInputError'), { id: 'empty-input' });
      return;
    }

    if (import.meta.env.DEV) console.log('[API] Submitting URL:', url);
    setLoading(true);
    setVideoData(null);

    const toastId = 'api-error';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(API_INFO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (import.meta.env.DEV) console.log('[API] Response status:', response.status, 'content-type:', response.headers.get('content-type'));

      // 1. Check HTTP status before parsing
      if (!response.ok) {
        const body = await response.text();
        console.error('[API] Non-ok response:', { status: response.status, body: body.slice(0, 500) });
        throw new Error(t('connectionError').replace('{status}', response.status.toString()));
      }

      // 2. Verify content-type is JSON
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const body = await response.text();
        console.error('[API] Unexpected content-type:', contentType, 'body:', body.slice(0, 500));
        throw new Error(t('invalidResponseError'));
      }

      // 3. Parse JSON
      const result = await response.json();

      // 4. Check API-level success
      if (result.code !== 0 || !result.data) {
        const errorCode = result.code || 'SERVER_ERROR';
        console.error('[API] API returned error:', { code: errorCode, msg: result.msg });
        
        let displayMsg = t('fetchError');
        if (errorCode === 'PRIVATE_VIDEO') displayMsg = t('privateVideoError');
        if (errorCode === 'DELETED_VIDEO') displayMsg = t('deletedVideoError');
        if (errorCode === 'INVALID_URL') displayMsg = t('invalidUrlError');
        if (errorCode === 'RATE_LIMIT') displayMsg = t('rateLimitError');
        if (errorCode === 'SERVER_ERROR') displayMsg = t('serverError');
        
        throw new Error(displayMsg);
      }

      const d = result.data;
      const parsedData: VideoData = {
        title: d.title || 'TikTok Video',
        author: d.author || 'TikTok User',
        cover: d.cover || '',
        videoUrl: d.videoUrlHd || d.videoUrlSd || '',
        musicUrl: d.musicUrl || undefined,
      };

      if (!parsedData.videoUrl) {
        console.error('[API] No video URL in response data:', JSON.stringify(d).slice(0, 300));
        throw new Error(t('videoNotAvailable'));
      }

      // Save to history
      try {
        const savedHistory = localStorage.getItem('savepro_history');
        const history = savedHistory ? JSON.parse(savedHistory) : [];
        const newItem = {
          title: parsedData.title,
          author: parsedData.author,
          cover: parsedData.cover,
          videoUrl: parsedData.videoUrl,
          timestamp: Date.now(),
        };
        const updatedHistory = [newItem, ...history.filter((item: any) => item.videoUrl !== parsedData.videoUrl)].slice(0, 12);
        localStorage.setItem('savepro_history', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error('[History] Failed to save:', e);
      }

      setVideoData(parsedData);
      toast.success(t('successMsg'), { id: 'api-success' });
      setUrl('');

    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      
      if (err.name === 'AbortError') {
        console.error('[API] Request timed out after 15s');
        toast.error(t('downloadTimeout'), { id: toastId });
      } else if (err.name === 'TypeError') {
        console.error('[API] Network error:', errorMsg);
        toast.error(t('serverError'), { id: toastId });
      } else {
        // Handle API-level errors or unknown errors
        toast.error(errorMsg || t('serverError'), { id: toastId });
      }
      
      if (import.meta.env.DEV) console.error('[API] handleSubmit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (mediaUrl: string, type: 'video' | 'music') => {
    if (!mediaUrl) {
      toast.error(t(type === 'video' ? 'videoNotAvailable' : 'musicNotAvailable'), { id: 'dl-no-url' });
      return;
    }

    let interval: any;

    const ext = type === 'video' ? 'mp4' : 'mp3';
    const filename = `savepro-${type}-${Date.now()}.${ext}`;

    // Set loading state for the specific button being clicked
    if (type === 'video') {
      setVideoDownloading(true);
      setVideoProgress(1);
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 95) return 95; // Wait at 95% until fetch completes
          // Slow down as it approaches 95%
          const remaining = 95 - prev;
          const increment = Math.max(0.1, remaining * 0.05);
          return Math.min(95, prev + increment);
        });
      }, 150);
    } else {
      setMusicDownloading(true);
      setMusicProgress(1);
      interval = setInterval(() => {
        setMusicProgress(prev => {
          if (prev >= 95) return 95;
          const remaining = 95 - prev;
          const increment = Math.max(0.1, remaining * 0.05);
          return Math.min(95, prev + increment);
        });
      }, 150);
    }

    const toastId = `dl-${type}-error`;

    try {
      // Use PHP bridge as a same-origin proxy to avoid CORS blocks
      const proxyUrl = `${API_DOWNLOAD}?url=${encodeURIComponent(mediaUrl)}&type=${type}`;
      if (import.meta.env.DEV) console.log(`[Download] Fetching ${type} via proxy:`, proxyUrl.slice(0, 100));
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        // Proxy returned an error — try to extract the server message
        let serverMsg = `HTTP ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody.msg) serverMsg = errBody.msg;
        } catch {}
        console.error(`[Download] Proxy error for ${type}:`, serverMsg);
        throw new Error(serverMsg);
      }

      // Verify we got a binary media file, not an unexpected type
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const errBody = await response.json();
        console.error(`[Download] Proxy returned unexpected JSON for ${type}:`, errBody);
        throw new Error(errBody.msg || t('unexpectedError'));
      }

      // Convert response to Blob
      const blob = await response.blob();

      // Basic validation - check if we got meaningful data
      if (blob.size === 0) {
        console.error(`[Download] Empty blob for ${type}`);
        throw new Error(t('emptyFileError'));
      }

      if (import.meta.env.DEV) console.log(`[Download] ${type} blob size:`, blob.size);

      // Create object URL and trigger download
      const objectUrl = URL.createObjectURL(blob);
      
      // Jump to 100% immediately on success
      if (type === 'video') setVideoProgress(100);
      else setMusicProgress(100);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(objectUrl);

      // Show success toast
      toast.success(type === 'video' ? t('downloadStartedVideo') : t('downloadStartedMusic'), { id: `dl-${type}-success` });
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (err.name === 'TypeError') {
        toast.error(type === 'video' ? t('downloadErrorVideo') : t('downloadErrorMusic'), { id: toastId });
      } else if (err.name === 'AbortError') {
        toast.error(t('downloadTimeout'), { id: toastId });
      } else {
        toast.error(`${type === 'video' ? t('downloadingVideo') : t('downloadingMusic')}: ${errorMsg}`, { id: toastId });
      }
      console.error('[Download] Error:', err);
    } finally {
      if (interval) clearInterval(interval);
      // Always reset loading state
      if (type === 'video') {
        setVideoDownloading(false);
        // Let the progress bar stay at 100% for a second before hiding
        setTimeout(() => setVideoProgress(0), 1000);
      } else {
        setMusicDownloading(false);
        setTimeout(() => setMusicProgress(0), 1000);
      }
    }
  };

  return (
    <div dir="ltr" className="w-full max-w-3xl mx-auto flex flex-col items-center z-20 relative">
      <form
        onSubmit={handleSubmit} 
        className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,255,255,0.1)] border border-white/20 dark:border-cyan-500/20 flex flex-col md:flex-row gap-2 relative overflow-hidden"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 end-0 pe-3 flex items-center ps-4 pointer-events-none">
            <LinkIcon className="h-5 w-5 text-slate-400 dark:text-cyan-500/50" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="block w-full rounded-xl border-0 py-4 pe-12 ps-4 bg-transparent text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 text-lg outline-none transition-all shadow-inner bg-white/50 dark:bg-black/20 text-start"
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-w-[160px] py-4">
            <Loader2 className="h-10 w-10 animate-spin text-savepro-primary" />
          </div>
        ) : (
          <button
            type="submit"
            disabled={loading}
            style={{ minWidth: '160px' }}
            className="relative flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-600/30 hover:bg-cyan-500 hover:shadow-cyan-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Download className="h-6 w-6" />
              {t('downloadBtn')}
            </span>
          </button>
        )}
      </form>

      {/* Processing Indicator */}
      {loading && (
        <div className="w-full mt-6 flex items-center justify-center gap-3 text-cyan-600 dark:text-cyan-400">
          <div className="h-1.5 flex-1 max-w-xs bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" style={{ width: '60%' }} />
          </div>
          <span className="text-sm font-medium">{t('fetchingData')}</span>
        </div>
      )}

      {/* Video Preview Card with Framer Motion */}
      <div className="w-full mt-8" style={{ minHeight: videoData ? 'auto' : '0' }}>
        <AnimatePresence mode="wait">
          {videoData && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-cyan-900/10 border border-white/50 dark:border-cyan-500/40 p-6 flex flex-col md:flex-row gap-8 items-center text-start"
            >
              <div className="w-full md:w-1/3 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex-shrink-0 border-4 border-white/50 dark:border-slate-800/50 shadow-lg">
                <img src={videoData.cover} alt="Video Cover" width="300" height="400" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <Video className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-6 w-full justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white line-clamp-2 leading-tight tracking-tight drop-shadow-sm">{videoData.title}</h3>
                  <p className="text-slate-500 dark:text-cyan-400 mt-2 font-medium flex items-center gap-1 justify-start">
                    @{videoData.author}
                  </p>
                </motion.div>

                <div className="flex flex-col gap-3 mt-2">
                    <div className="flex flex-col gap-1">
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => videoData.videoUrl && handleDownload(videoData.videoUrl, 'video')}
                        disabled={videoDownloading}
                        style={{ minWidth: '220px' }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-500 hover:to-purple-500 border border-cyan-400/20 disabled:opacity-70 disabled:cursor-not-allowed group transition-all"
                        aria-label={videoDownloading ? t('downloadingVideoAria') : t('videoQuality')}
                      >
                        {videoDownloading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            <Download className="w-6 h-6 group-hover:animate-bounce" />
                            {t('videoQuality')}
                          </>
                        )}
                      </motion.button>
                      
                      {videoProgress > 0 && (
                        <div className="w-full mt-4 animate-in fade-in zoom-in duration-300">
                          <div className="flex justify-between items-end mb-2 px-1">
                            <span className="text-sm font-medium text-slate-500/80 dark:text-cyan-400/60 flex items-center gap-1.5">
                              {t('processing')}
                              <span className="flex gap-0.5 mb-1">
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1 h-1 bg-current rounded-full animate-bounce"></span>
                              </span>
                            </span>
                            <span className="text-lg font-black text-cyan-600 dark:text-cyan-400 drop-shadow-sm leading-none">{Math.round(videoProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-100/10 dark:bg-slate-800/40 backdrop-blur-sm border border-white/10 dark:border-cyan-500/10 rounded-full h-5 overflow-hidden p-1 shadow-inner">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse" 
                              style={{ width: `${videoProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  
                    {videoData.musicUrl && (
                        <div className="flex flex-col gap-1">
                          <motion.button
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)", boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => videoData.musicUrl && handleDownload(videoData.musicUrl, 'music')}
                            disabled={musicDownloading}
                            style={{ minWidth: '220px' }}
                            className="flex items-center justify-center gap-2 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-6 py-4 text-lg font-bold text-slate-800 dark:text-white hover:shadow-lg border border-slate-200 dark:border-slate-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            aria-label={musicDownloading ? t('downloadingMusicAria') : t('musicQuality')}
                          >
                            {musicDownloading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <Music className="w-5 h-5 text-purple-500" />
                                {t('musicQuality')}
                              </>
                            )}
                          </motion.button>

                          {musicProgress > 0 && (
                            <div className="w-full mt-4 animate-in fade-in zoom-in duration-300">
                              <div className="flex justify-between items-end mb-2 px-1">
                                <span className="text-sm font-medium text-slate-500/80 dark:text-cyan-400/60 flex items-center gap-1.5">
                                  {t('processing')}
                                  <span className="flex gap-0.5 mb-1">
                                    <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1 h-1 bg-current rounded-full animate-bounce"></span>
                                  </span>
                                </span>
                                <span className="text-lg font-black text-cyan-600 dark:text-cyan-400 drop-shadow-sm leading-none">{Math.round(musicProgress)}%</span>
                              </div>
                              <div className="w-full bg-gray-100/10 dark:bg-slate-800/40 backdrop-blur-sm border border-white/10 dark:border-cyan-500/10 rounded-full h-5 overflow-hidden p-1 shadow-inner">
                                <div 
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-pulse" 
                                  style={{ width: `${musicProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
