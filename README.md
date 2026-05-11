# 🚀 SavePro v2.1.0 — Premium TikTok Video Downloader

![SavePro](https://img.shields.io/badge/SavePro-v2.1.0-cyan?style=for-the-badge&logo=tiktok)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![PHP](https://img.shields.io/badge/PHP_Bridge-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)

**SavePro** is a production-ready web application for downloading TikTok videos without watermarks and extracting MP3 audio. Built with React + Vite + TypeScript, styled with Tailwind CSS, and backed by a secure PHP API bridge with RapidAPI integration.

---

## ✨ Key Features

- 🎥 **No Watermark HD Downloads** — Direct Blob-based downloads via PHP proxy, bypassing CORS restrictions
- 🎵 **MP3 Extraction** — High-quality audio download from any TikTok video
- 🌍 **10-Language Support** — Arabic, English, Spanish, French, German, Turkish, Chinese, Russian, Hindi, Portuguese
- 🎨 **Neon Dark Theme** — Cyan/Purple gradient branding with Glassmorphism UI
- 🌐 **Apache/PHP Hosting** — Production-ready `.htaccess` SPA fallback, no Vercel dependency
- 🔒 **Tight Coupling Prevention** — Synchronized timeouts (14s PHP → 15s Frontend), semantic HTTP status codes, zero-leak output

---

## 🛠️ Architecture v2.1.0

```
┌─────────────────────────────────────────────────┐
│                  Browser (React SPA)              │
│  ┌───────────────────────────────────────────┐   │
│  │  DownloadForm.tsx  │  Home.tsx             │   │
│  │  ┌───────────────┐ │  ┌─────────────────┐ │   │
│  │  │ POST metadata │ │  │ Download from    │ │   │
│  │  │ → {url}       │ │  │ history via PHP  │ │   │
│  │  └──────┬────────┘ │  │ bridge proxy     │ │   │
│  └─────────┼──────────┘  └────────┬──────────┘   │
└────────────┼──────────────────────┼──────────────┘
             │ POST /api-bridge.php  │ GET ?action=download
             ▼                      ▼
┌─────────────────────────────────────────────────┐
│           PHP Bridge (api-bridge.php)             │
│  ┌───────────────────────────────────────────┐   │
│  │ Validates URL → Calls RapidAPI            │   │
│  │ Returns {code, msg, data} JSON            │   │
│  │ HTTP 200/400/405/502 with proper headers  │   │
│  └───────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────┘
                     │ RapidAPI GET
                     ▼
┌─────────────────────────────────────────────────┐
│        RapidAPI (tiktok-video-no-watermark2)      │
└─────────────────────────────────────────────────┘
```

### Key Technical Details

| Layer | Detail |
|-------|--------|
| **Frontend** | React 18, Vite 6, TypeScript, Tailwind CSS v4, framer-motion, sonner |
| **API Bridge** | PHP 8.x, cURL, RapidAPI (`x-rapidapi-key`) |
| **Timeout Sync** | Backend `CURLOPT_TIMEOUT=14s` < Frontend `AbortController=15s` |
| **Download Flow** | `fetch(PHP proxy)` → Blob → `URL.createObjectURL` → hidden `<a>` click |
| **Error Status** | 400 bad request, 405 wrong method, 502 upstream failure, 200 explicit success |
| **Toast Strategy** | Sonner with `id` deduplication prevents overlapping error messages |
| **Hosting** | Apache with `.htaccess` SPA rewrite; PHP serves `/api-bridge.php` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- PHP 8.x (for local API bridge testing)

### Installation

```bash
git clone https://github.com/your-username/savepro.git
cd savepro
npm install
```

### Running Locally

You need **two terminals**:

**Terminal 1** — PHP API bridge:
```bash
php -S localhost:3001 -t public
```

**Terminal 2** — Vite dev server:
```bash
npm run dev
```

The Vite proxy (`vite.config.ts`) forwards `/api-bridge.php` to `localhost:3001`.

### Production Build

```bash
npm run build
```

Upload the `dist/` folder and `public/api-bridge.php` to your Apache/PHP hosting.

---

## 📂 Project Structure

```
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── DownloadForm.tsx    # Core download UI, Blob download logic
│   │   │   ├── Header.tsx          # Logo + navigation
│   │   │   └── Footer.tsx          # Links + branding
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Main page with history
│   │   │   ├── TermsOfService.tsx
│   │   │   ├── PrivacyPolicy.tsx
│   │   │   ├── DMCA.tsx
│   │   │   └── Contact.tsx
│   │   ├── config/
│   │   │   └── LanguageConfig.ts   # 10-language translations
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx  # Language switching context
│   │   └── routes.tsx              # React Router config
│   └── styles/
│       ├── index.css
│       ├── tailwind.css            # Custom spinner + utilities
│       ├── fonts.css               # Tajawal font import
│       └── theme.css               # Dark/light vars
├── public/
│   ├── api-bridge.php              # 🔧 PHP backend (RapidAPI proxy)
│   ├── index.html                  # Root HTML with SEO + OG tags
│   ├── site.webmanifest
│   ├── favicon.ico / .png set
│   ├── apple-touch-icon.png
│   ├── logo.svg
│   └── og-preview.png
├── scripts/
│   └── generate-icons.mjs          # Favicon/OG generator via sharp
├── vite.config.ts
└── package.json
```

---

## 🌐 API Contract

### POST `/api-bridge.php`

Request:
```json
{ "url": "https://www.tiktok.com/@user/video/123456789" }
```

Success Response `HTTP 200`:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "title": "Video title",
    "author": "@username",
    "cover": "https://...",
    "hdplay": "https://...",
    "play": "https://...",
    "wmplay": "https://...",
    "music": "https://...",
    "duration": 30
  }
}
```

Error Response `HTTP 400/502`:
```json
{ "code": -1, "msg": "وصف الخطأ بالعربية" }
```

### GET `/api-bridge.php?action=download&url=...&type=video|music`
Proxies and serves the binary media file as a forced download. Returns `HTTP 200` with `Content-Type: video/mp4` or `HTTP 502` with JSON error.

---

## 🧪 Error Handling Matrix

| Scenario | HTTP Status | Toast ID | User Message |
|----------|-------------|----------|-------------|
| Invalid/empty URL input | Client-side | `empty-input` | الرجاء إدخال رابط تيك توك أولاً |
| Server 4xx/5xx | 400/405/502 | `api-error` | فشل الاتصال بالخادم (502) |
| Network failure | `TypeError` | `api-error` | تحقق من اتصالك بالإنترنت |
| Request timeout | `AbortError` | `api-error` | انتهت مهلة الطلب |
| Invalid JSON from server | Parse error | `api-error` | استجابة غير صالحة من الخادم |
| API-level error (code ≠ 0) | 502 | `api-error` | (message from API) |
| Download CORS/network fail | `TypeError` | `dl-{type}-error` | تعذر تحميل الفيديو: تحقق من اتصالك |
| Download success | 200 | `dl-{type}-success` | تم بدء تحميل الفيديو |

---

## 🧩 Badges (Outdated — preserved for reference)

The badge line for Vercel Serverless and Framer Motion are kept for reference. Current architecture uses PHP Bridge instead of Vercel, and framer-motion is scoped to page transitions only (removed from download section for CLS stability).

---

## 📝 License

This project is for educational and personal use. Please respect TikTok's Terms of Service and content creators' copyrights. Not affiliated with TikTok or ByteDance.

*Crafted with ❤️ by the SavePro Team.*
