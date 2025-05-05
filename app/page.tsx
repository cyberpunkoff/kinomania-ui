import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import Link from "next/link"
import CollectionsList from "@/components/collections-list"
import PopularMediaList from "@/components/popular-media-list"
import NewMediaList from "@/components/new-media-list"

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
          <CollectionsList />
        </TabsContent>
        <TabsContent value="popular" className="pt-4">
          <PopularMediaList />
        </TabsContent>
        <TabsContent value="new" className="pt-4">
          <NewMediaList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
