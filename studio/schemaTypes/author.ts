import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Role / Job Title',
      type: 'string',
      description: 'Example: Senior Solar Engineer, E&E Editorial Team.',
      validation: (Rule) => Rule.max(120),
    }),

    defineField({
      name: 'avatar',
      title: 'Author Photo',
      type: 'image',
      options: {
        hotspot: true,
      },

      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describe the image for accessibility.',
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),

    defineField({
      name: 'bio',
      title: 'Short Biography',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),

    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'avatar',
    },
  },
})