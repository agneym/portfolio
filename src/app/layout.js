import "./global.css";
import { Providers } from "./providers";
import "@agney/skip-nav/styles.css";
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
  colorScheme: "dark",
  creator: "Agney",
  metadataBase: new URL("https://agney.dev"),
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
      </body>
    </html>
  );
}
