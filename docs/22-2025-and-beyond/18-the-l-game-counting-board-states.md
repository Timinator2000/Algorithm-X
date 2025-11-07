# The L-Game: Counting Board States

__Puzzle:__ [The L-Game: Counting Board States](https://www.codingame.com/training/easy/the-l-game-counting-board-states)

__Author:__ [@tcooke](https://www.codingame.com/profile/fa42e54cfaf4fa617af027a58f09a2a59089725)

__Published Difficulty:__ Easy

__Algorithm X Complexity:__ Déjà Vu All Over Again

---

# The Generalized L-Game

If you’ve completed [Polyominoes](../22-2025-and-beyond/06-polyominoes.md), you’re already halfway home! You can reuse almost all of that code here — we’re simply changing the shapes and adding a twist. Instead of a whole zoo of polyominoes, we only care about **two L-shaped pieces** (one red, one blue) plus a few 1×1 blockers.

---

# Puzzle Overview

The original **L-Game**, created by Edward de Bono, is played on a 4×4 grid with two Ls and two small neutral blocks. Players take turns moving, but we’ll skip the gameplay and focus on the core idea:

> How many different ways can two L-shaped pieces (and some number of blockers) fit on the board at the same time?

It sounds simple — and it is, at first. Algorithm X is a perfect fit for counting possible configurations, but as the board grows, the number of combinations explodes. On larger grids, the puzzle’s time limit quickly becomes your biggest challenge.

---

# Combinatorics to the Rescue

**Combinatorics** is the math of counting possibilities — figuring out *how many ways* something can happen without listing every option. Once you’ve set up Algorithm X, the trick is to use combinatorial reasoning to lighten its workload. For example, when both Ls are placed, the remaining N blockers can occupy any combination of the empty cells, which can be counted with the familiar **n choose k** formula.

To solve all test cases within the time limit, you’ll need some well-designed combinatorics to bridge the gap between brute-force enumeration and pure math.

Good luck!


<BR>