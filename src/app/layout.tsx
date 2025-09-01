import "./styles/globals.css";
import { Toaster } from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { poppins } from "@/fonts/poppins";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} bg-green-950`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
