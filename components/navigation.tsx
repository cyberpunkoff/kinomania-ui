"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Film, Home, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

const routes = [
  {
    href: "/",
    label: "Главная",
    icon: Home,
  },
  {
    href: "/search",
    label: "Поиск",
    icon: Search,
  },
  {
    href: "/collections",
    label: "Подборки",
    icon: Film,
  }
]

export default function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isMobile = useMobile()

  const NavItems = () => (
    <>
      {routes.map((route) => (
        <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
          <Button
            variant={pathname === route.href ? "default" : "ghost"}
            className={cn("flex items-center gap-2", isMobile && "w-full justify-start")}
          >
            <route.icon className="h-4 w-4" />
            <span>{route.label}</span>
          </Button>
        </Link>
      ))}
    </>
  )

  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-4">
                <Home className="h-4 w-4" />
                <span className="sr-only">Меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-4 pt-10">
              <NavItems />
              <Link href="/profile" onClick={() => setOpen(false)}>
                <Button variant={pathname === "/profile" ? "default" : "ghost"} className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  <span>Профиль</span>
                </Button>
              </Link>
              <div className="mt-auto">
                <ModeToggle />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1 text-center font-semibold">Киномания</div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <User className="h-4 w-4" />
                <span className="sr-only">Профиль</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Film className="h-6 w-6" />
          <span className="font-bold">Киномания</span>
        </Link>
        <nav className="flex flex-1 items-center gap-2">
          <NavItems />
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <User className="h-4 w-4" />
              <span className="sr-only">Профиль</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
