import type { Metadata } from "next";
import { Recursive } from "next/font/google";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "@/styles/globals.css";

const font = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "casecobra",
};

interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <html>
      <body className={font.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
