import "./global.css";
import { Providers } from "./providers";
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
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${workSansFont.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
