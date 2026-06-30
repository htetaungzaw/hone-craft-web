import { useLocalStorage } from './useLocalStorage'

const KEY = 'read-articles'

export function useReadArticles(): [Set<string>, (id: string) => void] {
  const [ids, setIds] = useLocalStorage<string[]>(KEY, [])
  const set = new Set(ids)

  function markRead(id: string) {
    if (!set.has(id)) setIds([...ids, id])
  }

  return [set, markRead]
}
