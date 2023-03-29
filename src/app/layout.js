import "./global.css";
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
    <html lang="en" className={`${workSansFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
