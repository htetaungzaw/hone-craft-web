import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Boxes, GraduationCap, Users } from 'lucide-react'
import type { Locale } from '../../../sanity/lib/locale'
import { LOCALE_LABELS, SUPPORTED_LOCALES } from '../../../sanity/lib/locale'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

export const Route = createFileRoute('/$locale/')({ component: Home })

const copy: Record<
  Locale,
  {
    heading: string
    headingAccent: string
    description: string
    availableIn: string
    browseAllArticles: string
    learningPaths: string
    facets: Array<{ title: string; desc: string }>
  }
> = {
  en: {
    heading: 'Learn to build with AI — and',
    headingAccent: 'hone your craft.',
    description:
      'A practical, multilingual guide to using AI as a developer, software engineer, and DevOps in 2026 — from your first prompt to agentic workflows.',
    availableIn: 'Available in',
    browseAllArticles: 'Browse all articles',
    learningPaths: 'Learning paths',
    facets: [
      { title: 'By level', desc: 'Beginner → professional. Climb at your own pace.' },
      { title: 'By role', desc: 'Developer, software engineer, DevOps / SRE.' },
      { title: 'By topic', desc: 'Types of AI, agentic AI, tooling, pitfalls.' },
    ],
  },
  my: {
    heading: 'AI နဲ့ တည်ဆောက်တတ်အောင် လေ့လာပြီး —',
    headingAccent: 'သင့်ကျွမ်းကျင်မှုကို မြှောက်တင်ပါ။',
    description:
      'Developer၊ Software Engineer၊ DevOps များအတွက် 2026 ခုနှစ်တွင် AI ကို လက်တွေ့အသုံးပြုနည်း — ပထမဆုံး prompt ကနေ agentic workflow အထိ, ဘာသာစကားများစွာဖြင့် လေ့လာနိုင်သော practical guide။',
    availableIn: 'ရရှိနိုင်သော ဘာသာစကားများ',
    browseAllArticles: 'ဆောင်းပါးအားလုံး ကြည့်ရှုရန်',
    learningPaths: 'သင်ယူမှု လမ်းကြောင်းများ',
    facets: [
      { title: 'အဆင့်အလိုက်', desc: 'အခြေခံမှ ကျွမ်းကျင်သူအထိ — သင့်အရှိန်နှင့် တက်လှမ်းပါ။' },
      { title: 'အလုပ်တာဝန်အလိုက်', desc: 'Developer၊ Software Engineer၊ DevOps / SRE။' },
      {
        title: 'ခေါင်းစဉ်အလိုက်',
        desc: 'AI အမျိုးအစားများ၊ Agentic AI၊ Tools များ၊ သတိပြုရမည့်အချက်များ။',
      },
    ],
  },
  ja: {
    heading: 'AIを使って構築する方法を学び、',
    headingAccent: 'スキルを磨こう。',
    description:
      '2026年、開発者・ソフトウェアエンジニア・DevOpsのためにAIを実践的に使う方法を多言語で解説するガイド — 最初のプロンプトからエージェント型ワークフローまで。',
    availableIn: '対応言語',
    browseAllArticles: 'すべての記事を見る',
    learningPaths: '学習パス',
    facets: [
      { title: 'レベル別', desc: '初級から上級まで、自分のペースで。' },
      { title: '役割別', desc: 'デベロッパー、ソフトウェアエンジニア、DevOps / SRE。' },
      { title: 'トピック別', desc: 'AIの種類、エージェント型AI、ツール、落とし穴。' },
    ],
  },
}

const facetIcons = [GraduationCap, Users, Boxes]

function Home() {
  const { locale } = Route.useParams()
  const text = copy[locale as Locale]

  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_top,_var(--secondary)_0%,_transparent_70%)] opacity-60 dark:opacity-20"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <Badge variant="secondary" className="mb-5">
          Honecraft
        </Badge>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {text.heading} <span className="text-primary">{text.headingAccent}</span>
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-balance text-lg">
          {text.description}
        </p>

        <div className="text-muted-foreground mt-6 flex items-center gap-2 text-sm">
          <span>{text.availableIn}</span>
          {SUPPORTED_LOCALES.map((loc) => (
            <Link
              key={loc}
              to="/$locale"
              params={{ locale: loc }}
              className={`rounded-full border px-2.5 py-0.5 transition ${
                loc === locale
                  ? 'border-primary text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {LOCALE_LABELS[loc]}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/$locale/browse" params={{ locale }}>
              {text.browseAllArticles}
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/$locale/paths" params={{ locale }}>
              {text.learningPaths}
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {text.facets.map(({ title, desc }, index) => {
            const Icon = facetIcons[index]
            return (
              <Link
                key={title}
                to="/$locale/browse"
                params={{ locale }}
                className="group bg-card border-border hover:border-primary/40 rounded-xl border p-5 text-left shadow-sm transition hover:shadow-md"
              >
                <div className="bg-secondary text-secondary-foreground mb-3 flex h-9 w-9 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-medium">{title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{desc}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
