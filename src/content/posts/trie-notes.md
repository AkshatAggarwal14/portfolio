---
title: "What is a trie, and why use one?"
description: "Prefix trees for autocomplete, spellcheck, and xor queries — structure, tradeoffs, and Codeforces problems."
date: 2022-07-16
category: CP
readTime: 6 min read
tags: ["data-structures", "strings"]
---

## What is a trie?

A trie is a tree-based structure for storing collections of strings. The word comes from *re**TRIE**val* — to find or get something back.

_It can also store numbers as binary (or [decimal](#range-query-trie)) strings._

Strings sharing a prefix share ancestors in the trie. That makes tries efficient for storing many strings and searching them — including prefix search, which hash tables can't do.

## Why use a trie?

- **Prefix search**: impossible with a hash table, natural in a trie.
- **No collisions**: better worst-case complexity than a poorly implemented hash table.
- **No hash functions** involved at all.
- **Search in $O(k)$**, where $k$ is the query length — sometimes less, when the query is absent.

## Structure of a trie

Like a tree: a root node branching into children over multiple edges. Each `TrieNode` holds an array of child pointers, one index per character. Each node represents a string; each edge a character; the root is the empty string.

Every level represents prefixes of a given length: root (level 0) is the empty prefix, level 1 is prefixes of length 1, and so on. Strings sit sorted lexicographically left to right — which becomes clear when implementing insert.

## Real-world applications

1. **Autocomplete** — type a prefix, get suggestions sharing it. The shared ancestors make this efficient; rank suggestions below them by popularity.
2. **Spell checkers** — check dictionary membership; on miss, suggest nearby words, optionally popularity-sorted.
3. **String matching** — match a pattern against a collection of strings.

## Disadvantage

Memory. Each node carries a child-pointer array plus extras (like the `wordEndCnt` in my `TrieNode`), so tries are heavier than alternatives per string stored.

## Range query trie

My go-to advanced use: binary tries for xor range queries. Solved problems live in [`Qs/`](https://github.com/AkshatAggarwal14/Competitive-Programming/tree/master/Learning/Trie/Qs):

1. Maximum xor subarray.
2. Count subarrays with xor less than `k` — [tutorial](https://threadsiiithyderabad.quora.com/Tutorial-on-Trie-and-example-problems).
3. Minimum `K` with at least `X` subarrays of xor at most `K`.
4. Count pairs with xor in a range.

Idea credit: `theabbie` on Codeforces, plus [this](https://codeforces.com/blog/entry/17658?#comment-378429) and [this](https://codeforces.com/blog/entry/104650) discussion. Related reading: wavelet trees ([1](http://rachitiitr.blogspot.com/2017/06/wavelet-trees-wavelet-trees-editorial.html), [2](https://codeforces.com/blog/entry/52854)) and [sparse segtrees](https://codeforces.com/blog/entry/83969) ([USACO guide](https://usaco.guide/plat/sparse-segtree?lang=cpp)).
