import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { connection } from "next/server";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secure Todo App",
  description: "A secure, beautiful todo application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen`}>
        <Providers session={session}>
          <Navbar />
          <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 mt-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
