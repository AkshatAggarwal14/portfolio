---
title: "How does centroid decomposition work?"
description: "Divide and conquer on trees: centroids, centroid trees, and path queries."
date: 2022-06-26
category: CP
readTime: 6 min read
tags: ["dsa"]
---

## Centroid

The centroid is the node that, when removed, minimizes the size of the largest component formed.

![Centroid of a tree](/cp/centroid-decomposition/centroid.png)

Let $s(v)$ be the subtree size for each node $v$.

- $s(v) = 1$, if `v` is a leaf.
- $s(v) = 1 + \sum_{x \in children} s(x)$, otherwise.

So the centroid is the node with the minimum value of the maximum over all subtree sizes and the leftover parent tree, i.e.

$ans = \min(ans, \max(n - \sum s(x) - 1, s(i)~\text{for each subtree}))$.

The centroid is the node which minimizes $ans$.

### Properties

1. A tree has at most 2 centroids. And if there are two, they must be adjacent.
2. Removing a centroid divides the tree into components of size $\leq \lfloor n / 2 \rfloor$.

> This is why centroid decomposition works. Just like binary search halves an array, a centroid splits a tree into subtrees of less than half the size.

> So divide and conquer on trees uses centroid decomposition. Other similar DnC techniques are merge sort and binary search.

> A tree can be decomposed into a centroid tree by recursively finding centroids of subtrees, and this can be used to solve path queries with precomputation and LCA.

---

## Divide and conquer on trees

Since centroid decomposition divides trees into components of at most $n / 2$, the worst case is $O(n \log(n))$ — though in practice some time is saved, as we don't always split into exactly 2 subtrees.

- [Question](https://codeforces.com/contest/342/problem/E)
- [Tutorial 1](https://medium.com/carpanese/an-illustrated-introduction-to-centroid-decomposition-8c1989d53308)
- [Tutorial 2](https://codeforces.com/blog/entry/81661)
- [Tutorial 3 — best](https://www.youtube.com/watch?v=3pk02p1-weU)

### Pattern

1. Solve the problem for all paths going through some node.
2. Remove the node.
3. Solve the remaining subproblems.

---

## Yin Yang paths (simpler)

Given a tree $T$ with $N$ nodes, some edges black and the rest white: count the number of balanced paths.

$N(\text{Yin}) = N(\text{Yang})$.

Solution:

1. Count paths through the centroid.
2. Remove the centroid.
3. Solve for the subproblems.

> There can be at most $(n/2)^2$ balanced paths: imagine a star-shaped graph with $n/2$ black edges and the rest white — we need to count paths through the centroid quickly.
