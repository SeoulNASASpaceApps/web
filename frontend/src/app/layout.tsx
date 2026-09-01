import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StyledJsxRegistry from "./registry";

const rethinkRegular = localFont({
  src: "../../public/fonts/RethinkSans-Regular.ttf",
  variable: "--font-rethink-regular",
});
const rethinkMedium = localFont({
  src: "../../public/fonts/RethinkSans-Medium.ttf",
  variable: "--font-rethink-medium",
});
const rethinkBold = localFont({
  src: "../../public/fonts/RethinkSans-Bold.ttf",
  variable: "--font-rethink-bold",
});
const rethinkExtraBold = localFont({
  src: "../../public/fonts/RethinkSans-ExtraBold.ttf",
  variable: "--font-rethink-extrabold",
});

export const metadata: Metadata = {
  title: "NASA Space Apps Seoul",
  description: "NASA Space Apps Challenge Seoul 2025",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      }
    ]
  },
  other: {
    "http-equiv": "Content-Security-Policy",
    "content": "upgrade-insecure-requests"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${rethinkRegular.variable} ${rethinkMedium.variable} ${rethinkBold.variable} ${rethinkExtraBold.variable}`}
      >
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}
