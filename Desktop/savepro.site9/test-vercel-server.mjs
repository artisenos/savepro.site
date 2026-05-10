import http from 'http';
import handler from './api/download.js';
import url from 'url';

const server = http.createServer(async (req, res) => {
  if (req.url?.startsWith('/api/download')) {
    const parsedUrl = url.parse(req.url, true);
    
    // Mock Vercel request object
    req.query = parsedUrl.query;
    
    // Mock Vercel response object
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    await handler(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3001, () => {
  console.log('Test Vercel API running on port 3001');
});
