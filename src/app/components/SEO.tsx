import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
}

export default function SEO({ title, description }: SEOProps) {
  const finalTitle = title || "SavePro | Download TikTok Without Watermark - Instant HD [2026]";
  const finalDescription = description || "1-Click TikTok downloader. Save videos in Ultra-HD without watermark instantly. Free forever, no registration. Try the fastest tool now!";

  useEffect(() => {
    // Update document title and meta description
    document.title = finalTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", finalDescription);
    }

    // Inject JSON-LD
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
            "url": "https://savepro.site/logo.png"
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
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://savepro.site/?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
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
        },
        {
          "@type": "WebApplication",
          "name": "SavePro Online TikTok Downloader",
          "url": "https://savepro.site",
          "description": "Premium online tool to download TikTok videos without watermark in high quality.",
          "applicationCategory": "MultimediaApplication",
          "browserRequirements": "Requires JavaScript and HTML5",
          "permissions": "None",
          "isAccessibleForFree": true
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
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [finalTitle, finalDescription]);

  return null;
}
