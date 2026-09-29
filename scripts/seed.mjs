/**
 * Seeds the journal with the four pillars and the essays from the mockup, so a
 * fresh Sanity project renders the design straight away.
 *
 *   npm run seed
 *
 * Safe to re-run: every document has a fixed id and is created only if missing.
 * Nothing you have edited in the Studio is overwritten.
 */

import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error(
    'Missing config. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local.',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

const ref = (_ref) => ({ _type: 'reference', _ref })

/** Portable-text helpers, so the seed reads like prose rather than JSON. */
let keySeed = 0
const key = () => `seed${(keySeed += 1)}`

const para = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})

const heading = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'h2',
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})

const verse = (text, reference) => ({
  _type: 'verse',
  _key: key(),
  text,
  reference,
})

const categories = [
  {
    _id: 'category.scripture',
    title: 'Scripture',
    slug: 'scripture',
    blurb: 'The living Word for every age.',
    description:
      'Reading the Bible as one book with one subject: essays on typology, the Gospels and the whole counsel of God.',
    order: 1,
  },
  {
    _id: 'category.fathers',
    title: 'The Fathers',
    slug: 'fathers',
    blurb: 'Timeless voices for today.',
    description:
      'What the early Church understood, and why it still reads as though written this morning.',
    order: 2,
  },
  {
    _id: 'category.prayer',
    title: 'Prayer',
    slug: 'prayer',
    blurb: 'In the presence of God.',
    description: 'On silence, the hours, and the long work of attention.',
    order: 3,
  },
  {
    _id: 'category.iconography',
    title: 'Iconography',
    slug: 'iconography',
    blurb: 'Beauty that points to Heaven.',
    description: 'Sacred art as theology in line and colour.',
    order: 4,
  },
]

const authors = [
  {
    _id: 'author.elias-marrow',
    name: 'Fr. Elias Marrow',
    slug: 'elias-marrow',
    role: 'Contributing editor',
    bio: 'Writes on typology and the Gospels.',
  },
  {
    _id: 'author.clara-voss',
    name: 'Clara Voss',
    slug: 'clara-voss',
    role: 'Contributing editor',
    bio: 'Writes on the Fathers and the history of doctrine.',
  },
]

const seriesDocs = [
  {
    _id: 'series.christ-in-the-old-testament',
    title: 'Christ in the Old Testament',
    slug: 'christ-in-the-old-testament',
    description: 'Seven essays tracing one Person through the whole of the first covenant.',
    partCount: 7,
  },
]

const posts = [
  {
    _id: 'post.the-word-made-flesh',
    title: 'The Word Made Flesh',
    slug: 'the-word-made-flesh',
    dek: "How John's prologue reframes Genesis, and why every page of Scripture points to one Person.",
    excerpt:
      "John does not begin with a manger. He begins where Genesis begins, and then says something Genesis never said aloud.",
    category: 'category.scripture',
    author: 'author.elias-marrow',
    featured: true,
    publishedAt: '2026-03-20T08:00:00.000Z',
    readingTime: 14,
    coverCaption: 'Christ Pantocrator, apse mosaic.',
    marginNotes: [
      {
        _key: key(),
        reference: 'Genesis 1:1',
        text: 'In the beginning God created the heaven and the earth.',
      },
      {
        _key: key(),
        reference: 'John 1:14',
        text: 'And the Word was made flesh, and dwelt among us.',
      },
      {
        _key: key(),
        reference: 'Athanasius',
        text: 'On the Incarnation, c. 318 A.D.',
      },
    ],
    body: [
      para(
        'Of the four Gospels, only one refuses to start with a birth. John opens where the Hebrew Bible opens, with the same three words, and then does something no one had done before: he puts a Person where Genesis had put an act.',
      ),
      verse(
        'In the beginning was the Word, and the Word was with God, and the Word was God.',
        'John 1:1',
      ),
      heading('The Same Beginning'),
      para(
        'A first-century reader would have heard the echo immediately. Genesis begins, and God speaks, and there is light. John begins, and the speech itself turns out to have a face.',
      ),
      para(
        'This is not a poetic flourish laid over the older text. It is a claim about what the older text was always describing. The Word by which everything was made is not a divine utterance that dissolves once the work is done; He remains, and He can be met.',
      ),
      heading('Why It Changes the Reading'),
      para(
        'Once the prologue is taken seriously, the rest of Scripture stops being an anthology and starts being a single argument. The lamb in Egypt, the rock in the wilderness, the bronze serpent lifted up — each stops being a curiosity and becomes a rehearsal.',
      ),
      verse('And the Word was made flesh, and dwelt among us.', 'John 1:14'),
      para(
        'That is the whole of it. The One through whom the world was made entered the world He had made, and was not recognised by it. Every page after this is commentary.',
      ),
    ],
  },
  {
    _id: 'post.the-lamb-who-reigns',
    title: 'The Lamb Who Reigns',
    slug: 'the-lamb-who-reigns',
    dek: 'Passover was never only a memory. It was a rehearsal.',
    excerpt:
      'From Genesis to Revelation, the Lamb of God reveals a kingdom of sacrifice, victory and unending mercy.',
    category: 'category.scripture',
    author: 'author.elias-marrow',
    series: 'series.christ-in-the-old-testament',
    part: 3,
    publishedAt: '2026-03-03T08:00:00.000Z',
    readingTime: 9,
    coverCaption: 'Agnus Dei, apse mosaic, 6th century.',
    marginNotes: [
      {
        _key: key(),
        reference: 'Exodus 12:5',
        text: 'Your lamb shall be without blemish, a male of the first year.',
      },
      {
        _key: key(),
        reference: '1 Peter 1:19',
        text: '…as of a lamb without blemish and without spot.',
      },
      {
        _key: key(),
        reference: 'Melito of Sardis',
        text: 'On Pascha, c. 170 A.D. — the earliest Christian Easter homily.',
      },
    ],
    body: [
      para(
        'On the night Israel left Egypt, every household did the same strange thing. They chose a lamb, kept it close for four days, and then — at twilight — killed it and painted its blood on the doorposts. Death passed over every door so marked.',
      ),
      para(
        'For fifteen centuries the feast was kept. And then, in an upper room in Jerusalem, a rabbi from Nazareth took bread and said, this is my body.',
      ),
      heading('Without Blemish'),
      para(
        'The instructions in Exodus are oddly precise. The animal must be a year old, male, and without blemish. Peter, writing to scattered congregations decades after the crucifixion, reaches for exactly that phrase.',
      ),
      verse(
        'Behold the Lamb of God, which taketh away the sin of the world.',
        'John 1:29',
      ),
      heading('Not a Bone Broken'),
      para(
        'John the Evangelist makes the connection unmistakable. He notes that the soldiers did not break Jesus’ legs — that the scripture should be fulfilled. It is a small detail, and he treats it as the hinge of the whole account.',
      ),
    ],
  },
  {
    _id: 'post.lessons-from-the-desert',
    title: 'Lessons from the Desert',
    slug: 'lessons-from-the-desert',
    dek: 'Go, sit in your cell, and your cell will teach you everything.',
    excerpt:
      'What the early monks teach us about silence, attention, and the one thing needful in a noisy world.',
    category: 'category.fathers',
    author: 'author.clara-voss',
    publishedAt: '2026-02-18T08:00:00.000Z',
    readingTime: 11,
    marginNotes: [
      {
        _key: key(),
        reference: 'Psalm 46:10',
        text: 'Be still, and know that I am God.',
      },
      {
        _key: key(),
        reference: 'Abba Moses',
        text: 'Sayings of the Desert Fathers, 4th century.',
      },
    ],
    body: [
      para(
        'The men and women who went into the Egyptian desert in the fourth century were not running from the world. They were running toward a question the world kept interrupting.',
      ),
      para(
        'Their sayings survive in fragments — a sentence here, an exchange there — and they are startlingly practical. Almost none of them are about visions. Nearly all of them are about attention.',
      ),
      verse('Be still, and know that I am God.', 'Psalm 46:10'),
      heading('The Cell'),
      para(
        'A brother asked Abba Moses for a word. The answer was one line: go, sit in your cell, and your cell will teach you everything. Not a book, not a teacher. A room, and the willingness to stay in it.',
      ),
    ],
  },
  {
    _id: 'post.all-things-in-christ',
    title: 'All Things in Christ',
    slug: 'all-things-in-christ',
    dek: 'Two Greek letters, scratched into tomb walls by people who would not deny His name.',
    excerpt:
      'Alpha and Omega: how the Chi-Rho reveals the unity of all things in Him, from creation to redemption.',
    category: 'category.iconography',
    author: 'author.clara-voss',
    publishedAt: '2026-01-27T08:00:00.000Z',
    readingTime: 7,
    marginNotes: [
      {
        _key: key(),
        reference: 'Colossians 1:17',
        text: 'And he is before all things, and by him all things consist.',
      },
      {
        _key: key(),
        reference: 'Revelation 1:8',
        text: 'I am Alpha and Omega, the beginning and the ending.',
      },
    ],
    body: [
      para(
        'The Chi-Rho is two letters laid across one another: chi and rho, the first two of Christos. It is among the earliest Christian signs we have, and it appears first not on churches but in catacombs.',
      ),
      para(
        'That location matters. The monogram was cut into stone by people burying their dead, often in secret, frequently at risk. It was a claim made in the least triumphant setting imaginable.',
      ),
      verse(
        'And he is before all things, and by him all things consist.',
        'Colossians 1:17',
      ),
      heading('Alpha and Omega'),
      para(
        'Flanking the monogram you will often find two more letters. They are not decoration. They assert that the One whose name is abbreviated between them holds both ends of the story, and therefore everything in between.',
      ),
    ],
  },
]

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'LOGOS',
  tagline: 'a journal of Christ in all things',
  verseTicker: [
    'In the beginning was the Word — John 1:1',
    'Be still, and know that I am God — Psalm 46:10',
    'All things were made by him — John 1:3',
  ],
  interlude: {
    _type: 'object',
    text: 'And he is before all things, and by him all things consist.',
    reference: 'Colossians 1:17',
  },
  subscribeTitle: 'Join the Journey',
  subscribeDek: "One essay every Lord's Day, sent with care.",
  footerLegal: '© 2026 LOGOS · Soli Deo Gloria',
}

async function run() {
  const transaction = client.transaction()

  for (const category of categories) {
    transaction.createIfNotExists({
      _id: category._id,
      _type: 'category',
      title: category.title,
      slug: { _type: 'slug', current: category.slug },
      blurb: category.blurb,
      description: category.description,
      order: category.order,
    })
  }

  for (const author of authors) {
    transaction.createIfNotExists({
      _id: author._id,
      _type: 'author',
      name: author.name,
      slug: { _type: 'slug', current: author.slug },
      role: author.role,
      bio: author.bio,
    })
  }

  for (const series of seriesDocs) {
    transaction.createIfNotExists({
      _id: series._id,
      _type: 'series',
      title: series.title,
      slug: { _type: 'slug', current: series.slug },
      description: series.description,
      partCount: series.partCount,
    })
  }

  for (const post of posts) {
    transaction.createIfNotExists({
      _id: post._id,
      _type: 'post',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      dek: post.dek,
      excerpt: post.excerpt,
      body: post.body,
      marginNotes: post.marginNotes,
      category: ref(post.category),
      author: ref(post.author),
      ...(post.series ? { series: ref(post.series), part: post.part } : {}),
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      featured: Boolean(post.featured),
      ...(post.coverCaption ? { coverCaption: post.coverCaption } : {}),
    })
  }

  transaction.createIfNotExists(siteSettings)

  await transaction.commit()

  console.log(
    `Seeded ${categories.length} pillars, ${authors.length} authors, ` +
      `${seriesDocs.length} series and ${posts.length} essays.`,
  )
  console.log('Add cover images in the Studio — the mockup crops were low-res placeholders.')
}

run().catch((error) => {
  console.error('Seed failed:', error.message ?? error)
  process.exit(1)
})
