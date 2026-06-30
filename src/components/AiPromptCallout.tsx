import { Check, Copy, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface Props {
  prompt: string
}

export function AiPromptCallout({ prompt }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="not-prose border-primary/30 bg-primary/5 mt-12 rounded-xl border p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="text-primary size-4 shrink-0" />
        <span className="text-primary text-sm font-semibold">Try it with AI</span>
      </div>
      <div className="relative rounded-lg bg-white/60 dark:bg-black/20">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied!' : 'Copy prompt'}
          title={copied ? 'Copied!' : 'Copy prompt'}
          className="text-muted-foreground hover:text-foreground absolute right-2 top-2 rounded-md p-1 transition"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </button>
        <p className="text-foreground/80 pr-8 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
          {prompt}
        </p>
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        Paste this prompt into Claude, ChatGPT, or any AI tool to practise the concepts in this article.
      </p>
    </div>
  )
}
