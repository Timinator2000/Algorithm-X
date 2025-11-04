# Nurikabe

__Puzzle:__ [Nurikabe](https://www.codingame.com/training/expert/nurikabe)

__Author:__ [@Djoums](https://www.codingame.com/profile/f0b5a892e52b5ec167931b7bdf52eb982136521)

__Published Difficulty:__ Very Hard

__Algorithm X Complexity:__ Problem-Space Reduction is Another Zombie Apocalypse

---

This is a hard puzzle. No matter how much I explain below, it will remain a tough challenge. The problem-space reduction required to solve larger grids is intense — and that’s exactly what makes Nurikabe so satisfying.

---

# Overview

Consider this paragraph from the problem statement:

> You start with a grid representing an island group seen from above. Your goal is to identify the shape of each island and fill the remaining cells with water. Clues are provided as numbers, each representing the size of a distinct island. Diagonal connections do not count in Nurikabe, so each island must occupy the exact number of contiguous cells. Additional rules for water apply (see formal rules below).

Each number must correspond to an island of that exact size. This is similar to [Shikaku](../06-your-turn/01-shikaku-solver.md), except islands can take any shape, not just rectangles. Additionally:

> All islands are isolated from each other horizontally and vertically.

This is reminiscent of [Battleship Solitaire](../22-2025-and-beyond/15-battleship-solitaire.md), where ships cannot touch. The difference is that in Nurikabe, islands *can* touch diagonally.

If you haven’t already, consider finishing [Shikaku Solver](../06-your-turn/01-shikaku-solver.md) and [Battleship Solitaire](../22-2025-and-beyond/15-battleship-solitaire.md) first. Both require key concepts you’ll need for Nurikabe, particularly in handling island placements.

---

# Setting Up Algorithm X

Like Shikaku, you need an exhaustive list of possible configurations for each island. Unlike Shikaku’s rectangles, island shapes can vary, which makes this slightly more challenging but manageable. Like Battleship Solitaire, you must consider all combinations of island placements and enforce mutual exclusivity — islands cannot touch horizontally or vertically.

Requirements for Algorithm X are straightforward:

* Each island must be placed somewhere on the grid.

* Each cell can belong to at most one island.

I recommend **getting Algorithm X started without any problem-space reduction**. Don’t overthink the grid yet — just enumerate all possible island configurations and identify mutually exclusive configurations.

Two additional puzzle rules must also be enforced:

> * There cannot be any 2x2 (or larger) blocks of water.
> * All water cells must form a [contiguous] shape (diagonals do not count).

These rules can be enforced by overriding the `AlgorithmXSolver`’s `_process_solution` method. 

For the data below, I configured Algorithm X to perform an **exhaustive search** instead of stopping at the first solution. At this stage, collecting comprehensive data is more important than gaining a small speed boost. For each candidate solution, I check for **both 2x2 water violations and contiguous water violations**, rather than halting on the first rule broken. This approach ensures that all potential issues are captured across every possible solution.

| Test Case | Actions | `me_reqs` | Solutions Checked | ❌ 2x2 | ❌ Water | Time (ms) |
| :-------: | :-----: | :---------------: | :---------------: | :---: | :----------------: | :-------: |
|   Test 1  |    53   |        334        |         20        |   19  |         19         |     <span style="color:green">2</span>     |
|   Test 2  |   190   |        503        |        183        |  155  |         172        |     <span style="color:green">13</span>    |
|   Test 3  |   185   |       3,291       |         5         |   3   |          4         |     <span style="color:green">23</span>    |
|   Test 4  |  2,047  |      848,621      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 5  |  ?      |         ?         |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 6  |  ?      |         ?         |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 7  |  ?      |         ?         |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 8  |  1,685  |       53,103      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 9  |  ?      |         ?         |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|  Test 10  |  5,576  |     1,032,414     |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|  Test 11  |  1,497  |       59,519      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |

---

# Initial Logic

The website [Conceptis Puzzles](https://www.conceptispuzzles.com/index.aspx?uri=puzzle/nurikabe/techniques) organizes Nurikabe solving techniques into three categories: **starting techniques**, **basic techniques**, and **advanced techniques**.

Initially, we will use only the three *starting techniques* to perform a small amount of problem-space reduction:

1. **Single-cell islands:** Any island of size 1 must be completely surrounded by water.

2. **Separating islands:** Any cell that separates two numbered island clues must be water, since islands cannot touch horizontally or vertically.

3. **Diagonal neighbors:** For any two island clues that touch diagonally, their shared neighboring cells must be water.

These simple deductions already shrink the problem space noticeably. The table below summarizes their impact on each test case:

| Test Case | Actions | `me_reqs` | Solutions Checked | ❌ 2x2 | ❌ Water | Time (ms) |
| :-------: | :-----: | :---------------: | :---------------: | :---: | :----------------: | :-------: |
|   Test 1  |    20   |         20        |         20        |   19  |         19         |     <span style="color:green">1</span>     |
|   Test 2  |   127   |        364        |        183        |  155  |         172        |     <span style="color:green">6</span>     |
|   Test 3  |   139   |       1,177       |         5         |   3   |          4         |     <span style="color:green">11</span>    |
|   Test 4  |   990   |      154,341      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 5  |    ?    |         ?         |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 6  |   780   |       44,028      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 7  |    ?    |         ?         |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 8  |   406   |       2,410       |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 9  |  2,820  |      110,041      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|  Test 10  |   803   |       8,617       |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|  Test 11  |   614   |       11,794      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |

---

As the table shows, even applying just these three starting techniques can significantly reduce the problem space for smaller puzzles. Every test case that didn't time out requires far fewer actions and `me_requirement`s compared to the exhaustive search without any logic applied. However, as the grid size and complexity increase, these simple deductions alone are not enough — many larger puzzles still time out. This demonstrates that **early logical pruning is useful but must be combined with more advanced techniques** to make larger Nurikabe puzzles tractable with Algorithm X.

---

# Contiguous Bodies of Land and Water

Contiguous bodies of land and water are a prevalent theme in Nurikabe. As your logic identifies cells that must be water or must belong to certain islands, these cells might **not yet be fully connected** to other cells of the same type. This is easiest to visualize with water: you could have several disconnected groups of water cells that will eventually need to form a single contiguous body.

Conceptually, a `ContiguousBody` (representing either land or water) is made up of one or more `CellGroup`s. Over time, these groups may grow or new groups may be added to the overall `ContiguousBody`. The question then becomes: **when should groups be merged?**

Managing `ContiguousBody`s is a perfect application of the [**set-reduction algorithm**](../17-enforcing-sameness/04-test-your-skills.md) discussed earlier. In this approach, any two `CellGroup`s that are adjacent are merged until no more merges are possible. Here’s an example implementation:

```python
while True:
    new_groups = []
    for group_1 in self.cell_groups:
        for group_2 in new_groups:
            if group_1.adjacent(group_2):
                group_2.merge(group_1)
                break
        else:
            new_groups.append(group_1)

    if len(new_groups) == len(self.cell_groups):
        break

    self.cell_groups = new_groups
```

This code should look **familiar** if you completed either the [“Test Your Skills” exercise](../17-enforcing-sameness/04-test-your-skills.md#test-your-skills) or [Networking](../17-enforcing-sameness/04-test-your-skills.md#a-few-xp-for-your-efforts). The algorithm keeps merging adjacent groups until none of the remaining groups are adjacent.

---

# One Last Piece of Logic

Let’s add one final logical deduction and see how much it can further reduce the problem space. Building on the `CellGroup`s discussed in the previous section, we can implement a simple but effective rule:

* **Single-option expansion:** If a `CellGroup` has **no matching neighbors** and only **one unidentified neighboring cell**, that neighbor must be added to the group.

The reasoning is straightforward: the only way to maintain contiguity is to include that single unknown neighbor.

In the final table below, this rule has been incorporated into the problem-space reduction logic. Keep in mind that this rule is most effective when combined with proper **behind-the-scenes `CellGroup` management**, including merging groups that share borders. Without such group management, the impact of this rule would be limited.

Additionally, all neighbors for any completed island will be labeled as water and completed islands are removed from the problem-space given to Algorithm X.

| Test Case | Actions | `me_reqs` | Solutions Checked | ❌ 2x2 | ❌ Water | Time (ms) |
| :-------: | :-----: | :---------------: | :---------------: | :---: | :----------------: | :-------: |
|   Test 1  |    0    |         0         | <span style="color:green">Solved Logically</span>  |   0   |         0          |     <span style="color:green">1</span>     |
|   Test 2  |   43    |        89         |        115        |  92   |         104        |     <span style="color:green">3</span>     |
|   Test 3  |   32    |        96         |         5         |   3   |          4         |     <span style="color:green">3</span>    |
|   Test 4  |   214   |      9,213        |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 5  |    536  |    17,198         |         144       |   143 |        139         |  <span style="color:green">2000</span>  |
|   Test 6  |   294   |       9,559       |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 7  |    23    |        14        |         17        |   16   |          15         |  <span style="color:green">27</span>  |
|   Test 8  |   280   |       1,104       |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|   Test 9  |   726  |      10,198      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|  Test 10  |   306   |       1,188       |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |
|  Test 11  |   236   |       1,866      |         ?         |   ?   |          ?         |  <span style="color:red">Timeout</span>  |

>Note: Stopping the search after finding the first solution does not prevent timing out on any of the 6 unsolved test cases above.

---

# Final Words

It may feel like a lot of information has been shared, but there’s still plenty of work ahead. More than any other puzzle in this playground, **Nurikabe requires thorough problem-space reduction** to make the grids solvable by Algorithm X within the time limit. Focus on combining logical deductions with efficient `CellGroup` management, and you’ll see much better performance. Good luck!

---

# Solving Logic Puzzles Logically

Many Nurikabe puzzles can be solved without making any guesses. Click [here](../24-odds-and-ends/01-solving-with-logic-only.md) to see my ongoing progress toward solving as many logic puzzles as possible — strictly with reasoning, no guessing, and no backtracking.

<BR>