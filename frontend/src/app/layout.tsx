import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raithu Alert | Kadlur Village Weather & Rain Monitoring",
  description:
    "Dedicated mobile-first weather monitoring and Doppler radar rainfall detection exclusively for Kadlur Village, Raichur District, Karnataka, India.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Raithu Alert",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  keywords: [
    "Kadlur weather",
    "Raichur Karnataka rain",
    "Raithu Alert",
    "Kadlur Doppler radar",
    "farmer weather alert",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#065f46",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-100 antialiased">
      <body className="min-h-full flex flex-col text-slate-800 bg-slate-100">
        {children}
      </body>
    </html>
  );
}
