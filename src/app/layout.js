// app/layout.js
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Fixture App",
  description: "Upload and search fixtures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <header className="p-4 bg-white shadow">
          <h1 className="text-2xl font-bold">OA</h1>
          <nav className="mt-2 space-x-4">
            <Link href="/" className="hover:underline">
              Upload
            </Link>
            <Link href="/search" className="hover:underline">
              Search
            </Link>
          </nav>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
