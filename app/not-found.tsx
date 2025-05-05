import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center py-20">
      <FileQuestion className="h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold mb-2">404 - Страница не найдена</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Извините, запрашиваемая страница не существует или была перемещена.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Вернуться на главную</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Поиск фильмов</Link>
        </Button>
      </div>
    </div>
  )
}
