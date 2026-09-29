'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, studioProjectId } from './src/sanity/env'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId: studioProjectId,
  dataset,
  title: 'LOGOS',
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // Site settings is a singleton — never offer to create a second one.
    newDocumentOptions: (prev) =>
      prev.filter((item) => item.templateId !== 'siteSettings' && item.templateId !== 'subscriber'),
  },
})
