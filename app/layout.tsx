import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { MiniKitProvider } from "@worldcoin/minikit-js/minikit-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Character Chat",
  description: "Chat with AI characters with unique personalities",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <MiniKitProvider>
        <body className={`${inter.className} h-full overflow-hidden`}>
          {children}
          <Toaster />
        </body>
      </MiniKitProvider>
    </html>
  )
}
