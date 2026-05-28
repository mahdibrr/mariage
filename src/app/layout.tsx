import type { Metadata, Viewport } from "next";
import { Amiri, Cairo } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
  display: "swap",
});

const cairo = Cairo({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "حفل زفاف | معرض الصور",
  description: "شاركوا لحظاتكم الجميلة من حفل الزفاف",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "حفل الزفاف",
  },
  openGraph: {
    title: "حفل زفاف | معرض الصور",
    description: "شاركوا لحظاتكم الجميلة من حفل الزفاف",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1a1610",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${amiri.variable} ${cairo.variable}`}
    >
      <body className="min-h-dvh bg-dark text-gold-100 antialiased">
        {children}
      </body>
    </html>
  );
}
