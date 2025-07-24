import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "./../components/ui/sonner"
import Navbar from "@/components/Navbar";
import ReactQueryProvider from "@/contexts/ReactQueryProviderContext";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Freshers | PClub IITK",
  description: "Know your batchmates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black dark:text-white bg-white text-black`}
      >
        <ReactQueryProvider>
          <ThemeProvider>
            <AuthProvider>
              <Navbar />
              <main>

                {children}

              </main>
              <Toaster richColors toastOptions={
                {
                  classNames: {
                    // error: '!bg-red-100 !text-red-600 hover:!text-red-600',
                    success: '!bg-white dark:!bg-black !text-zinc-800 dark:!text-white'
                  }
                }
              }/>
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
