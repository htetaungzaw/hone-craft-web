import { defineField, defineType } from 'sanity'
import { SUPPORTED_LOCALES } from '../lib/locale'

export default defineType({
  name: 'glossaryTerm',
  title: 'Glossary term',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Stable identifier shared across translations, e.g. "agentic-ai".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: SUPPORTED_LOCALES.map((value) => ({ value, title: value })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'term',
      title: 'Term',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'term' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'definition',
      title: 'Definition',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'translationStatus',
      title: 'Translation status',
      type: 'string',
      options: { list: ['human', 'machine-draft', 'machine-reviewed'] },
      initialValue: 'human',
    }),
  ],
  preview: {
    select: { title: 'term', subtitle: 'language' },
  },
})
