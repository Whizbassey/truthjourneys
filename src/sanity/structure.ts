import type { StructureResolver } from 'sanity/structure'

/**
 * Studio navigation. Site settings is a singleton, so it opens straight into
 * the document rather than into a list with one item in it.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('LOGOS')
    .items([
      S.listItem()
        .title('Essays')
        .child(S.documentTypeList('post').title('Essays')),
      S.listItem()
        .title('Pillars')
        .child(S.documentTypeList('category').title('Pillars')),
      S.listItem()
        .title('Series')
        .child(S.documentTypeList('series').title('Series')),
      S.listItem()
        .title('Authors')
        .child(S.documentTypeList('author').title('Authors')),
      S.divider(),
      S.listItem()
        .title('Site settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Subscribers')
        .child(S.documentTypeList('subscriber').title('Subscribers')),
    ])
