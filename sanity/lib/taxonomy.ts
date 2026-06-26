import { defineField, defineType } from 'sanity'
import { localeStringField, localeTextField } from './locale'

export function defineTaxonomyType(name: string, title: string) {
  return defineType({
    name,
    title,
    type: 'document',
    fields: [
      defineField({
        name: 'key',
        title: 'Key',
        type: 'string',
        description: `Stable identifier used in code, e.g. "beginner".`,
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'key' },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'order',
        title: 'Order',
        type: 'number',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'title',
        ...localeStringField('Title'),
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'description',
        ...localeTextField('Description'),
      }),
    ],
    preview: {
      select: { title: 'title.en', subtitle: 'key' },
    },
  })
}
