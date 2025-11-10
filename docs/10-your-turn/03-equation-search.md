# Equation Search

__Puzzle:__ [Equation Search](https://www.codingame.com/training/medium/equation-search)

__Author:__ [@Timinator](https://www.codingame.com/profile/2df7157da821f39bbf6b36efae1568142907334)

__Published Difficulty:__ Medium

__Algorithm X Complexity:__ Specifically Designed to Test What You Have Learned So Far

---

# Strategy

An important part to creating an Algorithm X solution for Equation Search is coming up with a gameboard/tiles analogy. What does the gameboard look like? It is tempting to make every operand and every operator a tile. The gameboard would be made up of several equations, each equation having 3 spots for 2 operands and 1 operator. Given right sides of 5, 7 and 10, the gameboard might look like:

<BR>

![Initial Gameboard](Gameboard1.png){ class="center-image" }

<BR>

As tiles are put on the gameboard, some sort of validation is needed to see if there is a way to put the operands and the operator together to come up with the right-side value. This feels a bit like making tiles in [Winamax](../08-your-turn/06-winamax.md) correspond to every cell in the grid. With Winamax, it ultimately was better to build routes and consider each possible route a tile that could be placed on the gameboard as a whole. A similar approach will work better here.

Let’s make the gameboard nothing more than a list of right-side values.

<BR>

![Simplified Gameboard](Gameboard2.png){ class="center-image" }

<BR>

Using the strategy we know worked for Winamax, we can make each tile here a full equation, including the right-side value. The goal becomes to place the appropriate equation tiles on the matching right-side values found on the gameboard.

??? question "How many requirements are satisfied every time you put an equation on the gameboard?"
    <div class="quiz" data-id="equation_search_quiz1"></div>

Putting a single equation tile on the gameboard covers one of the right-side numbers and it covers one of the necessary occurrences for each operand. Of course, if the operands are the same, it covers two of the necessary occurrences for that operand. Let’s look at an example.

**Assume you have operand counts of one 2 and three 5s:**

??? question "How many different ways are there to create an equation that equals 10?"
    <div class="quiz" data-id="equation_search_quiz2"></div>

Remember, because of the multiplicity, you can use the first 5, the second 5 or the third 5. The possible equations, depicted as tiles to put on the gameboard, look like this:

<BR>

![Ways to Make 10](WaysToMake10.png){ class="center-image" }

<BR>

There is a fair amount of multiplicity in this puzzle and to solve the bigger test cases, you will need to properly use `AlgorithmXSolver`’s memory. Without proper use of memory, you will generate a lot more solutions than necessary.

| Test Case | Distinct Solutions     | Solutions Found if Duplicates Not Avoided |
|:--|:----:|:------------------------------------------------------------------:|
|4 - 6 Equations, 1 Solution|1|72|
|5 - 6 Equations, Multiple Solutions|3|96|
|6 - 10 Equations, 1 Solution|1|69,120|
|7 - 10 Equations, Multiple Solutions|31|445,824|
|8 - 13 Equations|227|I stopped counting at 250,000,000.|
|9 - 14 Equations|674|?|
|10 - 15 Equations, 1 Solution|1|?|
|11 - 15 Equations, Multiple Solutions|2898|?|
|12 - So Many Solutions|4059|?|

---

# Setting Up Algorithm X

The requirements for this puzzle are straightforward multiplicity. Each operand needs to occur a certain number of times. Successfully solving this problem will require good answers to these questions:

* What are the individual action steps you can use to build a solution?
  
* When setting up the memory, what is it you want Algorithm X to remember?

<BR>