import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { CollectionsProvider } from "@/lib/collections-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Киномания | Фильмы и сериалы",
  description: "Приложение для ведения списка фильмов и сериалов для просмотра"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CollectionsProvider>
            <div className="flex min-h-screen flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
            </div>
          <Toaster /> 
          </CollectionsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
