import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { getDict } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Brunes — Albania's Premier Real Estate Platform",
  description:
    "Discover your dream home across Albania. Villas, apartments, offices and land. 8500+ curated listings from 440+ agents.",
  openGraph: {
    title: "Brunes Real Estate",
    description: "Find your dream property in Albania",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { dict, locale } = await getDict();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider>
          <Navbar dict={dict} locale={locale} />
          <main>{children}</main>
          <Footer dict={dict} />
        </ThemeProvider>
      </body>
    </html>
  );
}
