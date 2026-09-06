---
title: "Postgres Indexes: Why Column Order Matters"
description: "The same columns can be fast or useless depending on order: B-tree column order in practice."
date: 2026-02-01
category: PostgreSQL
readTime: 5 min read
tags: ["databases"]
sample: false
mediumUrl: https://medium.com/@akshat_aggarwal/postgres-indexes-why-column-order-matters-dd1c018b2106
---

Indexing in Postgres looks simple on paper: add an index, queries get faster. In reality, the *same* set of columns can be blazing fast or basically useless depending on **the order you put them in**, especially for Postgres’s default index type: **B-tree**.

This post is Postgres-only, practical, and biased toward “indexes that stay fast when your tables grow.”

### The key idea: B-tree indexes are sorted

In Postgres, when you run:

```sql
CREATE INDEX idx_orders_user_status_created
ON orders (user_id, status, created_at);
```

you’re not just “indexing three columns.” You’re asking Postgres to maintain a structure sorted like:

1. user_id
2. within each user_id, by status
3. within each (user_id, status), by created_at

That sort order is exactly why the index is usable for some query shapes and not others.

### The “leftmost prefix” rule (why order is everything)

A composite B-tree index on (A, B, C) is naturally great when your query starts constraining from the left:

✅ Great:

- WHERE A = ...
- WHERE A = ... AND B = ...
- WHERE A = ... AND B = ... AND C ...
- WHERE A = ... ORDER BY B (often)
- WHERE A = ... AND B = ... ORDER BY C (often)

🚫 Usually not great:

- WHERE B = ... (without A)
- WHERE C = ... (without A and B)
- WHERE B = ... AND C = ... (without A)

**Mental model:** it’s a phonebook sorted by Last Name then First Name. If you only know First Name, you can’t “jump” efficiently.

### A concrete example: same columns, different usability

Let’s say you run this query all day:

```sql
SELECT *
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

### Good index

```sql
CREATE INDEX idx_orders_user_created
ON orders (user_id, created_at DESC);
```

Why it works:

- Postgres can **seek** directly to user_id = 42
- within that user’s section, rows are already in created_at order
- LIMIT 20 becomes “walk 20 entries” instead of sorting lots of rows

### Same columns, worse order

```sql
CREATE INDEX idx_orders_created_user
ON orders (created_at DESC, user_id);
```

Now the index is sorted by time first, then user. Rows for user_id=42 are scattered across the entire timeline, so Postgres can’t easily jump to “all rows for this user” (it can jump to a time range, not a user).

### A useful heuristic for Postgres B-tree column order

When designing a composite B-tree index, this is a solid default:

1. **Equality filters first** (=, IN)
2. then **range filters** (>, <, BETWEEN)
3. then **ORDER BY columns** (to avoid sorting)
4. optionally: extra columns for **index-only scans** via INCLUDE

Example query:

```sql
SELECT id, total
FROM orders
WHERE user_id = 42
  AND status = 'PAID'
  AND created_at >= now() - interval '30 days'
ORDER BY created_at DESC
LIMIT 50;
```

A strong index is:

```sql
CREATE INDEX idx_orders_user_status_created
ON orders (user_id, status, created_at DESC);
```

user_id and status narrow the search quickly (equality), then created_at supports both the range and the ordering.

### “But can’t Postgres still use the index if the first column isn’t filtered?”

Sometimes it can, but it’s usually less efficient.

Postgres might choose:

- a sequential scan (if it estimates many rows)
- a bitmap index scan (combine multiple indexes)
- an index scan with filtering (scan more, filter later)

Those can work, but they’re often not as stable or fast as a clean left-to-right match.

If you want to see what Postgres is doing, use:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

That output tells you whether Postgres used an Index Scan, Bitmap Index Scan, whether it sorted, and how much it read.

### Postgres-specific “related stuff” that matters in real systems

### 1) Use INCLUDE for “covering” without messing with order

In Postgres, INCLUDE adds non-key columns to the index payload (not part of the sort order). This helps **index-only scans** without changing the B-tree ordering.

```sql
CREATE INDEX idx_orders_user_created_include
ON orders (user_id, created_at DESC)
INCLUDE (total, currency);
```

If your query returns only user_id/created_at/total/currency, Postgres may be able to answer from the index alone.

**Important:** index-only scans depend on the visibility map (VACUUM matters). Even with the perfect index, a table with lots of recently-updated rows may still need heap visits.

### 2) Partial indexes are insanely effective

If you query a subset constantly, index only that subset:

```sql
CREATE INDEX idx_orders_pending_by_created
ON orders (created_at)
WHERE status = 'PENDING';
```

Smaller index = cheaper maintenance + faster scans.

### 3) Expression indexes solve “function on column” problems

If you do this:

```sql
SELECT *
FROM users
WHERE lower(email) = lower('Akshat@Example.com');
```

A plain index on email won’t help much because of lower(email).

Fix it with:

```sql
CREATE INDEX idx_users_lower_email
ON users (lower(email));
```

### 4) Don’t force B-tree where another index type fits better

Still Postgres, still indexing, but different structures:

- **BRIN**: huge tables, naturally ordered data (timestamps), cheap + great for range-ish scans
- **GIN**: arrays, JSONB containment, full-text search
- **GiST**: geometric/range types and some specialized searches

B-tree is the default workhorse, but it’s not the answer to every query pattern.

### Practical checklist

When you’re choosing index order for Postgres B-tree, ask:

- What are the **most common WHERE clauses**? Put those columns first.
- Are those filters mostly **equality** or **range**?
- Do you have a consistent **ORDER BY**? Align the index order to avoid sorting.
- Can INCLUDE give you index-only scans without bloating the key?
- Can a **partial index** shrink the problem dramatically?

### Closing thought

In Postgres, an index isn’t just “columns + speed.” For B-trees, it’s **a sorted shape**. Column order defines what Postgres can seek efficiently, what it has to scan, and whether it can avoid sorting.

If you want, paste 2–3 representative queries (and rough table size / row counts). I’ll suggest a minimal set of Postgres indexes (with column order and INCLUDE/WHERE where appropriate) and explain the tradeoffs.
