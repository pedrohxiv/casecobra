import type { Metadata } from "next";
import { Recursive } from "next/font/google";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

const font = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "casecobra",
  icons: { icon: "/snake-1.png" },
};

interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <html>
      <body className={font.className}>
        <Navbar />
        <main className="flex flex-col min-h-[calc(100vh-3.5rem-1px)]">
          <div className="flex-1 flex flex-col h-full">
            <Providers>{children}</Providers>
          </div>
          <Footer />
        </main>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
