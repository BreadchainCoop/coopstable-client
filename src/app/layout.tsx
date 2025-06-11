import type { Metadata } from "next";
import { Darker_Grotesque, Lato, Radio_Canada, Radio_Canada_Big } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Providers } from "./providers";
import { Footer } from "./components/Footer";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400"],
});

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-darker-grotesque",
  subsets: ["latin"],
});

const radioCanada = Radio_Canada({
  variable: "--font-radio-canada",
  subsets: ["latin"],
});

const radioCanadaBig = Radio_Canada_Big({
  variable: "--font-radio-canada-big",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoopStable",
  description: "CoopStable is a decentralized finance platform that enables users to participate crowdstaking for publig goods funding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${darkerGrotesque.variable} ${radioCanada.variable} ${radioCanadaBig.variable} antialiased bg-theme-grey-3`}
      >
        <Providers>
          <Header />
            {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
