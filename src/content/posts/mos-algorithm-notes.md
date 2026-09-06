---
title: "How does Mo's algorithm answer range queries?"
description: "Offline sqrt decomposition for range queries: complexity analysis, the odd-even trick, and Mo's with updates."
date: 2023-04-02
category: CP
readTime: 8 min read
tags: ["dsa"]
---

Learning sources: [cp-algorithms on sqrt decomposition](https://cp-algorithms.com/data_structures/sqrt_decomposition.html), [Mo's with updates](https://www.youtube.com/watch?v=gUpfwVRXhNY).

## What is the time complexity of Mo's algorithm?

Sorting all queries takes $O(Q \cdot \log(Q))$.

**Note:** queries sort as `<[L], R>` — `[L]` is the block containing `L`, `R` is the query's right index.

1. Let block size be $S$. `cur_l` changes by at most $O(S)$ between two queries: $O(SQ)$ calls of `add(cur_l)` / `remove(cur_l)`.
2. Within one block, queries sharing a left block sort by right index, so `cur_r` moves at most $O(N)$ per block. Over all blocks: $O((N/S) \cdot N)$ calls of `add(cur_r)` / `remove(cur_r)$, where $N/S$ is the block count.

With $S \approx \sqrt{n}$, add/remove calls total $O((N+Q) \sqrt{N})$ — complexity $O((N+Q) F \sqrt{N})$, where $O(F)$ is the add/remove cost.

**Note:** minimizing $f(S) = SQ + N^2/S$ by calculus gives $S = N / \sqrt{Q}$. $\sqrt{N}$ also works fine.

## How to improve the runtime of Mo's algorithm?

1. In odd blocks sort right indices ascending, in even blocks descending. This kills the reset where the right pointer jumps from the end back to the start at every block boundary.

    Comparator:

```cpp
bool operator<(const Query &other) const {
    if (l / block_size != other.l / block_size) return l < other.l;
    return ((l / block_size) & 1) ? r < other.r : r > other.r;
}
```

2. Exactly $\sqrt{N}$ isn't always the fastest block size — if $\sqrt{N} = 750$, $700$ or $800$ may win. More importantly, don't compute block size at runtime: make it `const`, since division by constants is well optimized by compilers.

## How does Mo's algorithm with updates work?

Reference: [my SPOJ solution](https://github.com/AkshatAggarwal14/Competitive-Programming/blob/master/Learning/Mos%20Algorithm/Q5-mos-updates.cpp).

The problem adds point updates $a_{pos} = val$ to range queries. Naively redoing/undoing updates per query costs $O(Q \cdot N \cdot \sqrt{Q})$.

With updates, sort queries as `<[L], [R], updatesTillNow>`.

**Note:** the same comparator optimization applies:

```cpp
bool operator<(const Query &other) const {
    if (l / block_size != other.l / block_size)
        return l < other.l;
    if (r / block_size != other.r / block_size)
        return ((l / block_size) & 1) ? r < other.r : r > other.r;
    return (((l / block_size) & 1) ^ ((other.l / block_size) & 1))
                ? updatesTillNow < other.updatesTillNow
                : updatesTillNow > other.updatesTillNow;
}
```

1. Total `cur_l` changes: with $q_i$ queries having $L$ in block $i$, block $i$ contributes $O(q_i \cdot S)$ — total $O(SQ)$.
2. Total `cur_r` changes: $O(SQ)$ within a block, plus $O(N)$ per block transition — total $O(SQ + (N/S)N)$.
3. Total `updatesTillNow` changes: for fixed left and right blocks it ranges freely over $0$ to $Q-1$, so changes = distinct block pairs × $Q$, i.e. $O(Q \cdot (N/S)^2)$.

Total: $O((SQ + N^2/S + QN^2/S^2)F)$. For small $S = 1$ or large $S = N$ the middle term vanishes, leaving $O(SQ + QN^2/S^2)$. Minimizing by calculus: optimal block size $S \approx N^{2/3}$, giving $N/S = N^{1/3}$ blocks.

`PS:` [some source](https://codeforces.com/blog/entry/72690) claims $S = (2 \cdot N^2)^{1/3}$ is best.
