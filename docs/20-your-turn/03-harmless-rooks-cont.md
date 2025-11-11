# Harmless Rooks (cont.)

Harmless Rooks fits the same cells and groups model used on many of the previous puzzles. Each open `Square` on the board has a relationship with exactly 2  `AttackLine`s and each `AttackLine` has a relationship with 1 or more `Square`s.

<BR>

![Harmless Rooks Classes](HarmlessRooksClasses.png){ class="center-image" }

<BR>

A `Square` is uniquely identified by its `row` and `col`, but it is a bit more challenging to uniquely identify an `AttackLine`. In the class diagram above, I have added an integer `id` for each `AttackLine`. Each class also has a `reduce_()` method as seen in many puzzles before.

---

# Problem-Space Reduction

What does it mean to reduce a `Square` or an `AttackLine`? Somehow, we need to shrink the size of the larger boards by placing rooks logically. Consider the following diagram where three `X` locations isolate a single `Square`:

<BR>

![Rook Placement](RookPlacement.png){ class="center-image" }

<BR>

Obviously, a rook can be placed on the isolated `Square`. Placing a rook in that location does not change what is possible with the rest of the board. Now, consider the following diagram where four `X` locations isolate a group of two `Squares`:

<BR>

![Rook Placement - 2 Isolated Squares](RookPlacement2.png){ class="center-image" }

<BR>

Placing a rook on either `Square` in the isolated area will eliminate 3 `AttackLine`s from the game, the two covered by the rook and the second `AttackLine` covered by the other location that is now ineligible for a rook. In this case, placing a rook on each `Square` does the same amount of _damage_ to the board. Because these two `Square`s are isolated and neither causes more damage than the other, a rook can be placed on either `Square`, eliminating the other `Square` from consideration.

Every time you find a location where a rook can be placed logically, `AttackLine`s and `Square`s are eliminated from future consideration. This process shrinks the size of the problem since Algorithm X only needs to know about `AttackLine`s and `Square`s that must be considered to determine the maximum rook placements going forward.

---

# On to the Puzzle

To solve this puzzle with the Algorithm X implementation discussed in the previous pages, you must figure out ways to place many more rooks logically. We already handicapped Algorithm X by customizing it to be inefficient. The boards it can solve need to be a lot smaller than the large test cases.

---

# Repeat Disclaimer

__I have not properly solved this puzzle. I have two solutions that pass all test cases and all validators. One solution uses a combination of logic and Algorithm X. The other places all rooks logically, leaving no need for Algorithm X. Both solutions will produce the wrong answer for other test cases not included in the puzzle.__

The previous pages outline my still-flawed approach.

<BR>