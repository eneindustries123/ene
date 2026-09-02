import {defineArrayMember, defineField, defineType} from 'sanity'

export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',

  fields: [
    defineField({
      name: 'headers',
      title: 'Header Row',
      type: 'array',
      description: 'Add the column headings for this table.',
      of: [
        defineArrayMember({
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'tableRow',
          title: 'Row',
          type: 'object',

          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'string',
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],

          preview: {
            select: {
              cells: 'cells',
            },

            prepare({cells}) {
              return {
                title:
                  Array.isArray(cells) && cells.length
                    ? cells.join(' | ')
                    : 'Empty row',
              }
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      headers: 'headers',
      rows: 'rows',
    },

    prepare({headers, rows}) {
      const columnCount = Array.isArray(headers) ? headers.length : 0
      const rowCount = Array.isArray(rows) ? rows.length : 0

      return {
        title: 'Table',
        subtitle: `${columnCount} columns • ${rowCount} rows`,
      }
    },
  },
})