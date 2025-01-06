import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/ReduxProvider";

export const metadata: Metadata = {
  title: "ToDo List",
  description: "ToDo List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
