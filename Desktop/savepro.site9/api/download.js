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

  try {
    const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const data = await response.json();

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
