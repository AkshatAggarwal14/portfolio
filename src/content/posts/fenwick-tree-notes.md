---
title: "Why do we need Fenwick trees?"
description: "Prefix sums with point updates in O(log n): how the Binary Indexed Tree earns its keep."
date: 2022-06-19
category: CP
readTime: 5 min read
tags: ["dsa"]
---

## Why are Fenwick trees / Binary Indexed Trees (BITs) needed?

Plain prefix sums have $O(1)$ query time but $O(n)$ recompute time on every update. A BIT fixes the update side. Segment trees can do the same operations, but a BIT is easier to code and faster.

- An element $i$ in the BIT is responsible for a number of elements equal to $(1$ `<<` $lowestSetBit(i))$.

![Responsibility ranges in a Fenwick tree](/cp/fenwick-tree-notes/range.png)

## How to compute prefix sums?

> 1. Take what you are responsible for.
> 2. Staircase down.

![Staircasing down to accumulate a prefix sum](/cp/fenwick-tree-notes/how.png)

To staircase down, just remove the lowest set bit. Example:

```
1-based: 1011 -> 1010 -> 1000
          [1] -> [4] -> [8]
```

Adding all these values gives the prefix sum for $1011_{2}$ or $11_{10}$.

> 3. The runtime depends on the number of bits, so in the worst case a query costs $O(\log(n))$ — there are at most $\log(n)$ bits in $n$.

## How to update?

![Cells owning an index, found by drawing a straight line](/cp/fenwick-tree-notes/line.png)

> 1. To update an index, you must update all cells that own it.

For a given index, find which cells to update by drawing a straight line in the representation above.

- The BIT elements that need updating are all bits that are not set in the given index. Example:

```
1-based:
01001 -> 01000
 (9)
- --
[01010, 01100, 10000]
 - --   - --   - --
 (10)    (12)    (16)

0-based:
9 is at 1000
1000 -> 1001 -> 1011 -> 1111
 (9)    (10)    (12)    (16)
```

> 2. Move by adding the lowest set bit to the current index with 1-based indexing. With 0-based indexing, move by setting the lowest unset bit, via $x = x$ `|` $x + 1$.
> 3. Also runs in $O(\log(n))$.

Example: $01001$ `->` $01010$ `->` $01100$ `->` $10000$.

## How to find the lowest set bit?

Use bitwise `AND`: $i$ `&` $(-i)$.

## Snippet

```cpp
template <class T>
class BIT {
   public:
    vector<T> tree;
    int n;

    BIT(int _n) : n(_n + 1) { tree.resize(n); }
    BIT(const vector<T> &a) : BIT(int(a.size()) + 1) {
        for (int i = 0; i < int(a.size()); ++i) add(i, a[i]);
    }

    void add(int i, T delta) {
        ++i;
        while (i < n) {
            tree[i] += delta;
            i += (i & -i);
        }
    }

    T get(int i) {
        ++i;
        assert(i >= 1 && i <= _n);
        T sum{};
        while (i > 0) {
            sum += tree[i];
            i -= (i & -i);
        }
        return sum;
    }
    T get(int l, int r) { return get(r + 1) - get(l); }
};
```

## Backwards BIT

- Range updates — add a given value to an entire range.
- Point query — query the value at a given index.

This can be done with normal BIT operations:

- A range update over $[l, r]$ is `BIT.add(l, delta)` plus `BIT.add(r + 1, -delta)`.
- A point query is `BIT.get(i)`.
