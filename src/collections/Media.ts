import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: false, // Changed to false to allow migration
      admin: {
        description: 'Supabase Storage URL',
      },
    },
    {
      name: 'supabasePath',
      type: 'text',
      admin: {
        description: 'Path in Supabase Storage bucket',
      },
    },
  ],
  upload: false, // Disable Payload's built-in upload since we're using Supabase
}
