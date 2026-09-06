---
title: "How do you win at Nim?"
description: "From one pile to three: winning and losing positions, and the xor rule that decides them all."
date: 2023-07-19
category: CP
readTime: 4 min read
tags: ["math", "game-theory"]
---

Three piles of chips (say 5, 7, 9). Two players alternate, each removing any positive number of chips from a single pile. Whoever takes the last chip wins.

## 1 pile

> The first player removes the whole pile and wins. This is a `winning` position.

## 2 piles

**Case 1:** both piles equal — ***(x, x)***.

> The second player mirrors every move of the first and takes last. So this is a `losing` position.

## 3 piles

- ***(0, x, x)*** is `losing` — equivalent to the 2-pile ***(x, x)*** game.
- ***(0, 0, x)*** is `winning` — equivalent to the 1-pile game.
- ***(x, 1, 1)*** is `winning`, since ***(0, 1, 1)*** is `losing`.
- ***(x, y, y)*** is `winning`, since ***(0, 1, 1)*** is `losing`.

## The punchline: xor decides everything

Look at the pattern: ***(x, x)*** loses, ***(0, x, x)*** loses — in each losing position, the xor of all piles is $0$. And that generalizes:

> A Nim position is `losing` if and only if the xor-sum of all piles is $0$.

Why? From a nonzero xor, you can always move to a zero xor (reduce the pile with the highest differing bit appropriately). From a zero xor, every move breaks it to nonzero. Since the terminal position (all piles empty, xor $0$) loses for the player to move, the player starting from nonzero xor always hands back zero xor — and takes last.

So for (5, 7, 9): $5 \oplus 7 \oplus 9 = 11 \neq 0$ — first player wins.

## Application

1. [The Game of Divisors](https://www.hackerrank.com/contests/codekar-3/challenges/the-game-of-divisors-1/problem)

## Resources

- [Codeforces comment thread on impartial games](https://codeforces.com/blog/entry/66040?#comment-505669)
