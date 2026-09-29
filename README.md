# LOGOS

*a journal of Christ in all things*

A Next.js journal built from the `Logos Blog Mockups` design handoff, with Sanity
as the content editor. One repository, one Vercel deploy, no database to run.

---

## What it is, in plain terms

- **The site** is a set of pages rendered on Vercel's servers and cached, so
  readers get finished HTML rather than waiting on a database.
- **The editor** is Sanity Studio, which lives inside this same app at `/studio`.
  You write essays in a browser; nothing is committed to git to publish.
- **The two talk directly.** There is no separate API service in between — at a
  journal's scale that would be moving parts with no payoff.

Published changes appear within a minute on their own, or instantly if you set up
the publish webhook described below.

---

## Getting it running

### 1. Install

```bash
npm install
```

### 2. Create a Sanity project

Sign in at [sanity.io/manage](https://sanity.io/manage) and create a project.
Note the **project ID** it gives you.

### 3. Set your environment

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

| Variable | Needed for | Where it comes from |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | everything | sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | everything | usually `production` |
| `SANITY_API_WRITE_TOKEN` | seeding, sign-ups | sanity.io/manage → API → Tokens → **Editor** |
| `SANITY_REVALIDATE_SECRET` | instant publishing | any long random string you invent |
| `BUTTONDOWN_API_KEY` | newsletter | optional, see below |
| `NEXT_PUBLIC_SITE_URL` | links in RSS/sitemap | your live URL |

The site runs without any of these — it just shows empty states.

### 4. Let the Studio talk to your machine

In sanity.io/manage → **API** → **CORS origins**, add `http://localhost:3000`
with credentials allowed. Add your Vercel URL there too once you deploy.

### 5. Fill it with the mockup's content

```bash
npm run seed
```

This creates the four pillars, two authors, one series and four essays, so the
site looks like the design straight away. It is safe to re-run — existing
documents are never overwritten.

### 6. Run it

```bash
npm run dev
```

The journal is at `localhost:3000`, the editor at `localhost:3000/studio`.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). The defaults are correct.
3. Add every variable from your `.env.local` under **Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
5. Add your Vercel URL to Sanity's CORS origins (step 4 above).

### Instant publishing (optional)

Pages refresh themselves within a minute. To make a publish appear immediately,
add a webhook in sanity.io/manage → **API** → **Webhooks**:

- **URL** — `https://your-domain.com/api/revalidate`
- **Trigger on** — create, update, delete
- **Secret** — the same string as `SANITY_REVALIDATE_SECRET`

---

## The newsletter form

The subscribe form posts to `/api/subscribe`, which does one of three things:

1. If `BUTTONDOWN_API_KEY` is set, it adds the address to Buttondown.
2. Otherwise, if a Sanity write token is set, it stores the address as a
   `subscriber` document you can see in the Studio and export later.
3. If neither is set, it tells the reader subscriptions are not switched on yet.

So nothing is silently lost before you pick a mailing provider. To use a
different provider, replace the Buttondown branch in
`src/app/api/subscribe/route.ts` — it is about fifteen lines.

---

## How the design is put together

The handoff called for **one** layout — mockup `2a`'s structure — with a theme
switch, and light mode borrowing mockup `1b`'s details.

- **`src/styles/tokens.css`** holds the colour tokens for both themes, exactly as
  given in the handoff table. Dark is the default; light applies when the
  operating system asks for it, unless the reader has chosen otherwise.
- **The theme toggle** stores a choice in the browser. A tiny script in `<head>`
  applies it before the first paint, so the page never flashes the wrong theme.
- **Light-mode flourishes** are driven by tokens, not by JavaScript. The double
  gold rule around the masthead uses a colour that is simply transparent in dark
  mode, so the server does not need to know which theme will win.
- **The footer is near-black in both themes**, per the handoff.
- **Fonts** are Cinzel (display), Cormorant Garamond (body and italics) and Jost
  (small UI), loaded through `next/font` so they are self-hosted and do not shift
  the layout as they load.

### Images

The `assets/*.png` files in the design project were low-resolution crops, and the
handoff says to replace them with full-resolution files. Rather than baking the
crops in, images come from Sanity — upload full-size artwork to each essay and
pillar in the Studio. Until then, posts fall back to the woven parchment/stone
fill the mockups used as placeholders, at the same dimensions, so nothing jumps
around when real images arrive.

---

## Layout of the code

```
src/
  app/
    (site)/          the public journal — has the masthead and footer
    (studio)/        Sanity Studio — deliberately no site chrome
    api/             subscribe, and the publish webhook
    rss.xml/ sitemap.xml/ robots.txt/
  components/        one file per part of the design
  sanity/            schemas, queries, client, image helpers
  styles/            tokens, then components, then the article page
scripts/seed.mjs     the mockup's content, as real documents
```

### A note on two files

`sitemap.xml` and `robots.txt` are written as ordinary route handlers rather than
Next.js's `sitemap.ts` / `robots.ts` shorthand. That shorthand inlines the
project's folder path into a quoted string without escaping it, which breaks on
any directory whose name contains an apostrophe — as this one does. The route
handlers behave identically and have no such constraint.

---

## Everyday commands

```bash
npm run dev        # local development
npm run build      # production build
npm run typecheck  # TypeScript, no build
npm run seed       # load the mockup's content into Sanity
```
