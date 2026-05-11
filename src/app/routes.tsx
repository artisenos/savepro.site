import { createBrowserRouter, Outlet } from "react-router";
import { lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { useLanguage } from "./contexts/LanguageContext";
import ScrollToHash from "./components/ScrollToHash";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router";

const Home = lazy(() => import("./pages/Home"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const DMCA = lazy(() => import("./pages/DMCA"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));

function Root() {
  const { language } = useLanguage();
  const location = useLocation();

  return (
    <div dir="ltr" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <ScrollToHash />
      <Header />
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            <Suspense fallback={
              <div className="flex flex-col justify-center items-center h-64 gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
              </div>
            }>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-of-service", Component: TermsOfService },
      { path: "dmca", Component: DMCA },
      { path: "contact", Component: Contact },
      { path: "about-us", Component: AboutUs },
      { path: "disclaimer", Component: Disclaimer },
    ],
  },
]);
