import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Store — Premium Products",
  description: "Shop premium products from the world's best brands, shipped fast to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        {children}
      </body>
    </html>
  );
}
