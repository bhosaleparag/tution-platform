import { Geist, Urbanist } from "next/font/google";
import "./globals.css";
import NavBar from "./components/nav/NavBar";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "./context/LoaderContext";
import { ToastProvider } from "./context/ToastProvider";
import { SoundProvider } from "./context/SoundContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export const metadata = {
  title: "Student Quiz App",
  description: "Quiz management system for schools, teachers, and students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${urbanist.variable} flex flex-col min-h-screen scrollbar-custom`}>
        <ToastProvider/>
        <LoaderProvider>
          <AuthProvider>
            <SoundProvider>
              <NavBar/>
              <main className="flex-1 h-full">{children}</main>
            </SoundProvider>
          </AuthProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
