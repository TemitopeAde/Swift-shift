import Header from "@/components/Header";
import React from "react";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
        {children}
    </main>
  );
}
