import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Jilola | Innovatsion G'oyalar Platformasi",
  description:
    "Magistrlik dissertatsiyasi doirasida talabalarning innovatsion faoliyatini rivojlantiradigan interaktiv platforma. SMART mezonlari asosida g'oyalarni tekshiring, AI tahlil qilsin va hamjamiyatdan boyiting.",
  keywords: "innovatsiya, SMART, ta'lim, dissertatsiya, pedagogika, AI, talabalar",
  authors: [{ name: "Primova Durdona" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jilola",
  },
  openGraph: {
    title: "Jilola – Innovatsion G'oyalar Platformasi",
    description: "Talabalar innovatsion g'oyalar platformasi",
    type: "website",
    url: "https://jilola.uz",
  },
};

export const viewport: Viewport = {
  themeColor: "#ea4c89",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <div className="bg-mesh" />
        <div className="bg-grid" />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(15, 35, 71, 0.95)",
              color: "#f0f4ff",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: "12px",
              fontSize: "14px",
              maxWidth: "90vw",
            },
            success: { iconTheme: { primary: "#00c896", secondary: "#0a1628" } },
            error: { iconTheme: { primary: "#f43f5e", secondary: "#0a1628" } },
          }}
        />
      </body>
    </html>
  );
}
