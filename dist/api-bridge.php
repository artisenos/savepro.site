<?php
/**
 * SavePro API Bridge — Secure proxy for RapidAPI TikTok Download
 *
 * Modes:
 *   POST  /api-bridge.php              → fetch video metadata (JSON)
 *   GET   /api-bridge.php?action=download&url=<encoded_media_url>&type=video|music
 *                                       → stream the media file as a forced download
 */

// ==========================================
// 0. ERROR LOGGING HELPER
// ==========================================
function logError($context, $message, $extra = []) {
    $logFile = __DIR__ . '/api-bridge-errors.log';
    $entry = [
        'timestamp' => date('c'),
        'context'   => $context,
        'message'   => $message,
    ];
    if (!empty($extra)) {
        $entry['extra'] = $extra;
    }
    file_put_contents($logFile, json_encode($entry, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
}

// ==========================================
// 1. SECURITY & CORS HEADERS
// ==========================================
$allowedOrigins = [
    'https://savepro.site',
    'https://www.savepro.site',
    'http://localhost:5173',   // Vite dev server
    'http://localhost:4173',   // Vite preview
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    // Default to production domain
    header("Access-Control-Allow-Origin: https://savepro.site");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: strict-origin-when-cross-origin");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// ==========================================
// 2. RAPIDAPI CREDENTIALS
// ==========================================
$rapidApiKey  = "8305453914mshab630f856cb4354p12b919jsn1bcb5971ff8d";
$rapidApiHost = "tiktok-video-no-watermark2.p.rapidapi.com";

// ==========================================
// 3. ROUTE: DOWNLOAD PROXY (two-phase: fetch → validate → serve)
//    GET /api-bridge.php?action=download&url=<media_url>&type=video|music
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'download') {

    if (!isset($_GET['url']) || empty($_GET['url'])) {
        http_response_code(400);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["code" => -1, "msg" => "Missing 'url' parameter for download"]);
        exit();
    }

    $mediaUrl = $_GET['url'];
    $type     = isset($_GET['type']) ? $_GET['type'] : 'video';

    // Force HTTPS on media URL
    $mediaUrl = preg_replace('/^http:\/\//', 'https://', $mediaUrl);

    // Determine extension & MIME
    $ext  = ($type === 'music') ? 'mp3' : 'mp4';
    $mime = ($type === 'music') ? 'audio/mpeg' : 'video/mp4';
    $filename = "savepro-{$type}-" . time() . ".{$ext}";

    // --- Phase 1: Fetch the entire file into memory and validate ---
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $mediaUrl,
        CURLOPT_RETURNTRANSFER => true,  // fetch into $fileData
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS      => 10,
        CURLOPT_TIMEOUT        => 120,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        CURLOPT_HTTPHEADER     => [
            'Accept: */*',
            'Referer: https://www.tiktok.com/',
        ],
    ]);

    $fileData  = curl_exec($ch);
    $curlErr   = curl_error($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $fileSize  = curl_getinfo($ch, CURLINFO_SIZE_DOWNLOAD);
    curl_close($ch);

    // Validate the fetched data
    if ($curlErr) {
        http_response_code(502);
        header("Content-Type: application/json; charset=UTF-8");
        logError('download-proxy', 'cURL error fetching media', [
            'url'      => $mediaUrl,
            'curl_err' => $curlErr,
        ]);
        echo json_encode(["code" => -1, "msg" => "Failed to fetch media: " . $curlErr]);
        exit();
    }

    if ($httpCode >= 400) {
        http_response_code(502);
        header("Content-Type: application/json; charset=UTF-8");
        logError('download-proxy', 'Upstream returned error', [
            'url'       => $mediaUrl,
            'http_code' => $httpCode,
        ]);
        echo json_encode(["code" => -1, "msg" => "Media server returned HTTP {$httpCode}"]);
        exit();
    }

    if ($fileData === false || strlen($fileData) < 1000) {
        http_response_code(502);
        header("Content-Type: application/json; charset=UTF-8");
        logError('download-proxy', 'File too small or empty', [
            'url'  => $mediaUrl,
            'size' => strlen($fileData ?: ''),
        ]);
        echo json_encode(["code" => -1, "msg" => "Downloaded file is empty or too small — the link may have expired"]);
        exit();
    }

    // --- Phase 2: Serve the validated file as a forced download ---
    header("Content-Type: {$mime}");
    header("Content-Disposition: attachment; filename=\"{$filename}\"");
    header("Content-Length: " . strlen($fileData));
    header("Cache-Control: no-cache, must-revalidate");
    header("Pragma: no-cache");
    header("X-Content-Type-Options: nosniff");

    echo $fileData;
    exit();
}

// ==========================================
// 4. ROUTE: FETCH VIDEO METADATA
//    POST /api-bridge.php   body: { "url": "https://tiktok.com/..." }
// ==========================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(["code" => -1, "msg" => "Method not allowed. Use POST for metadata or GET with action=download."]);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

$inputJSON = file_get_contents('php://input');
$input     = json_decode($inputJSON, true);

if (!isset($input['url']) || empty(trim($input['url']))) {
    http_response_code(400);
    echo json_encode(["code" => -1, "msg" => "Missing or empty 'url' parameter"]);
    logError('metadata', 'Missing URL in POST body', ['raw_input' => $inputJSON]);
    exit();
}

$tiktokUrl = trim($input['url']);

// Basic URL validation
if (strpos($tiktokUrl, 'tiktok.com') === false && strpos($tiktokUrl, 'tiktok') === false) {
    http_response_code(400);
    echo json_encode(["code" => -1, "msg" => "Invalid TikTok URL"]);
    logError('metadata', 'Invalid TikTok URL submitted', ['url' => $tiktokUrl]);
    exit();
}

// ==========================================
// 5. CALL RAPIDAPI
// ==========================================
$apiUrl = "https://" . $rapidApiHost . "/?url=" . urlencode($tiktokUrl) . "&hd=1";

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL            => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING       => "",
    CURLOPT_MAXREDIRS      => 10,
    CURLOPT_TIMEOUT        => 14,
    CURLOPT_HTTP_VERSION   => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST  => "GET",
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_HTTPHEADER     => [
        "x-rapidapi-host: " . $rapidApiHost,
        "x-rapidapi-key: "  . $rapidApiKey,
    ],
]);

$response = curl_exec($curl);
$curlErr  = curl_error($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

// ==========================================
// 6. HANDLE CURL ERRORS
// ==========================================
if ($curlErr) {
    http_response_code(502);
    logError('rapidapi', 'cURL error calling RapidAPI', [
        'curl_error' => $curlErr,
        'http_code'  => $httpCode,
        'api_url'    => $apiUrl,
    ]);
    echo json_encode(["code" => -1, "msg" => "Connection error: " . $curlErr]);
    exit();
}

if ($httpCode >= 400) {
    http_response_code(502);
    logError('rapidapi', 'RapidAPI returned error HTTP code', [
        'http_code' => $httpCode,
        'response'  => substr($response, 0, 500),
        'api_url'   => $apiUrl,
    ]);
    echo json_encode(["code" => -1, "msg" => "API returned HTTP {$httpCode}. Check your API key and quota."]);
    exit();
}

// ==========================================
// 7. PARSE & VALIDATE API RESPONSE
// ==========================================
$decoded = json_decode($response, true);

if ($decoded === null) {
    http_response_code(502);
    logError('rapidapi', 'Failed to parse JSON response', [
        'raw_response' => substr($response, 0, 1000),
    ]);
    echo json_encode(["code" => -1, "msg" => "Invalid response from video API"]);
    exit();
}

// Check API-level error code
if (isset($decoded['code']) && $decoded['code'] !== 0) {
    http_response_code(502);
    logError('rapidapi', 'API returned error code', [
        'code' => $decoded['code'],
        'msg'  => isset($decoded['msg']) ? $decoded['msg'] : 'unknown',
    ]);
    echo json_encode([
        "code" => $decoded['code'],
        "msg"  => isset($decoded['msg']) ? $decoded['msg'] : "Video not found or unavailable",
    ]);
    exit();
}

// ==========================================
// 8. NORMALIZE & RETURN CLEAN RESPONSE
// ==========================================
$data = isset($decoded['data']) ? $decoded['data'] : null;

if (!$data) {
    http_response_code(502);
    logError('rapidapi', 'API response missing data field', [
        'response_keys' => array_keys($decoded),
    ]);
    echo json_encode(["code" => -1, "msg" => "No video data returned"]);
    exit();
}

// Helper: force https on any URL
function forceHttps($url) {
    if (empty($url)) return $url;
    return preg_replace('/^http:\/\//', 'https://', $url);
}

// Build a clean, predictable response
http_response_code(200);
$cleanData = [
    "title"    => isset($data['title'])             ? $data['title'] : "TikTok Video",
    "author"   => isset($data['author']['nickname']) ? $data['author']['nickname']
                : (isset($data['author'])            ? $data['author'] : "TikTok User"),
    "cover"    => forceHttps(isset($data['cover'])   ? $data['cover'] : ""),
    "hdplay"   => forceHttps(isset($data['hdplay'])  ? $data['hdplay'] : ""),
    "play"     => forceHttps(isset($data['play'])    ? $data['play']   : ""),
    "wmplay"   => forceHttps(isset($data['wmplay'])  ? $data['wmplay'] : ""),
    "music"    => forceHttps(isset($data['music'])   ? $data['music']  : ""),
    "duration" => isset($data['duration'])           ? $data['duration'] : 0,
];

echo json_encode([
    "code" => 0,
    "msg"  => "success",
    "data" => $cleanData,
]);
?>
