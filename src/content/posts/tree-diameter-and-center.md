---
title: "How do you find the diameter of a tree?"
description: "Tree diameter via two BFS runs, counting diameters, and finding the center — with proofs."
date: 2022-06-25
category: CP
readTime: 8 min read
tags: ["graphs", "trees", "proofs"]
---

## Trees

Trees are connected undirected graphs with:

1. no cycles,
2. or, only unique paths between two vertices,
3. or, $n$ vertices and $n - 1$ edges,
4. or, all edges are bridges.

All of these can be proved using one another — they are equivalent.

---

## [Diameter](https://cses.fi/problemset/task/1131)

### Graph

The diameter is the longest of all shortest paths in a graph.

**How to find it?**

- Use Floyd-Warshall to find all-pairs shortest paths, then take the maximum.
- Time complexity is $O(n^3)$.

### Tree

Since all paths are unique, the answer here is just the longest path.

**How to find it?**

1. BFS from all nodes, and find the largest.
    - Time complexity is $O(n^2)$, since there are $n - 1$ edges and BFS costs $O(V + E)$.
2. Find $h(v)$, the height of node $v$, for all nodes.
    - Use the heights of all nodes to find the length of the diameter, assuming the diameter goes through the current node.
    - Take the maximum of all these answers.
3. Greedy approach:
    - Pick any node, `s`.
    - Run BFS from `s`.
    - Find the furthest node from `s`: `t = furthest(s)`.
    - Run BFS from `t`.
    - Find the furthest node from `t`: `r = furthest(t)`.
    - The diameter is the path from `r` to `t`.

### Q. Why does the greedy method work? **[PROOF]**

Case 1: picked node `s` is on the diameter of the tree.

- First BFS gives one endpoint of the diameter.
- Second BFS gives the other endpoint of the diameter.

Case 2: picked node is not on the diameter.

- Then, to get an endpoint of the diameter, the diameter must be in the deepest subtree if the tree is rooted at `s`.
- Assume the deepest subtree $c_1$ does not contain the diameter.

![Diameter proof: deepest subtree rooted at s](/cp/tree-diameter-and-center/graph.png)

$d(c_1) = d_1$.

Let the diameter be in a subtree $c_i$, with $d(c_i, B) = d_2$. We know that $d_2 \leq d_1$.

Thus, in subtree $c_i$, the diameter can be $2d_2$, whereas in $s$, $d(s) = d_1 + d_2 + 2$. So $d(s) > d(c_i)$ — a contradiction.

***QED***

## Tree = edges of diameter + forest

![Decomposing a tree into diameter edges plus attached forest](/cp/tree-diameter-and-center/structure.png)

In other words, the height of each component with root in the left half of the diameter (i.e., $dist(a, d) < dist(d, b)$) is at most the distance of the component's root from the left end of the diameter.

You can prove the same statement for the right half of the diameter (i.e., $dist(a, d) \geq dist(d, b)$), using that $b$ is the farthest node from $a$.

## [Farthest node for each node — remoteness](https://cses.fi/problemset/task/1132)

For each node $i$, find a node $j$ such that $dist(i, j)$ is maximum.

- Claim: $j = a$ or $j = b$ always works, where $a$ and $b$ are the diameter endpoints.

---

## Center of a tree

- The remoteness of a node is its distance from the furthest node.
- The center is the node with minimum remoteness.

![Centers of a tree](/cp/tree-diameter-and-center/centers.png)

### Theorem

All diameters in `T` must go through the center `c`.

### Proof

Assume the diameter does not go through `c`.

1. Root the tree at `c`.
2. Any subtree of `c` has $d_1$ or $d_1 - 1$ ($d_2$) edges. Thus $d(c) > d(\text{subtree})$: $d(\text{subtree}) = 2d_1$ and $d(c) = 2 + d_1 + d_2$.
3. So `c` must be on the diameter.

***QED***

### Theorem

There are at most $2$ centers in a tree.

---

## Count number of diameters in a tree

![A star-shaped tree with many diameters](/cp/tree-diameter-and-center/star.png)

For a graph of this kind, there are $\binom{n - 1}{2}$ diameters, which is of order $n^2$.

Case 1: tree has 1 center.

- $s_i$ = number of nodes at depth $diameter / 2$ in subtree $i$, with the tree rooted at the center.

![Counting diameters with one center](/cp/tree-diameter-and-center/dia.png)

We have to select 2 nodes — one from a given subtree, the other from any other subtree.

Number of diameters = $\sum_{i=1}^{n}(s_i \cdot \sum_{j=1}^{i-1} s_j)$.

The inner summation can be computed with a running sum, so this is fast.

Case 2: tree has 2 centers.

![Counting diameters with two centers](/cp/tree-diameter-and-center/num_dia.png)

- Number of nodes at maximum depth in $c_1$ × number of nodes at maximum depth in $c_2$.
