"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers"
import { useCollections } from "@/lib/collections-context"
import type { MediaItem } from "@/lib/types"
import SortableMovieListItem from "./sortable-movie-list-item"

interface DraggableMovieListProps {
  collectionId: string
  items: MediaItem[]
}

export default function DraggableMovieList({ collectionId, items }: DraggableMovieListProps) {
  const { reorderCollectionItems } = useCollections()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      reorderCollectionItems(collectionId, oldIndex, newIndex)
    }

    setActiveId(null)
  }

  const handleDragStart = (event: { active: { id: string } }) => {
    setActiveId(event.active.id)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4">
          {items.map((item, index) => (
            <SortableMovieListItem key={item.id} item={item} index={index + 1} isActive={activeId === item.id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

