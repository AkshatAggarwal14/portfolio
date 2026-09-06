---
title: "How does Dijkstra's algorithm work?"
description: "From BFS on weighted graphs to Dijkstra, multisource Dijkstra, cycles, and spanning trees."
date: 2021-10-10
category: CP
readTime: 10 min read
tags: ["dsa"]
---

> Cities connected by flights with a cost per route — minimize the total cost from city A to city B.

![Flight map with route costs](/cp/graph-shortest-paths/dijkstra.png)

> BFS would work here if the graph were unweighted, or if every flight cost the same.

One hack: convert everything to equal weights by inserting extra nodes along edges.

![Splitting weighted edges into unit edges, part 1](/cp/graph-shortest-paths/dj-1.png)

![Splitting weighted edges into unit edges, part 2](/cp/graph-shortest-paths/d-2.png)

Now BFS applies. But there is a problem: long edges. If a weight is $10^9$, we'd add absurdly many nodes — **not** feasible.

> Key observation: nodes with smaller distances get visited first. That observation is the base of Dijkstra's algorithm.

## Algorithm

Just like BFS, but with a `set` (or priority queue) instead of a queue. Push `{distance, node}` into the set.

> Initialize all distances to infinite. Push the source into the set, pop it, do the BFS thing: iterate all children (adjacent vertices); if the new distance is smaller than the recorded one, update it.

## Code (C++)

```cpp
const int INF = 1e9;

// Node and weight
vector<pair<int, int>> v[100005];
int d[100005];  // distance

int main() {
    int n, m;  // vertices, edges
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int x, y, w;
        cin >> x >> y >> w;
        v[x].push_back({y, w});
        v[y].push_back({x, w});
    }
    // initially all nodes at INF distance
    for (int i = 1; i <= n; ++i) d[i] = INF;

    // source is 1.
    d[1] = 0;
    // distance 1st so it is sorted
    set<pair<int, int>> s;  //{distance, node}
    s.insert({0, 1});
    while (!s.empty()) {
        int dis = s.begin()->first;
        int vertex = s.begin()->second;
        s.erase(s.begin());

        for (pair<int, int> x : v[vertex]) {
            int newDis = dis + x.second;
            int newVer = x.first;
            if (newDis < d[newVer]) {
                //! can erase non existent element from set freely
                s.erase({d[newVer], newVer}); // erase old distance
                d[newVer] = newDis;  // update
                s.insert({d[newVer], newVer});
            }
        }
    }

    for (int i = 1; i <= n; ++i) {
        cout << d[i] << ' ';
    }
    return 0;
}
```

The time complexity is `O(nlogm + mlogn)`, but usually `m > n`, so `O(mlogn)`. Each edge pushes into the set (`nlogm` from set operations) and each vertex pops out (`mlogn`).

- Each node visited once.
- Each edge visited twice.

> Storing predecessors with Dijkstra? [Here](https://cp-algorithms.com/graph/dijkstra.html).

### Dry run

![Dijkstra dry run on the flight map](/cp/graph-shortest-paths/dijkstra-dryrun.png)

- After updating children, s = {(100, 4)}
- After updating children, s = {(100, 4), (200, 3)}
- After updating children, s = {(100, 2), (100, 4), (200, 3)}
- Before erasing parent, s = {(100, 2), (100, 4), (200, 3)}
- After updating children, s = {(100, 4), (200, 3), (300, 5)}
- Before erasing parent, s = {(100, 4), (200, 3), (300, 5)}
- Before erasing parent, s = {(200, 3), (300, 5)}
- Before erasing parent, s = {(300, 5)}

Finally, `dis[] = {0, 100, 200, 100, 300}`.

## Multisource Dijkstra

> A city map with traffic: travel time per road. Hospitals are blue, patients yellow — find the nearest hospital for each patient.

![Hospitals and patients on a city map](/cp/graph-shortest-paths/multi-dijkstra.png)

Create a `"Need healthcare"` node, connect all patients to it with weight 0, and run Dijkstra with it as the source for all hospitals. (Equivalently, insert all patients into the set up front.)

## Cyclic and acyclic graphs

If A and B are 2 nodes in a cycle, there are at least 2 paths whose nodes are all unique.

![A cycle in a graph](/cp/graph-shortest-paths/cycle.png)

With no cycles, the path between any 2 nodes is unique. A cycle with `N` vertices has `N` edges.

Important points:

- A tree is a connected acyclic graph.
- A tree with `N` vertices has `N - 1` edges.
- An acyclic graph with many components is a forest — many trees.

## Spanning tree

- A spanning tree connects all vertices with the minimum possible number of edges.
- It is always connected and never contains a cycle.
- It is always a subset of its graph — a disconnected graph can never have one.
- Buildable via BFS/DFS: since visited nodes aren't revisited, the traversal itself generates the spanning (BFS/DFS) tree.
- One graph can have many spanning trees — **not unique**.

### Minimum spanning tree

Defined for weighted graphs: the spanning tree of minimum total weight. Two algorithms: Prim's and Kruskal's.

## Practice questions

A short starter set across the techniques above (starred by difficulty):

- DFS on grid — [CSES 1192](https://cses.fi/problemset/task/1192), [CF 1033A](https://codeforces.com/contest/1033/problem/A)
- Multisource BFS — [CF 1593E](https://codeforces.com/contest/1593/problem/E), [CSES 1194](https://cses.fi/problemset/task/1194)
- Dijkstra — [CSES 1671](https://cses.fi/problemset/task/1671)
- Floyd-Warshall — [CSES 1672](https://cses.fi/problemset/task/1672/)
- Full topic-wise list: [Learning/Graph in my Competitive-Programming repo](https://github.com/AkshatAggarwal14/Competitive-Programming/tree/master/Learning/Graph)

Part 1 of this series: [how to store and traverse a graph](/blogs/graph-representations-and-traversal/).
