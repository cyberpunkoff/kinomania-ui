import type { Collection, MediaItem, Notification } from "./types"

export const mockMovies: MediaItem[] = [
  {
    id: "movie-1",
    title: "Дюна: Часть вторая",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2024,
    rating: 8.5,
    type: "movie",
    genres: ["Фантастика", "Приключения", "Драма"],
    description: "Пол Атрейдес объединяется с Чани и фрименами, чтобы отомстить заговорщикам, уничтожившим его семью.",
  },
  {
    id: "movie-2",
    title: "Оппенгеймер",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2023,
    rating: 8.4,
    type: "movie",
    genres: ["Биография", "Драма", "История"],
    description:
      "История жизни американского физика-теоретика Роберта Оппенгеймера, который во время Второй мировой войны руководил Манхэттенским проектом.",
  },
  {
    id: "movie-3",
    title: "Бедные-несчастные",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2023,
    rating: 7.6,
    type: "movie",
    genres: ["Комедия", "Драма", "Фэнтези"],
    description:
      "Молодая женщина, воскрешенная хирургом-экспериментатором, сбегает с ним и отправляется в приключение по Европе.",
  },
  {
    id: "movie-4",
    title: "Зона интересов",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2023,
    rating: 7.8,
    type: "movie",
    genres: ["Драма", "История", "Военный"],
    description:
      "История коменданта Освенцима Рудольфа Хёсса и его семьи, которые пытаются построить идиллическую жизнь в доме рядом с концлагерем.",
  },
  {
    id: "movie-5",
    title: "Гладиатор 2",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2024,
    rating: 0,
    type: "movie",
    genres: ["Боевик", "Драма", "История"],
    description:
      "Продолжение истории о Древнем Риме, действие которого происходит спустя годы после событий первого фильма.",
  },
  {
    id: "movie-6",
    title: "Фуриоса: Сага Безумного Макса",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2024,
    rating: 0,
    type: "movie",
    genres: ["Боевик", "Приключения", "Фантастика"],
    description: "История происхождения воительницы Фуриосы до встречи с Максом Рокатански.",
  },
]

export const mockSeries: MediaItem[] = [
  {
    id: "series-1",
    title: "Шоураннер",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2024,
    rating: 7.9,
    type: "series",
    genres: ["Комедия", "Драма"],
    description:
      "Молодой сценарист получает шанс создать собственный сериал, но сталкивается с множеством проблем в мире телевидения.",
  },
  {
    id: "series-2",
    title: "Дом Дракона",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2022,
    rating: 8.3,
    type: "series",
    genres: ["Фэнтези", "Драма", "Приключения"],
    description:
      "Приквел «Игры престолов», рассказывающий о доме Таргариенов за 200 лет до событий оригинального сериала.",
  },
  {
    id: "series-3",
    title: "Властелин колец: Кольца власти",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2022,
    rating: 7.0,
    type: "series",
    genres: ["Фэнтези", "Драма", "Приключения"],
    description:
      "Эпическая драма, действие которой происходит за тысячи лет до событий «Хоббита» и «Властелина колец» Толкина.",
  },
  {
    id: "series-4",
    title: "Одни из нас",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2023,
    rating: 8.8,
    type: "series",
    genres: ["Драма", "Ужасы", "Постапокалипсис"],
    description: "Через 20 лет после глобальной пандемии выжившие пытаются построить новое общество.",
  },
  {
    id: "series-5",
    title: "Чёрное зеркало",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2011,
    rating: 8.7,
    type: "series",
    genres: ["Фантастика", "Триллер", "Драма"],
    description: "Антология научно-фантастических историй, исследующих тёмную сторону технологического прогресса.",
  },
  {
    id: "series-6",
    title: "Эйфория",
    poster: "/placeholder.svg?height=450&width=300",
    year: 2019,
    rating: 8.3,
    type: "series",
    genres: ["Драма"],
    description: "Группа старшеклассников исследует мир наркотиков, любви, социальных сетей и денег.",
  },
]

export const mockCollections: Collection[] = [
  {
    id: "watchlist",
    name: "Хочу посмотреть",
    count: 12,
    items: [...mockMovies.slice(0, 3), ...mockSeries.slice(0, 3)],
  },
  {
    id: "favorites",
    name: "Избранное",
    count: 8,
    items: [...mockMovies.slice(3, 5), ...mockSeries.slice(3, 5)],
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "Новый сезон",
    message: "Вышел новый сезон сериала 'Дом Дракона'",
    date: "2024-03-24",
    read: false,
    mediaId: "series-2",
  },
  {
    id: "notif-2",
    title: "Скоро в кино",
    message: "Фильм 'Гладиатор 2' выходит через 2 недели",
    date: "2024-03-20",
    read: true,
    mediaId: "movie-5",
  },
  {
    id: "notif-3",
    title: "Новая серия",
    message: "Вышла новая серия 'Эйфории'",
    date: "2024-03-15",
    read: false,
    mediaId: "series-6",
  },
]

