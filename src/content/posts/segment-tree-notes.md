---
title: "How does a segment tree work?"
description: "Build, query, and update a segment tree for range sums, with diagrams and C++ you can steal."
date: 2022-02-17
category: CP
readTime: 7 min read
tags: ["data-structures", "range-queries"]
---

A segment tree answers range queries — sum, min, max over `[L, R]` — in logarithmic time, with point and range updates to match. Here is the whole idea, bottom up.

## How does a segment tree work?

The array is first of all converted to a full binary tree. If we want the sum of the first 6 elements, we use the marked nodes and add them up.

![Marked nodes covering the first 6 elements](/cp/segment-tree-notes/how.png)

## How much time is taken to build a segment tree?

If we have 16 elements in the array (16 leaves in the binary tree), the level above has 8 nodes. Total nodes: `16 + 8 + 4 + 2 + 1 = 32 - 1`. So roughly $2N$ nodes, and building takes $O(N)$:

```cpp
vector<int> a(n);
for (int &A : a) cin >> A;
while (__builtin_popcount(uint32_t(n)) != 1) ++n;

vector<int> tree(2 * n);
// build the tree
for (int i = 0; i < int(a.size()); ++i) {
    tree[n + i] = a[i];
}
for (int i = n - 1; i >= 1; --i) {
    tree[i] = tree[2 * i] + tree[2 * i + 1];
}
```

## How to answer a query about a range?

For a sum query over `[L, R]`, start from the root and walk down, asking each node for the sum of `[L, R]` inside its range.

**Note:** if some subpart of `[L, R]` is completely present in the range covered by a node, we don't go lower and directly include that value.

![Answering a range query by visiting covering nodes](/cp/segment-tree-notes/queries.png)

Source: [Errichto](https://www.youtube.com/watch?v=2FShdqn-Oz8)

```cpp
int f(int node, int q_lo, int q_hi){
    if(this node is completely within interval [q_lo, q_hi])
        return tree[node]; // tree[i] will contain sum contained in node i
    if(this node is disjoint with interval [q_lo, q_hi])
        return 0;
    return f(left, q_lo, q_hi) +
           f(right, q_lo, q_hi);
}
```

A better version with more details is:

```cpp
int f(int node, int node_lo, int node_hi, int q_lo, int q_hi){
    if(q_lo <= node_lo && node_hi <= q_hi)
        return tree[node];
    if(node_hi < q_lo || q_hi < node_lo)
        return 0; // disjoint
    int last_in_left = (node_lo + node_hi) / 2; // rounded down
    return f(left, node_lo, last_in_left, q_lo, q_hi) +
           f(right, last_in_left + 1, node_hi, q_lo, q_hi);
}

f(ROOT, 0, n - 1, q_lo, q_hi); // n is power of 2 here
```

But what is `left` and `right` here?

![Children of a node in the array layout](/cp/segment-tree-notes/children.png)

For any `x`, its children are `2 * x` and `2 * x + 1`, and the root is `1`. So the code becomes:

```cpp
int f(int node, int node_lo, int node_hi, int q_lo, int q_hi){
    if(q_lo <= node_lo && node_hi <= q_hi)
        return tree[node];
    if(node_hi < q_lo || q_hi < node_lo)
        return 0; // disjoint
    int last_in_left = (node_lo + node_hi) / 2; // rounded down
    return f(2 * node, node_lo, last_in_left, q_lo, q_hi) +
           f(2 * node + 1, last_in_left + 1, node_hi, q_lo, q_hi);
}

f(1, 0, n - 1, q_lo, q_hi); // n is power of 2 here
```

## How to update the tree?

We know that an index `i` sits at `n + i` in `tree[]`. After updating a position, recalculate all its parents. For any `node`, its parent is `node / 2`:

```cpp
// set a[i] = v
void update(int i, int v) {
    tree[n + i] = v;
    for(int j = (n + i) / 2; j >= 1; j /= 2){
        tree[j] = tree[2 * j] + tree[2 * j + 1];
    }
}
```

For the recursive version, do something similar to queries. The complete-overlap condition is met only at the actual position; the disjoint case returns early for nodes that aren't parents. After updating a node, recompute the `tree[]` values on the way back up (post-call area):

```cpp
void update_R(int node, int node_lo, int node_hi, int q_lo, int q_hi, int value) {
    if (q_lo <= node_lo && node_hi <= q_hi) {
        // happens only once when leaf [id, id]
        tree[node] = value;
        return;
    }
    // in disjoint just return
    if (node_hi < q_lo || q_hi < node_lo) return;
    int last_in_left = (node_lo + node_hi) / 2;
    update_R(2 * node, node_lo, last_in_left, q_lo, q_hi, value);
    update_R(2 * node + 1, last_in_left + 1, node_hi, q_lo, q_hi, value);

    // after updating now set, Post Call Area
    tree[node] = tree[2 * node] + tree[2 * node + 1];
};
```

Since the query and update functions look almost the same, you can merge them into one super function that does both based on a `value` parameter.

## How much time does a query take?

![Query path through the tree for range [3, 14]](/cp/segment-tree-notes/tc.png)

**Note:** for a query on range [3, 14], the path from root to 14 (marked green) is the farthest we travel; for the subranges we need at most 1 step to get [8, 11] and [12, 13] (marked yellow).

The same thing happens on both sides, so the time complexity is $O(2 \cdot \log(N) \cdot 2)$ (the last 2 is because we visit 1 extra child on the way).

## How to update a range and do point queries?

![Range update by touching covering parents](/cp/segment-tree-notes/range_update.png)

When updating a range, just update the parents that contain complete ranges; when querying, add up all the answers along the path from the node to the root:

```cpp
vector<int> tree(2 * n);
// build the tree
for (int i = 0; i < int(a.size()); ++i) tree[n + i] = a[i];

//! as i dont want to compute sums of the complete ranges, i just want to update them when i want
// for (int i = n - 1; i >= 1; --i)
//     tree[i] = tree[2 * i] + tree[2 * i + 1];

auto query = [&](const auto &self, int node, int node_lo, int node_hi, int q_lo, int q_hi) -> int {
    if (q_lo <= node_lo && node_hi <= q_hi)
        return tree[node];
    if (node_hi < q_lo || q_hi < node_lo)
        return 0;
    int last_in_left = (node_lo + node_hi) / 2;
    int res = self(self, 2 * node, node_lo, last_in_left, q_lo, q_hi) +
              self(self, 2 * node + 1, last_in_left + 1, node_hi, q_lo, q_hi);
    return res + tree[node];  //! tree[node] as i ask my parents and add my own value
};

auto update_R = [&](const auto &self, int node, int node_lo, int node_hi, int q_lo, int q_hi, int value) -> void {
    if (q_lo <= node_lo && node_hi <= q_hi) {
        tree[node] += value;
        return;
    }
    // in disjoint just return
    if (node_hi < q_lo || q_hi < node_lo) return;
    int last_in_left = (node_lo + node_hi) / 2;
    self(self, 2 * node, node_lo, last_in_left, q_lo, q_hi, value);
    self(self, 2 * node + 1, last_in_left + 1, node_hi, q_lo, q_hi, value);
};
```

Hard question: [SPOJ GSS3](https://www.youtube.com/live/adNuHe1Z0cE?feature=share&t=1223).
