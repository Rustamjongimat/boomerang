import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Jilola | Innovatsion G'oyalar Platformasi",
  description:
    "Magistrlik dissertatsiyasi doirasida talabalarning innovatsion faoliyatini rivojlantiradigan interaktiv platforma. SMART mezonlari asosida g'oyalarni tekshiring, AI tahlil qilsin va hamjamiyatdan boyiting.",
  keywords: "innovatsiya, SMART, ta'lim, dissertatsiya, pedagogika, AI, talabalar",
  authors: [{ name: "Jilola Team" }],
  openGraph: {
    title: "Jilola",
    description: "Talabalar innovatsion g'oyalar platformasi",
    type: "website",
  },
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
      </head>
      <body>
        <div className="bg-mesh" />
        <div className="bg-grid" />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(15, 35, 71, 0.95)",
              color: "#f0f4ff",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#00c896", secondary: "#0a1628" },
            },
            error: {
              iconTheme: { primary: "#f43f5e", secondary: "#0a1628" },
            },
          }}
        />
      </body>
    </html>
  );
}
