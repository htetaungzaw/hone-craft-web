import { defineField, defineType } from 'sanity'
import { localeStringField, localeTextField } from '../lib/locale'

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      ...localeStringField('Site title'),
    }),
    defineField({
      name: 'description',
      ...localeTextField('Site description'),
    }),
  ],
  preview: {
    select: { title: 'title.en' },
  },
})
