import { createBrowserRouter, Outlet } from "react-router";
import { lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { useLanguage } from "./contexts/LanguageContext";

const Home = lazy(() => import("./pages/Home"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const DMCA = lazy(() => import("./pages/DMCA"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));

function Root() {
  const { language } = useLanguage();
  return (
    <div dir="ltr" className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <Header />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
          <Outlet />
        </Suspense>
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
