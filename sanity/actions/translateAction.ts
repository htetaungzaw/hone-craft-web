import type { DocumentActionComponent, DocumentActionProps } from 'sanity'

// Baked into the Studio bundle at `sanity deploy` time via the SANITY_STUDIO_
// env prefix (see sanity.config.ts comment) — acceptable for a low-value
// shared secret gating a translation worker, not a high-security boundary.
const WORKER_URL = process.env.SANITY_STUDIO_TRANSLATE_WORKER_URL
const SHARED_SECRET = process.env.SANITY_STUDIO_TRANSLATE_SECRET

function createTranslateAction(targetLocale: 'ja' | 'my', label: string): DocumentActionComponent {
  return function TranslateAction(props: DocumentActionProps) {
    const { id, type, published, draft, onComplete } = props
    if (type !== 'article') return null

    const doc = draft || published
    if (!doc || doc.language !== 'en') return null

    return {
      label,
      onHandle: async () => {
        if (!WORKER_URL || !SHARED_SECRET) {
          // eslint-disable-next-line no-alert
          alert('Translation worker is not configured (missing SANITY_STUDIO_TRANSLATE_WORKER_URL/SECRET).')
          onComplete()
          return
        }

        try {
          const response = await fetch(`${WORKER_URL}/translate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SHARED_SECRET}`,
            },
            body: JSON.stringify({ documentId: id, targetLocale }),
          })

          if (!response.ok) {
            // eslint-disable-next-line no-alert
            alert(`Translation failed: ${await response.text()}`)
          }
        } catch (error) {
          // eslint-disable-next-line no-alert
          alert(`Translation failed: ${(error as Error).message}`)
        }

        onComplete()
      },
    }
  }
}

export const translateToJaAction = createTranslateAction('ja', 'Translate to Japanese (Claude)')
export const translateToMyAction = createTranslateAction('my', 'Translate to Burmese (Claude)')
