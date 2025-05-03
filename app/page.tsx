import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import Link from "next/link"
import MovieCard from "@/components/movie-card"
import { mockMovies, mockSeries } from "@/lib/mock-data"

export default function Home() {
  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Поиск фильмов и сериалов" className="pl-9" />
        </div>
        <Button asChild>
          <Link href="/search">Найти</Link>
        </Button>
      </div>

      <Tabs defaultValue="collections">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="collections">Мои подборки</TabsTrigger>
          <TabsTrigger value="popular">Популярное</TabsTrigger>
          <TabsTrigger value="new">Новинки</TabsTrigger>
        </TabsList>
        <TabsContent value="collections" className="pt-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Мои подборки</h2>
              <Button variant="outline" asChild>
                <Link href="/collections">Все подборки</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/collections/watchlist" className="group">
                <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
                  <h3 className="font-medium">Хочу посмотреть</h3>
                  <p className="text-sm text-muted-foreground">12 фильмов и сериалов</p>
                </div>
              </Link>
              <Link href="/collections/favorites" className="group">
                <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
                  <h3 className="font-medium">Избранное</h3>
                  <p className="text-sm text-muted-foreground">8 фильмов и сериалов</p>
                </div>
              </Link>
              <Link href="/collections/new" className="group">
                <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground transition-colors hover:bg-accent">
                  <p>+ Создать новую подборку</p>
                </div>
              </Link>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="popular" className="pt-4">
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Популярное</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {mockMovies.slice(0, 4).map((movie) => (
                <MovieCard key={movie.id} item={movie} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="new" className="pt-4">
          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Новинки</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {mockSeries.slice(0, 4).map((series) => (
                <MovieCard key={series.id} item={series} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

