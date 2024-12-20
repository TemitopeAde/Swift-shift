import type { Metadata } from "next";
import "./globals.css";
import { titilium } from "@/lib/font";
import { ThemeProvider } from "@/components/ThemeProvider";
import ReactQueryProviders from "@/lib/QueryClient";
import Template from "./template";

export const metadata: Metadata = {
  title: "Swift Shift",
  description: "Swap your crypto asset at a lightning speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${titilium.className}`}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <ReactQueryProviders>
                  <Template>
                  {children}
                  </Template>
                  
                
              </ReactQueryProviders>
          </ThemeProvider> 
          
        
      </body>
    </html>
  );
}
