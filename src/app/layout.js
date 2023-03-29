import "./global.css";
import { Providers } from "./providers";
import { Work_Sans } from "next/font/google";

const workSansFont = Work_Sans({
  variable: "--font-heading",
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Agney's Portfolio",
  description: "A portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${workSansFont.variable} h-full`}
      suppressContentEditableWarning
    >
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
