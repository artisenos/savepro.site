import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
}

export default function SEO({ title, description }: SEOProps) {
  useEffect(() => {
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
          "description": description || "Download TikTok videos without watermark for free.",
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
        }
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [description]);

  return null;
}
