import { PortableText, type PortableTextComponents } from '@portabletext/react'

interface CodeBlock {
  _type: 'code'
  code: string
  language?: string
  filename?: string
}

const components: PortableTextComponents = {
  types: {
    code: ({ value }: { value: CodeBlock }) => (
      <div className="not-prose bg-muted border-border my-6 overflow-x-auto rounded-lg border">
        {value.filename && (
          <div className="text-muted-foreground border-border border-b px-4 py-1.5 text-xs font-medium">
            {value.filename}
          </div>
        )}
        <pre className="px-4 py-3 text-sm leading-relaxed">
          <code>{value.code}</code>
        </pre>
      </div>
    ),
  },
}

export function ArticleBody({ value }: { value: unknown }) {
  return <PortableText value={value as never} components={components} />
}
