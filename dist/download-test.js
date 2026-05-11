/**
 * SavePro Diagnostic Test Suite v2.0
 * ====================================
 * Paste this entire script into the browser console on https://savepro.site
 *
 * Usage:
 *   SaveProTest.run()                                         // full suite with default URL
 *   SaveProTest.run('https://www.tiktok.com/@user/video/123') // custom URL
 *   SaveProTest.checkBridge()                                 // test only bridge reachability
 *   SaveProTest.checkSSL()                                    // test only HTTPS/mixed-content
 */

const SaveProTest = (() => {
  const BRIDGE = window.location.origin + '/api-bridge.php';
  const DEFAULT_URL = 'https://www.tiktok.com/@tiktok/video/7000000000000000000';

  let passed = 0;
  let failed = 0;
  let warnings = 0;

  const reset = () => { passed = 0; failed = 0; warnings = 0; };

  const log = (step, status, msg, data) => {
    const ts = new Date().toISOString().split('T')[1].split('.')[0];
    const icons = { OK: '✅', FAIL: '❌', WARN: '⚠️', PENDING: '⏳', INFO: 'ℹ️' };
    const icon = icons[status] || '❓';
    console.log(`${icon} [${ts}] [${step}] ${msg}`);
    if (data !== undefined) console.log('   └─', data);
    if (status === 'OK') passed++;
    if (status === 'FAIL') failed++;
    if (status === 'WARN') warnings++;
  };

  const banner = (title) => {
    console.log('');
    console.log('╔' + '═'.repeat(52) + '╗');
    console.log('║  ' + title.padEnd(50) + '║');
    console.log('╚' + '═'.repeat(52) + '╝');
    console.log('');
  };

  // ─── TEST 1: Bridge Reachability ────────────────────────
  async function checkBridge() {
    banner('Test 1: API Bridge Reachability');
    log('BRIDGE', 'PENDING', `Testing ${BRIDGE} ...`);

    try {
      // OPTIONS preflight
      const optRes = await fetch(BRIDGE, { method: 'OPTIONS' });
      log('BRIDGE', optRes.status === 204 || optRes.ok ? 'OK' : 'WARN',
        `OPTIONS → HTTP ${optRes.status}`,
        { cors: optRes.headers.get('access-control-allow-origin') || 'missing' }
      );

      // POST with empty body (should return 400, not 500)
      const postRes = await fetch(BRIDGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const postJson = await postRes.json().catch(() => null);
      if (postRes.status === 400 && postJson && postJson.code === -1) {
        log('BRIDGE', 'OK', 'Empty POST correctly returns 400 with error JSON', postJson);
      } else {
        log('BRIDGE', 'WARN', `Empty POST returned HTTP ${postRes.status}`, postJson);
      }

      // GET without action (should return 405)
      const getRes = await fetch(BRIDGE);
      log('BRIDGE', getRes.status === 405 ? 'OK' : 'WARN',
        `Bare GET → HTTP ${getRes.status} (expected 405)`
      );

      return true;
    } catch (err) {
      log('BRIDGE', 'FAIL', 'Bridge is unreachable!', err.message);
      return false;
    }
  }

  // ─── TEST 2: SSL/HTTPS Compliance ──────────────────────
  async function checkSSL() {
    banner('Test 2: HTTPS / SSL Compliance');

    // Check page protocol
    const isHttps = window.location.protocol === 'https:';
    log('SSL', isHttps ? 'OK' : 'FAIL', `Page protocol: ${window.location.protocol}`);

    // Check bridge URL protocol
    const bridgeIsHttps = BRIDGE.startsWith('https://');
    log('SSL', bridgeIsHttps ? 'OK' : 'WARN', `Bridge URL: ${BRIDGE}`);

    // Check for Mixed Content via CSP meta/headers
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    log('SSL', 'INFO', `CSP meta tag: ${cspMeta ? cspMeta.content : 'not found (may be in HTTP headers)'}`);

    // Check all images/scripts/links on page for http://
    const allElements = document.querySelectorAll('img[src], script[src], link[href], video[src], source[src]');
    let mixedCount = 0;
    allElements.forEach(el => {
      const url = el.src || el.href;
      if (url && url.startsWith('http://')) {
        mixedCount++;
        log('SSL', 'WARN', `Mixed content detected: ${el.tagName} → ${url.substring(0, 100)}`);
      }
    });
    if (mixedCount === 0) {
      log('SSL', 'OK', `No mixed content found (checked ${allElements.length} elements)`);
    }

    // Listen for blocked mixed content errors
    const originalError = console.error;
    let blockedErrors = [];
    console.error = (...args) => {
      const msg = args.join(' ');
      if (msg.includes('Mixed Content') || msg.includes('blocked')) {
        blockedErrors.push(msg);
      }
      originalError.apply(console, args);
    };
    setTimeout(() => { console.error = originalError; }, 5000);

    return mixedCount === 0;
  }

  // ─── TEST 3: Metadata Fetch ────────────────────────────
  async function testMetadata(tiktokUrl) {
    banner('Test 3: Video Metadata Fetch');
    log('META', 'PENDING', `POST ${BRIDGE} with TikTok URL`);
    log('META', 'INFO', `URL: ${tiktokUrl}`);

    try {
      const t0 = performance.now();
      const res = await fetch(BRIDGE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ url: tiktokUrl })
      });
      const elapsed = (performance.now() - t0).toFixed(0);

      log('META', res.ok ? 'OK' : 'FAIL', `HTTP ${res.status} ${res.statusText} (${elapsed}ms)`);

      if (!res.ok) {
        const errText = await res.text();
        log('META', 'FAIL', 'Response body:', errText.substring(0, 500));
        return null;
      }

      const json = await res.json();

      if (json.code !== undefined && json.code !== 0) {
        log('META', 'FAIL', `API error: code=${json.code}`, json.msg);
        return null;
      }

      const data = json.data || json;
      const videoUrl = data.hdplay || data.play || data.wmplay || null;
      const musicUrl = data.music || null;

      // Validate URLs are HTTPS
      if (videoUrl && videoUrl.startsWith('http://')) {
        log('META', 'WARN', 'Video URL uses HTTP (not HTTPS)!', videoUrl.substring(0, 80));
      }
      if (musicUrl && musicUrl.startsWith('http://')) {
        log('META', 'WARN', 'Music URL uses HTTP (not HTTPS)!', musicUrl.substring(0, 80));
      }

      log('META', videoUrl ? 'OK' : 'FAIL', 'Video URL extracted', {
        title: data.title || 'N/A',
        author: data.author || 'N/A',
        video: videoUrl ? videoUrl.substring(0, 80) + '...' : 'MISSING',
        music: musicUrl ? musicUrl.substring(0, 80) + '...' : 'NONE',
      });

      return { videoUrl, musicUrl, data };
    } catch (err) {
      log('META', 'FAIL', 'Exception during metadata fetch', err.message);
      return null;
    }
  }

  // ─── TEST 4: Download Proxy Validation ────────────────
  async function testDownloadProxy(videoUrl) {
    banner('Test 4: Download Proxy Validation');

    if (!videoUrl) {
      log('PROXY', 'FAIL', 'No video URL to test — skipping');
      return false;
    }

    const proxyUrl = `${BRIDGE}?action=download&url=${encodeURIComponent(videoUrl)}&type=video`;
    log('PROXY', 'INFO', `Proxy URL: ${proxyUrl.substring(0, 120)}...`);

    // Verify HTTPS on proxy URL
    if (!proxyUrl.startsWith('https://') && window.location.protocol === 'https:') {
      log('PROXY', 'INFO', 'Proxy URL will use page origin protocol (HTTPS)');
    }

    try {
      const t0 = performance.now();
      const res = await fetch(proxyUrl);
      const elapsed = (performance.now() - t0).toFixed(0);

      const ct = res.headers.get('content-type') || 'unknown';
      const cd = res.headers.get('content-disposition') || 'none';
      const cl = res.headers.get('content-length') || 'unknown';

      log('PROXY', res.ok ? 'OK' : 'FAIL', `HTTP ${res.status} (${elapsed}ms)`, {
        'Content-Type': ct,
        'Content-Disposition': cd,
        'Content-Length': cl,
      });

      // Check Content-Disposition header
      if (cd.includes('attachment')) {
        log('PROXY', 'OK', 'Force-download header present ✓');
      } else {
        log('PROXY', 'FAIL', 'Missing Content-Disposition: attachment — file will open in browser!');
      }

      // Check Content-Type is media, not JSON (which means error)
      if (ct.includes('json')) {
        const errJson = await res.json().catch(() => null);
        log('PROXY', 'FAIL', 'Proxy returned JSON error instead of media', errJson);
        return false;
      }

      // Verify blob
      const blob = await res.blob();
      const sizeMB = (blob.size / 1024 / 1024).toFixed(2);

      if (blob.size < 1000) {
        log('PROXY', 'FAIL', `Blob too small: ${blob.size} bytes — likely invalid`);
        return false;
      }

      log('PROXY', 'OK', `Blob valid: ${sizeMB} MB, type=${blob.type}`);

      // Trigger download
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `savepro-test-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);

      log('PROXY', 'OK', 'Download triggered — check your browser downloads!');
      return true;
    } catch (err) {
      log('PROXY', 'FAIL', 'Download proxy exception', err.message);
      return false;
    }
  }

  // ─── FULL TEST SUITE ──────────────────────────────────
  async function run(tiktokUrl) {
    reset();
    const url = tiktokUrl || DEFAULT_URL;

    banner('SavePro Diagnostic Test Suite v2.0');
    console.log(`  Bridge:    ${BRIDGE}`);
    console.log(`  TikTok:    ${url}`);
    console.log(`  Protocol:  ${window.location.protocol}`);
    console.log(`  Timestamp: ${new Date().toISOString()}`);
    console.log('');

    // Run all tests
    const bridgeOk = await checkBridge();
    await checkSSL();

    let metadata = null;
    if (bridgeOk) {
      metadata = await testMetadata(url);
    }

    if (metadata && metadata.videoUrl) {
      await testDownloadProxy(metadata.videoUrl);
    }

    // Final Report
    console.log('');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│         FINAL TEST REPORT               │');
    console.log('├─────────────────────────────────────────┤');
    console.log(`│  ✅ Passed:   ${String(passed).padEnd(26)}│`);
    console.log(`│  ❌ Failed:   ${String(failed).padEnd(26)}│`);
    console.log(`│  ⚠️  Warnings: ${String(warnings).padEnd(25)}│`);
    console.log(`│  📊 Result:   ${(failed === 0 ? 'ALL PASS ✓' : 'HAS FAILURES ✗').padEnd(26)}│`);
    console.log('└─────────────────────────────────────────┘');
    console.log('');

    return { passed, failed, warnings };
  }

  return { run, checkBridge, checkSSL };
})();

console.log('');
console.log('🧪 SavePro Test Suite v2.0 loaded!');
console.log('   Commands:');
console.log('   SaveProTest.run()                     — Full test suite');
console.log('   SaveProTest.run("https://...")         — With custom URL');
console.log('   SaveProTest.checkBridge()              — Bridge only');
console.log('   SaveProTest.checkSSL()                 — SSL only');
console.log('');
