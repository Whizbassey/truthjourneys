import { defineField, defineType, type SchemaTypeDefinition } from 'sanity'

import { post } from './post'

export const category = defineType({
  name: 'category',
  title: 'Pillar',
  type: 'document',
  description: 'The four pillars: Scripture, The Fathers, Prayer, Iconography.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blurb',
      title: 'Card line',
      type: 'string',
      description: 'The short italic line on the homepage card, e.g. "The living Word for every age."',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Longer introduction shown at the top of the pillar page.',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'order',
      title: 'Position',
      type: 'number',
      description: 'Controls the left-to-right order of the four pillars.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'blurb', media: 'image' } },
})

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'name', maxLength: 64 },
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'e.g. "Contributing editor"',
    }),
    defineField({ name: 'bio', type: 'text', rows: 4 }),
    defineField({
      name: 'image',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
})

export const series = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  description: 'A numbered sequence of essays, e.g. "Christ in the Old Testament".',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'partCount',
      title: 'Planned parts',
      type: 'number',
      description: 'Shown as "7 parts" on the series card.',
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'description', media: 'image' } },
})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'LOGOS' }),
    defineField({
      name: 'tagline',
      type: 'string',
      initialValue: 'a journal of Christ in all things',
    }),
    defineField({
      name: 'verseTicker',
      title: 'Verse band',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Exactly three short scripture lines for the band at the top of every page.',
      validation: (rule) => rule.length(3),
    }),
    defineField({
      name: 'interlude',
      title: 'Homepage verse interlude',
      type: 'object',
      fields: [
        defineField({ name: 'text', type: 'text', rows: 2, title: 'Quotation' }),
        defineField({ name: 'reference', type: 'string', title: 'Reference' }),
        defineField({
          name: 'image',
          type: 'image',
          title: 'Background',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'subscribeTitle',
      type: 'string',
      initialValue: 'Join the Journey',
    }),
    defineField({
      name: 'subscribeDek',
      type: 'string',
      initialValue: "One essay every Lord's Day, sent with care.",
    }),
    defineField({
      name: 'footerLegal',
      type: 'string',
      initialValue: '© 2026 LOGOS · Soli Deo Gloria',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})

export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscriber',
  type: 'document',
  description: 'Addresses captured by the site when no mailing provider is configured.',
  fields: [
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'subscribedAt', type: 'datetime', readOnly: true }),
    defineField({ name: 'source', type: 'string', readOnly: true }),
  ],
  preview: { select: { title: 'email', subtitle: 'subscribedAt' } },
})

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  category,
  author,
  series,
  siteSettings,
  subscriber,
]
