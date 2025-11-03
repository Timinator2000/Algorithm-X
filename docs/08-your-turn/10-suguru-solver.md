# Suguru Solver

__Puzzle:__ [Suguru Solver](https://www.codingame.com/training/medium/suguru-solver)

__Author:__ [@Saur2000](https://www.codingame.com/profile/62bc28921f6a079fc385c6d3ac38a6659876124)

__Published Difficulty:__ Medium

__Algorithm X Complexity:__ Sudoku Times Two

---

# Strategy

From the puzzle description:

> Suguru (also known as Tectonics) is a puzzle game similar to Sudoku.

I am sure you have heard, “The devil is in the details.” Suguru is somewhat similar to Sudoku, but the differences are just enough to make it a surprising challenge. There are no rows, columns or boxes. Instead cells are grouped into cages, which are extremely similar to the various groups in Sudoku. There is just one key difference. Every box, column and row in Sudoku has the same number of cells. In Suguru, every cage can be a different size with between 1 and 6 cells.

Because cages can contain different numbers of cells, the possible values for any cell is determined by the size of the cage. This is a significant change from Sudoku where every cell had the exact same possible values.

Again from the puzzle description:

> Adjacent cells, even diagonally, may never contain the same digit.

The second significant difference in Suguru is the puzzle requirement to make sure neighbor cells, even diagonally, never have the same value. If a `1` is placed in a certain cell, there are between 3 and 8 neighbor cells that must not be covered with a `1`. That sounds like a tremendous amount of mutual exclusivity.

Parsing the grid and setting up Algorithm X will take more effort than Sudoku required, but all test cases and validators can be passed, well within the time limit, with just what you know from the Mrs. Knuth puzzles and the earlier section on Sudoku. Later in the playground, I will revisit Suguru and discuss a few ideas you might use to make your solver significantly faster.

---

# Solving Logic Puzzles Logically

Many Suguru puzzles can be solved without making any guesses. Click [here](../24-odds-and-ends/01-solving-with-logic-only.md) to see my ongoing progress toward solving as many logic puzzles as possible — strictly with reasoning, no guessing, and no backtracking.

<BR>