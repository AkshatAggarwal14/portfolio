---
title: "A Missing PostgreSQL Index"
description: A missing index turned a pre-release test into a production fire, and the zero-downtime fix.
date: 2025-07-31
category: PostgreSQL
readTime: 4 min read
tags: ["databases"]
sample: false
mediumUrl: https://medium.com/@akshat_aggarwal/a-missing-postgresql-index-4e10679ed8ee
---

The crisis didn’t start with a flood of alerts on a Tuesday afternoon. It started quietly, during a pre-release test in the production environment. As a junior engineer, I was running our new feature through its paces on a production server for the first time. Everything had worked perfectly in our test environments. But here, in the real world, the feature ground to a halt. What should have been an instant response was a query that seemed to hang forever. There was no system-wide fire yet, just a dawning realization that something was fundamentally wrong. This is the story of how that pre-release test turned into a trial by fire, and how a single missing index was the culprit.

### A Testing Blind Spot

The root of the problem was a classic database mistake. Without an index, the database is forced to perform a “Sequential Scan,” reading every single row in a table to find the data it needs. This inefficient process devours CPU, and when done millions of times, it can bring a system to its knees.

But why did we miss this in our extensive end-to-end testing? The fatal flaw was in our test data. Our team shared a database with another team. In our test environment, our internal accounts had only a few thousand rows in the shared table, a trivial amount for a sequential scan. We had no idea that in production, the other team’s data in that same table amounted to over 13 million rows. Our tests gave us a dangerous false sense of security because they weren’t running against production-scale data, creating a massive blind spot that was exposed the moment we tested on the live system.

### The Detective Work: EXPLAIN ANALYZE to the Rescue

With the feature failing in production, I had to find the specific query causing the chaos. My first stop was pg_stat_statements, a PostgreSQL extension that tracks query statistics. It quickly pointed to a single SELECT statement that was consuming a shocking amount of execution time.

Finding the suspect was one thing; proving its guilt was another. For that, I turned to the most powerful tool in my arsenal: EXPLAIN ANALYZE. This command doesn't just show you what the database *thinks* it will do; it actually runs the query and tells you what *really* happened. I ran the following command against the production database to get the real-world execution plan:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM habits_daily WHERE date = $1 AND user_id = $2;
```

The output:

```
-- QUERY PLAN
Seq Scan on habits_daily (cost=0.00..4535.74 rows=1 width=48) (actual time=0.025..21.435 rows=1 loops=1)
   Filter: ((date = '2024-01-15'::date) AND (user_id = 12345))
   Rows Removed by Filter: 999999
   Buffers: shared hit=2458
```

The plan was clear. The Seq Scan confirmed it was reading the whole table. But the real giveaway was Rows Removed by Filter: 999999. The database was reading a million rows just to find one, and throwing away 99.9% of its work.

Now that I had a diagnosis, I needed to test the cure. I wrote scripts to generate a local database with more than double our production data, creating a safe environment to experiment. There, I tested different index variations, weighing the pros and cons of each until I landed on the optimal composite index.

### The Solution: A Zero-Downtime Fix

The fix seemed simple: CREATE INDEX. But in production, that command is a ticking time bomb. It places an ACCESS EXCLUSIVE lock on the table, blocking all writes (INSERT, UPDATE, DELETE) until the index is built. On a 13-million-row table, this could mean hours of downtime. We'd be fixing one problem by creating a full-blown outage.

The answer was CREATE INDEX CONCURRENTLY. This command is a lifesaver for live systems because it builds the index without locking out writes, allowing the application to run normally. The trade-off is that it's slower and uses more resources, but it avoids downtime.

This is the command we used to safely deploy the fix:

```sql
CREATE INDEX CONCURRENTLY idx_habits_daily_user_date ON habits_daily (user_id, date);
```

It also comes with a major caveat: it can’t be run inside a transaction. This is a crucial detail for anyone using a migration tool like Liquibase with Java Spring. You have to explicitly tell Liquibase not to wrap the command in a transaction by setting runInTransaction="false" in your changeset file.

### Lessons from the Fire

That production test was one of the most stressful but valuable experiences of my career. It drove home a few key lessons:

- **Test data must mirror production.** Without realistic data volumes, performance testing is meaningless and can create dangerous blind spots.
- **EXPLAIN ANALYZE is your best friend.** It provides the ground truth for how your queries are performing and is the fastest way to diagnose a database bottleneck.
- **Production schema changes are serious.** A simple CREATE INDEX can cause a major outage. Always use non-locking alternatives like CREATE INDEX CONCURRENTLY on live systems.

In the end, the incident was a forceful reminder that the fundamentals matter. A deep understanding of how the database works isn’t just for DBAs; it’s a critical skill for any engineer who wants to build resilient and performant applications.
