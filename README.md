# 🚀 SavePro - Premium TikTok Video Downloader

![SavePro Banner](https://img.shields.io/badge/SavePro-TikTok_Downloader-cyan?style=for-the-badge&logo=tiktok)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer)
![Vercel Serverless](https://img.shields.io/badge/Vercel_Serverless-black?style=for-the-badge&logo=vercel)

**SavePro** is a modern, high-performance, and visually stunning web application designed to download TikTok videos without watermarks and extract MP3 audio. Built with React, Vite, and Tailwind CSS, it features a premium Glassmorphism UI, smooth Framer Motion animations, and global support for 10 languages.

---

## ✨ Key Features

- 🎥 **No Watermark Downloads**: Download TikTok videos in high definition (HD) without annoying watermarks.
- 🎵 **MP3 Extraction**: Automatically extracts and provides a high-quality MP3 download link for the video's audio.
- 🌍 **Global Multi-Language Support**: Fully translated into 10 languages (Arabic, English, Spanish, French, German, Turkish, Chinese, Russian, Hindi, Portuguese) with strict Left-to-Right (LTR) layout preservation.
- 🎨 **Premium UI/UX**: Designed with modern *Glassmorphism* (backdrop blurs, semi-transparent borders) and a sleek Neon Cyan/Purple Dark Mode theme.
- 💫 **Advanced Animations**: Powered by `framer-motion` for smooth page transitions, fade-in/slide-up elements, and interactive "glow" buttons.
- ⚡ **Zero-Config API Bridge**: Utilizes Vercel Serverless Functions (`api/download.js`) to securely proxy requests to the free TikWM API, hiding logic from the client side and bypassing CORS issues entirely.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, Vite, TypeScript
* **Styling**: Tailwind CSS v3 (Custom UI Tokens, Dark Mode)
* **Animations**: Framer Motion, Tailwind Animate
* **Icons**: Lucide React
* **Backend**: Node.js (Vercel Serverless Functions)
* **API Provider**: TikWM (Public API)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation

1. Clone the repository or extract the project bundle:
   ```bash
   git clone https://github.com/your-username/savepro.git
   cd savepro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite Development Server:
   ```bash
   npm run dev
   ```

4. *(Optional)* Testing the Serverless API locally:
   Because the API logic lives in `api/download.js`, it relies on Vercel's environment. To test the complete full-stack flow locally, use the Vercel CLI:
   ```bash
   npx vercel dev
   ```

---

## 📦 Deployment (Vercel)

SavePro is optimized for a zero-config deployment on **Vercel**. Vercel will automatically host the React frontend and map the `api/download.js` file to a serverless function endpoint (`/api/download`).

1. Push your code to a Git repository (GitHub, GitLab, or BitBucket).
2. Sign up / Log in to [Vercel](https://vercel.com).
3. Click **Add New...** > **Project** and import your repository.
4. Framework Preset will automatically be detected as **Vite**.
5. Click **Deploy**. Vercel will handle the rest!

*No environment variables are required for the default public API.*

---

## 📈 SEO & Performance

SavePro includes out-of-the-box SEO optimization:
- Properly configured `robots.txt` and `sitemap.xml`.
- Semantic HTML tags and dynamic meta descriptions.
- Highly optimized static asset serving via Vite.

---

## 📝 License

This project is for educational and personal use. Please respect TikTok's Terms of Service and content creators' copyrights when downloading videos. We are not affiliated with TikTok or ByteDance.

*Crafted with ❤️ by the SavePro Team.*
