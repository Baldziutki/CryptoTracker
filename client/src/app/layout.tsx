import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from '@radix-ui/themes';
import "./globals.css";
import '@radix-ui/themes/styles.css';
import './radix.css';
import { GlobalDataContextProvider } from "../utils/context/GlobalDataContext";
import Header from "@/components/header/Header";
import Navbar from "@/components/navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoTracker",
  description: "Track your cryptocurrencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>
          <GlobalDataContextProvider>
            <>
              <header className="container mx-auto 2xl:max-w-screen-xl">
                <div className=" border-b pb-5 pt-2 dark:border-b-slate-700">
                  <Header />
                </div>
                <div className=" border-b pb-5 pt-2 dark:border-b-slate-700">
                  <Navbar />
                </div>
              </header>
              {children}
            </>
          </GlobalDataContextProvider>
        </Theme>
      </body>
    </html>
  );
}
