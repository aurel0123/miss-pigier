import type { Metadata } from "next";
import { Montserrat , Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SearchProvider } from '@/context/search-provider'

// Importer les polices avec les options souhaitées
const montserrat = Montserrat({
  subsets: ['latin'],
})

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"]
});

export const metadata: Metadata = {
  title: "MissPigier",
  description: "Application de vote en ligne MissPigier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} ${poppins.variable} antialiased`}
      >
        <SearchProvider>
          {children}
          <Toaster richColors position={'top-center'}/>
        </SearchProvider>
      </body>
    </html>
  );
}
