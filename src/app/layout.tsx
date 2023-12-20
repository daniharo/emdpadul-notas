import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EMDPadul - Notas",
  description: "Notas de alumnos de la Escuela de Música y Danza de Padul",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`flex flex-col min-h-screen ${inter.className}`}>
        <header className="pt-4 w-full flex justify-center">
          <Link href="/">
            <Image
              src="/sansebastian-blanco.png"
              alt="EMDPadul"
              width={200}
              height={200}
              className="print:invert"
            />
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
