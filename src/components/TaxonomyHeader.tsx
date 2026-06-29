import type { LucideIcon } from 'lucide-react'

export function TaxonomyHeader({
  icon: Icon,
  label,
  title,
  description,
}: {
  icon: LucideIcon
  label: string
  title: string
  description?: string
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-0 -z-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,_var(--secondary)_0%,_transparent_70%)] opacity-60 dark:opacity-20"
      />
      <div className="bg-secondary text-secondary-foreground mt-6 flex h-10 w-10 items-center justify-center rounded-lg">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-muted-foreground mt-3 text-sm font-medium uppercase tracking-widest">
        {label}
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {description && <p className="text-muted-foreground mt-3 text-lg">{description}</p>}
    </div>
  )
}
