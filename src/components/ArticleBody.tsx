import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CodeBlock {
  _type: 'code'
  code: string
  language?: string
  filename?: string
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy code'}
      title={copied ? 'Copied!' : 'Copy code'}
      className="text-muted-foreground hover:text-foreground absolute right-3 top-3 rounded-md p-1 transition"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

const components: PortableTextComponents = {
  types: {
    code: ({ value }: { value: CodeBlock }) => (
      <div className="not-prose bg-muted border-border relative my-6 overflow-x-auto rounded-lg border">
        {value.filename && (
          <div className="text-muted-foreground border-border border-b px-4 py-1.5 text-xs font-medium">
            {value.filename}
          </div>
        )}
        <CopyButton code={value.code} />
        <pre className="px-4 py-3 pr-10 text-sm leading-relaxed">
          <code>{value.code}</code>
        </pre>
      </div>
    ),
  },
}

export function ArticleBody({ value }: { value: unknown }) {
  return <PortableText value={value as never} components={components} />
}
