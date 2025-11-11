# Algorithm X

To have a conversation about customizing Algorithm X, it is necessary to first understand how Algorithm X works. You are welcome to study a detailed discussion in [Knuth’s The Art of Computer Programming](https://www-cs-faculty.stanford.edu/~knuth/taocp.html) or a well-done summary on [Wikipedia]( https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X). There is little benefit to me repeating that material here.

In the next graphic, I have copied Knuth's algorithm as written on Wikipedia. I strongly recommend you work your way through the step-by-step Algorithm X example provided on Wikipedia to gain an understanding of how Algorithm X processes the matrix rows and columns to find solutions.

<BR>

![Algorithm X](AlgorithmX.png){ class="center-image" }

<BR>

---

# Long Pause

As I move forward with customization options, I will assume you have a reasonable idea how the above algorithm works. I am sure you noticed you can solve a lot of exact cover problems without understanding the details of the algorithm, but if you want to do any customization, you will need a basic understanding of the internal Algorithm X mechanics. I must admit, I went through the example on Wikipedia more times than I can count as I worked my way through the various exact cover puzzles. Take as much time as you need!

---

# What Can Be Customized?

Looking at the algorithm above, Step 2 and Step 3 both involve making a choice. In Step 2, a column is chosen from all yet-to-be-covered columns in the matrix. Once a column is chosen, Step 3 loops through all rows that cover that column and those rows are chosen in some order. In certain situations, __especially when the matrix is large__, these choices can make a meaningful difference.

---

# Always Try This First

You do have some influence over how rows and columns are chosen simply by how you set up the matrix. In the absence of detailed instruction, `AlgorithmXSolver` will choose columns from left to right and rows from top to bottom. In the `AlgorithmXSolver` constructor, the matrix is constructed left-to-right and top-to-bottom to mirror the order in which you built the requirements `list` and the actions `dictionary`.

`AlgorithmXSolver` does not have any detailed instructions for ordering rows, so top-to-bottom is the default. Columns are a bit different. By default, `AlgorithmXSolver` always chooses the column covered by the fewest number of rows. This is referred to as Minimum Remaining Value or MRV. But, what about ties? What if several columns have the same MRV? In what order are those columns tried? Unless instructed otherwise, `AlgorithmXSolver` breaks ties from left to right.

Being careful about how you build your requirements `list` and your actions `dictionary` __is always the easiest way to influence the ordering of choices__ in Steps 2 and 3. It is also the most efficient way to handle sorting of choices as the matrix is built in the order you desire, and sort order is only considered once.

---

# Dynamic Sorting

In rare cases, you might wish to customize the sorting or rows and columns on some criteria that can change as Algorithm X works its way through the matrix. As actions are chosen to be part of the solution, tiles are placed on the gameboard and the state of the gameboard changes. Maybe you wish the state of the gameboard to influence the choice of columns or rows.

As I was learning Algorithm X, I solved a number of puzzles using various versions of dynamic sorting. Now that I have built this playground and developed a much better understanding of Algorithm X, I must admit, I have removed all dynamic sorting from 100% of those puzzles. On several puzzles, I am very careful about how I set up the matrix, but on no puzzles do I use the customization techniques I am about to describe.

This playground covers a lot of material, but it can never cover every possible exact cover problem. Although you may not need these strategies today, it is impossible for me to say you will never need them. 

---

# But, First…

Before I cover how to further customize the selection processes used in Steps 2 and 3, we must first have a short discussion about [Dancing Links (DLX)]( https://en.wikipedia.org/wiki/Dancing_Links) and the DLX implementation used in `AlgorithmXSolver`.

<BR>