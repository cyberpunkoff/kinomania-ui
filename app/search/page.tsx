"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import MovieCard from "@/components/movie-card"
import { mockMovies, mockSeries } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

const allMedia = [...mockMovies, ...mockSeries]

const genres = ["Фантастика", "Приключения", "Драма", "Боевик", "Комедия", "Фэнтези", "История", "Биография", "Ужасы"]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [yearRange, setYearRange] = useState([2000, 2024])
  const [ratingRange, setRatingRange] = useState([0, 10])
  const [mediaType, setMediaType] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    } else {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  const resetFilters = () => {
    setSelectedGenres([])
    setYearRange([2000, 2024])
    setRatingRange([0, 10])
    setMediaType("all")
  }

  const filteredMedia = allMedia.filter((item) => {
    // Search query filter
    const matchesSearch = searchQuery === "" || item.title.toLowerCase().includes(searchQuery.toLowerCase())

    // Genre filter
    const matchesGenre = selectedGenres.length === 0 || item.genres.some((genre) => selectedGenres.includes(genre))

    // Year filter
    const matchesYear = item.year >= yearRange[0] && item.year <= yearRange[1]

    // Rating filter
    const matchesRating = item.rating >= ratingRange[0] && item.rating <= ratingRange[1]

    // Media type filter
    const matchesType =
      mediaType === "all" ||
      (mediaType === "movie" && item.type === "movie") ||
      (mediaType === "series" && item.type === "series")

    return matchesSearch && matchesGenre && matchesYear && matchesRating && matchesType
  })

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск фильмов и сериалов"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          Фильтры
        </Button>
      </div>

      {showFilters && (
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Фильтры</h2>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Тип</label>
              <Select value={mediaType} onValueChange={setMediaType}>
                <SelectTrigger>
                  <SelectValue placeholder="Все типы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="movie">Фильмы</SelectItem>
                  <SelectItem value="series">Сериалы</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Год выпуска</label>
              <div className="pt-6 px-2">
                <Slider
                  defaultValue={yearRange}
                  min={1900}
                  max={2024}
                  step={1}
                  value={yearRange}
                  onValueChange={setYearRange}
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Рейтинг</label>
            <div className="pt-6 px-2">
              <Slider
                defaultValue={ratingRange}
                min={0}
                max={10}
                step={0.1}
                value={ratingRange}
                onValueChange={setRatingRange}
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>{ratingRange[0].toFixed(1)}</span>
                <span>{ratingRange[1].toFixed(1)}</span>
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible defaultValue="genres">
            <AccordionItem value="genres">
              <AccordionTrigger>Жанры</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Результаты поиска</h2>
          <p className="text-sm text-muted-foreground">Найдено: {filteredMedia.length}</p>
        </div>

        {filteredMedia.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredMedia.map((item) => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
