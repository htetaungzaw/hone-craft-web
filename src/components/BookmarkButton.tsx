import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from './ui/button'

interface Props {
  bookmarked: boolean
  onToggle: () => void
}

export function BookmarkButton({ bookmarked, onToggle }: Props) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this article'}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this article'}
      className="rounded-full"
    >
      {bookmarked ? (
        <BookmarkCheck className="text-primary size-4" />
      ) : (
        <Bookmark className="size-4" />
      )}
    </Button>
  )
}
