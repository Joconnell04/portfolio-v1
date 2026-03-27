import "./globals.css";

export const metadata = {
  title: "Jackson O’Connell | Portfolio",
  description: "Minimal, content-forward portfolio built with Next.js 15.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
