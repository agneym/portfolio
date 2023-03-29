import "./global.css";

export const metadata = {
  title: "Portfolio",
  description: "A portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
