import type { Metadata } from "next";
import { Montserrat , Poppins } from "next/font/google";
import "./globals.css";


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
  title: "Mon App Next.js",
  description: "Une application avec Montserrat et Poppins",
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
        {children}
      </body>
    </html>
  );
}
