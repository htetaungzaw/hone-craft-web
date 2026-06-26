import { defineField, defineType } from 'sanity'
import { localeStringField, localeTextField } from '../lib/locale'

export default defineType({
  name: 'learningPath',
  title: 'Learning path',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      ...localeStringField('Title'),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      ...localeTextField('Description'),
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'reference',
      to: [{ type: 'level' }],
    }),
    defineField({
      name: 'articles',
      title: 'Articles (ordered)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'article' }] }],
      validation: (rule) => rule.min(1).required(),
    }),
  ],
  preview: {
    select: { title: 'title.en' },
  },
})
