import { defineField, defineType } from 'sanity'
import { SUPPORTED_LOCALES } from '../lib/locale'

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'taxonomy', title: 'Taxonomy' },
    { name: 'i18n', title: 'Translation' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { type: 'code' },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading time (minutes)',
      type: 'number',
      group: 'content',
    }),

    defineField({
      name: 'level',
      title: 'Level',
      type: 'reference',
      group: 'taxonomy',
      to: [{ type: 'level' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'roles',
      title: 'Roles',
      type: 'array',
      group: 'taxonomy',
      of: [{ type: 'reference', to: [{ type: 'role' }] }],
      validation: (rule) => rule.min(1).required(),
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      group: 'taxonomy',
      of: [{ type: 'reference', to: [{ type: 'topic' }] }],
      validation: (rule) => rule.min(1).required(),
    }),
    defineField({
      name: 'prerequisites',
      title: 'Prerequisites',
      type: 'array',
      group: 'taxonomy',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
    }),

    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      group: 'i18n',
      options: { list: SUPPORTED_LOCALES.map((value) => ({ value, title: value })) },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'translationOf',
      title: 'Translation of',
      type: 'reference',
      group: 'i18n',
      description:
        'For non-English articles: the canonical English article this is a translation of.',
      to: [{ type: 'article' }],
    }),
    defineField({
      name: 'translationStatus',
      title: 'Translation status',
      type: 'string',
      group: 'i18n',
      options: { list: ['human', 'machine-draft', 'machine-reviewed'] },
      initialValue: 'human',
    }),

    defineField({
      name: 'aiPrompt',
      title: 'Try it with AI — prompt',
      type: 'text',
      group: 'content',
      rows: 4,
      description: 'A ready-made prompt readers can paste into an AI tool to practice the concepts in this article.',
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        { name: 'metaTitle', title: 'Meta title', type: 'string' },
        { name: 'metaDescription', title: 'Meta description', type: 'text', rows: 2 },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'language', media: 'heroImage' },
  },
})
