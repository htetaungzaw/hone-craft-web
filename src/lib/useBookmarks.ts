import { useLocalStorage } from './useLocalStorage'

export interface Bookmark {
  id: string
  title: string
  slug: string
  locale: string
}

const KEY = 'bookmarks'

export function useBookmarks(): [Map<string, Bookmark>, (bookmark: Bookmark) => void] {
  const [items, setItems] = useLocalStorage<Bookmark[]>(KEY, [])
  const map = new Map(items.map((b) => [b.id, b]))

  function toggle(bookmark: Bookmark) {
    if (map.has(bookmark.id)) {
      setItems(items.filter((b) => b.id !== bookmark.id))
    } else {
      setItems([...items, bookmark])
    }
  }

  return [map, toggle]
}
