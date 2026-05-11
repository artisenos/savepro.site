import { Toaster as Sonner, ToasterProps } from "sonner";
import { useTheme } from "../ThemeProvider";
import { useLanguage } from "../../contexts/LanguageContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();
  const { language } = useLanguage();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      dir="ltr"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
