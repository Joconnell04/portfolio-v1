import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata = {
  title: "Jackson O’Connell",
  description:
    "4th Year CS Student at Georgia Institute of Technology. Data engineering, ML systems, and full-stack tooling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
