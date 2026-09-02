import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',

  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true,
    },
    {
      name: 'media',
      title: 'Media',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'publishing',
      title: 'Publishing',
    },
  ],

  fields: [
    // ==================================================
    // CONTENT
    // ==================================================

    defineField({
      name: 'title',
      title: 'Blog Title',
      type: 'string',
      group: 'content',
      description: 'Main public title of the article.',
      validation: (Rule) => Rule.required().min(5).max(120),
    }),

    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      description:
        'Used in the article URL. Generate it from the blog title.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt / Short Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'Short summary used on blog cards and as the default SEO description.',
      validation: (Rule) =>
        Rule.required()
          .min(30)
          .max(200)
          .warning('Keep the excerpt concise and useful for search results.'),
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{type: 'author'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      group: 'content',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      description:
        'Optional keywords/topics related to this article.',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.unique(),
    }),

    // ==================================================
    // ARTICLE BODY
    // ==================================================

    defineField({
      name: 'body',
      title: 'Article Content',
      type: 'array',
      group: 'content',
      description: 'Write the complete blog article here.',

      of: [
        defineArrayMember({
          type: 'block',

          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],

          lists: [
            {title: 'Bullet List', value: 'bullet'},
            {title: 'Numbered List', value: 'number'},
          ],

          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],

            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',

                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  }),

                  defineField({
                    name: 'openInNewTab',
                    title: 'Open in New Tab',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),

        // Article image
        defineArrayMember({
          name: 'articleImage',
          title: 'Article Image',
          type: 'image',

          options: {
            hotspot: true,
          },

          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description:
                'Required for accessibility and image SEO.',
              validation: (Rule) => Rule.required().max(160),
            }),

            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              validation: (Rule) => Rule.max(250),
            }),
          ],
        }),

        // Custom table schema
        defineArrayMember({
          type: 'table',
        }),
      ],

      validation: (Rule) => Rule.required().min(1),
    }),

    // ==================================================
    // MEDIA
    // ==================================================

    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'media',

      options: {
        hotspot: true,
      },

      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description:
            'Describe the image accurately for accessibility and SEO.',
          validation: (Rule) => Rule.required().max(160),
        }),

        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          validation: (Rule) => Rule.max(250),
        }),
      ],

      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'ogImage',
      title: 'Social / Open Graph Image',
      type: 'image',
      group: 'media',
      description:
        'Optional image specifically for social sharing. If empty, the featured image can be used by the website.',

      options: {
        hotspot: true,
      },

      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (Rule) => Rule.max(160),
        }),
      ],
    }),

    // ==================================================
    // SEO
    // ==================================================

    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      description:
        'Optional search-engine title. If empty, the blog title will be used.',
      validation: (Rule) =>
        Rule.max(60).warning(
          'SEO titles are generally best kept around 50–60 characters.',
        ),
    }),

    defineField({
      name: 'seoDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description:
        'Optional SEO description. If empty, the article excerpt can be used.',
      validation: (Rule) =>
        Rule.max(160).warning(
          'Meta descriptions are generally best kept around 150–160 characters.',
        ),
    }),

    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      description:
        'Usually leave this empty unless this article originally exists at another URL.',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'noIndex',
      title: 'Prevent Search Engine Indexing',
      type: 'boolean',
      group: 'seo',
      description:
        'Enable only when this article should not appear in search engines.',
      initialValue: false,
    }),

    // ==================================================
    // PUBLISHING
    // ==================================================

    defineField({
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'datetime',
      group: 'publishing',
      description:
        'Date displayed publicly as the article publication date.',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured Blog',
      type: 'boolean',
      group: 'publishing',
      description:
        'Enable this to feature the article prominently on the website.',
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: 'Publication Date — Newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },

    {
      title: 'Publication Date — Oldest',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      category: 'category.title',
      media: 'featuredImage',
      publishedAt: 'publishedAt',
    },

    prepare({title, author, category, media, publishedAt}) {
      const details = [
        category,
        author,
        publishedAt
          ? new Date(publishedAt).toLocaleDateString()
          : undefined,
      ].filter(Boolean)

      return {
        title,
        subtitle: details.join(' • '),
        media,
      }
    },
  },
})