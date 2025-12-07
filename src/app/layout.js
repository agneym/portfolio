import "./global.css";
import { Providers } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Work_Sans } from "next/font/google";

const workSansFont = Work_Sans({
  variable: "--font-heading",
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Portfolio | Agney",
  description: "A portfolio for Web Developer - Agney Menon",
  keywords: ["Frontend Developer", "Developer", "Engineer", "Portfolio"],
  creator: "Agney",
  metadataBase: new URL("https://agney.dev"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${workSansFont.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="h-full bg-slate-50 selection:bg-indigo-100 dark:bg-slate-800 dark:selection:bg-indigo-600">
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
