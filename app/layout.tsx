import "./globals.css";

export const metadata = {
  title: "Jackson O\u2019Connell | Portfolio",
  description: "Hybrid repository portfolio built with Next.js 15.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
