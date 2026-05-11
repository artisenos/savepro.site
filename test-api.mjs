const url = 'https://www.tiktok.com/@naturatiia/video/7609610554092555540?is_from_webapp=1&sender_device=pc';

const formData = new URLSearchParams();
formData.append('url', url);

const response = await fetch('https://tikwm.com/api/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json'
  },
  body: formData
});

const result = await response.json();
console.log('Status code:', result.code);
console.log('Message:', result.msg);
if (result.data) {
  const d = result.data;
  console.log('Title:', d.title);
  console.log('Author:', d.author?.nickname);
  console.log('Cover:', d.cover ? 'YES' : 'NO');
  console.log('Video URL (play):', d.play ? d.play.substring(0, 80) : 'NONE');
  console.log('Music URL:', d.music ? d.music.substring(0, 80) : 'NONE');
} else {
  console.log('No data returned:', JSON.stringify(result));
}
