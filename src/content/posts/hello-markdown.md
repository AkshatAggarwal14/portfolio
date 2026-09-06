---
title: "Hello, Markdown"
description: "A style test covering every Markdown element this blog supports."
date: 2021-01-01
category: Meta
readTime: 3 min read
sample: true
---

This is a style test: one post exercising every Markdown element the blog supports. If you are writing a new post, duplicate this file and replace the content.

## Text basics

Regular paragraphs, **bold text**, *italic text*, ***both***, ~~strikethrough~~, `inline code`, and [links](https://astro.build) all work.

> Blockquotes look like this. Useful for callouts and quoting smarter people than yourself.

## Lists

Unordered:

- First item
- Second item
- Third item

Ordered:

1. Do the thing
2. Check the thing
3. Ship the thing

Checklist:

- [x] Write the post
- [ ] Publish the post

## Code

Inline `SELECT * FROM orders` sits inside sentences. Tagged fences get Dracula highlighting:

```sql
SELECT id, total
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 50;
```

```bash
npm run build && npm test
```

Untagged fences render plain:

```
just some text
in a box
```

## Tables

| Feature | Supported |
| --- | --- |
| Headings | Yes |
| Lists | Yes |
| Code | Yes |
| Images | Yes |

## Images

![Cover illustration for the Markdown style test](/kitchen-sink/cover.svg)

Store images under `public/` (for example `public/kitchen-sink/cover.svg`) and reference them with a leading slash. They get rounded corners and a border automatically.

---

That's every element. Happy writing.
