import { useEffect } from "react";
import { useLocation } from "react-router";
import { languages } from "../config/LanguageConfig";

interface SEOProps {
  title?: string;
  description?: string;
}

export default function SEO({ title, description }: SEOProps) {
  const location = useLocation();
  const finalTitle = title || "SavePro | Download TikTok Without Watermark - Instant HD [2026]";
  const finalDescription = description || "1-Click TikTok downloader. Save videos in Ultra-HD without watermark instantly. Free forever, no registration. Try the fastest tool now!";

  useEffect(() => {
    // 1. Update document title and meta description
    document.title = finalTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", finalDescription);
    }

    // 2. Manage Canonical Tag
    const canonicalUrl = `https://savepro.site${location.pathname === "/" ? "" : location.pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 3. Manage Hreflang Tags
    const hreflangLinks: HTMLLinkElement[] = [];
    languages.forEach((lang) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", lang.code);
      link.setAttribute("href", canonicalUrl); // In this implementation, same URL handles multiple languages via context
      document.head.appendChild(link);
      hreflangLinks.push(link);
    });

    // Add x-default
    const xDefault = document.createElement("link");
    xDefault.setAttribute("rel", "alternate");
    xDefault.setAttribute("hreflang", "x-default");
    xDefault.setAttribute("href", canonicalUrl);
    document.head.appendChild(xDefault);
    hreflangLinks.push(xDefault);

    // 4. Inject JSON-LD
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://savepro.site/#organization",
          "name": "SavePro",
          "url": "https://savepro.site",
          "logo": {
            "@type": "ImageObject",
            "url": "https://savepro.site/favicon-512x512.png"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "support@savepro.site",
            "contactType": "customer support"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://savepro.site/#website",
          "url": "https://savepro.site",
          "name": "SavePro - Premium Video Downloader",
          "description": finalDescription,
          "publisher": {
            "@id": "https://savepro.site/#organization"
          }
        },
        {
          "@type": "SoftwareApplication",
          "name": "SavePro TikTok Downloader",
          "operatingSystem": "Windows, macOS, Android, iOS",
          "applicationCategory": "UtilitiesApplication",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "12450"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      ]
    };

    const script = document.createElement("script");
    script.id = "json-ld-seo";
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("json-ld-seo");
      if (existingScript) document.head.removeChild(existingScript);
      hreflangLinks.forEach(link => {
        if (link.parentNode) document.head.removeChild(link);
      });
    };
  }, [finalTitle, finalDescription, location.pathname]);

  return null;
}
