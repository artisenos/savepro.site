export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed. Use GET.' });
  }

  const { url } = req.query;

  // Basic validation
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, message: 'الرجاء إرسال رابط صحيح.' });
  }

  if (!url.includes('tiktok.com') && !url.includes('tiktok')) {
    return res.status(400).json({ success: false, message: 'الرابط غير صحيح، يرجى إدخال رابط تيك توك.' });
  }

  const rapidApiKey = process.env.RAPIDAPI_KEY || process.env.VITE_RAPIDAPI_KEY;
  const rapidApiHost = 'tiktok-video-no-watermark2.p.rapidapi.com';

  if (!rapidApiKey) {
    console.error('Missing RAPIDAPI_KEY environment variable.');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  try {
    const apiUrl = `https://${rapidApiHost}/?url=${encodeURIComponent(url)}&hd=1`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': rapidApiHost,
        'x-rapidapi-key': rapidApiKey
      }
    });

    const data = await response.json();

    // Check for rate limit or unauthorized errors from RapidAPI
    if (response.status === 403 || response.status === 429) {
      return res.status(403).json({ 
        success: false, 
        message: 'عذراً، انتهت حصة التحميل اليومية أو أن مفتاح API غير صالح.' 
      });
    }

    if (!response.ok) {
      return res.status(502).json({ 
        success: false, 
        message: `خطأ في الخادم الوسيط: ${response.status}` 
      });
    }

    // Check specific API error codes
    if (data.code !== 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'لم يتم العثور على الفيديو أو أنه محذوف.' 
      });
    }

    // Validate data payload
    if (!data.data) {
      return res.status(502).json({ 
        success: false, 
        message: 'البيانات المستلمة من الخادم غير صالحة.' 
      });
    }

    // Construct the clean JSON response
    const videoData = data.data;
    
    // Helper to ensure HTTPS
    const forceHttps = (link) => link ? link.replace(/^http:\/\//, 'https://') : '';

    return res.status(200).json({
      success: true,
      title: videoData.title || 'TikTok Video',
      author: videoData.author?.nickname || videoData.author || 'TikTok User',
      cover: forceHttps(videoData.cover),
      videoUrl: forceHttps(videoData.hdplay || videoData.play || videoData.wmplay),
      musicUrl: forceHttps(videoData.music),
      duration: videoData.duration || 0
    });

  } catch (error) {
    console.error('API Wrapper Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ داخلي في الخادم أثناء معالجة الطلب.' 
    });
  }
}
