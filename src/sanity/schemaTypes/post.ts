import { defineArrayMember, defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Essay',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Details' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'Shown in small caps on cards and in the masthead of the essay.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dek',
      title: 'Standfirst',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'The italic line under the title. One sentence.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'excerpt',
      title: 'Card summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown on homepage and archive cards, and in search results.',
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for readers using a screen reader.',
        }),
      ],
    }),
    defineField({
      name: 'coverCaption',
      title: 'Cover caption',
      type: 'string',
      group: 'content',
      description: 'e.g. "Agnus Dei, apse mosaic, 6th century."',
    }),
    defineField({
      name: 'body',
      title: 'Essay',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Body', value: 'normal' },
            { title: 'Section heading', value: 'h2' },
            { title: 'Sub-heading', value: 'h3' },
            { title: 'Quotation', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bulleted', value: 'bullet' },
            { title: 'Numbered (Roman)', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Italic', value: 'em' },
              { title: 'Bold', value: 'strong' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'External link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  }),
                ],
              }),
              defineArrayMember({
                name: 'internalLink',
                title: 'Link to another essay',
                type: 'object',
                fields: [
                  defineField({
                    name: 'reference',
                    type: 'reference',
                    to: [{ type: 'post' }],
                    validation: (rule) => rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        }),
        defineArrayMember({
          name: 'verse',
          title: 'Scripture quotation',
          type: 'object',
          description: 'The bordered, centred scripture band. KJV throughout.',
          fields: [
            defineField({
              name: 'text',
              title: 'Quotation',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'reference',
              title: 'Reference',
              type: 'string',
              description: 'e.g. "John 1:29"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'reference', subtitle: 'text' },
          },
        }),
      ],
    }),
    defineField({
      name: 'marginNotes',
      title: 'Margin notes',
      type: 'array',
      group: 'content',
      description: 'Scripture and source notes shown in the right-hand margin.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'marginNote',
          fields: [
            defineField({
              name: 'reference',
              title: 'Label',
              type: 'string',
              description: 'e.g. "Exodus 12:5" or "Melito of Sardis"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'text',
              title: 'Note',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: 'reference', subtitle: 'text' } },
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Pillar',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'series' }],
      description: 'Optional. Links this essay into a numbered sequence.',
    }),
    defineField({
      name: 'part',
      title: 'Part number',
      type: 'number',
      group: 'meta',
      description: 'Position within the series, e.g. 3 renders as "Part III".',
      hidden: ({ document }) => !document?.series,
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading time (minutes)',
      type: 'number',
      group: 'meta',
      description: 'Leave blank to estimate from the essay length.',
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the homepage',
      type: 'boolean',
      group: 'meta',
      description: 'The most recently published featured essay fills the hero.',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      publishedAt: 'publishedAt',
      media: 'coverImage',
    },
    prepare({ title, category, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Unpublished'
      return { title, subtitle: [category, date].filter(Boolean).join(' · '), media }
    },
  },
})
