import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { AuthModals } from "@/components/AuthModals";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileRotateHint } from "@/components/MobileRotateHint";
import { ThirdPartyScripts } from "@/components/ThirdPartyScripts";
import { Toaster } from "sonner";
import GlobalLoader from "@/components/GlobalLoader";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { PrimeReactProvider } from "primereact/api";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: {
    default: "NOVASHOP",
    template: "%s | NOVASHOP",
  },
  description:
    "Inspired by innovation and efficiency, NOVASHOP delivers smart solutions and seamless experiences to help businesses grow and serve customers better.",
  openGraph: {
    title: "NOVASHOP",
    description:
      "Inspired by innovation and efficiency, NOVASHOP delivers smart solutions and seamless experiences to help businesses grow and serve customers better.",
    url: "https://novashop.jarvistechnolabs.com/",
    siteName: "NOVASHOP",
    images: [
      {
        url: "https://novashop-827u.vercel.app/assets/images/logo.svg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "NOVASHOP",
    description:
      "Inspired by innovation and efficiency, NOVASHOP delivers smart solutions and seamless experiences to help businesses grow and serve customers better.",
    images: ["https://novashop-827u.vercel.app/assets/images/logo.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body>
        <PrimeReactProvider>
          <GlobalLoader />
          <Header />
          {children}
          <Footer />
          <MobileRotateHint />
          <AuthModals />
          <Toaster position="bottom-right" richColors />
          <ThirdPartyScripts />
        </PrimeReactProvider>
      </body>
    </html>
  );
}
