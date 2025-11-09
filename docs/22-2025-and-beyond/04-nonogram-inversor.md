# Nonogram Inversor

__Puzzle:__ [Nonogram Inversor](https://www.codingame.com/training/hard/nonogram-inversor)

__Author:__ [@LaurentBouvier](https://www.codingame.com/profile/6061d439c21bc69dacb351d2dae6ccda742965)

__Published Difficulty:__ Hard

__Algorithm X Complexity:__ Quite Challenging

---

# Spoiler Alert

Here I go again with a preemptive spoiler alert. This puzzle might be easier to solve with logic than it is to solve with Algorithm X. However, the Algorithm X solution is wonderfully satisfying if you choose to go down that fairly challenging path.

---

# What I (and others) Tried

From the problem statement:

>In this version, we have only two colors, black and white.

>You will be given the length of all black groups.

For each row and each column, we are given the lengths of each _group_ of contiguous black cells in that row or column. I am going to refer to a group of 1 or more contiguous black cells as a _segment_. Each segment must be separated by 1 or more white cells. Because there is no difference between a row of cells and a column of cells, I will use the word _line_ to generically refer to either a row or a column. Each line has some number of cells and zero or more segments. 

Consider a 5 x 5 Nonogram. My initial thought was to have a 5 x 5 gameboard and then determine all possible layouts for each line. All lines must be covered by a pattern. The various patterns for each line are the tiles that get placed on the gameboard. Because horizontal lines and vertical lines intersect, I considered using coloring or significant numbers of `me_requirements` to ensure incompatible lines were not placed in the same solution.

Using this approach, I was able to solve __Test Cases 1 and 2__, but I timed out on the remaining test cases. There can be many possible patterns for a line that has multiple segments and there can be many combinations of horizontal and vertical lines that are incompatible. I needed my solution to be significantly faster, so I turned to problem-space reduction.

Once you go down the road of problem-space reduction on this puzzle, it doesn’t take long to find solutions strictly using logic. With a solution in hand, you might wonder why anyone would continue banging his or her head against the wall searching for the Algorithm X solution. Maybe you enjoy the challenge, or maybe you just embrace the pain. Either way... 

__On the next page, I will go through how I built an Algorithm X solution to this puzzle.__

If you enjoy Nonograms, [@5DN1L](https://www.codingame.com/profile/bbb8f47ea4601179303c20acdbf5fb6c1904782) turned me on to 3 more Nonogram puzzles on [Codewars](https://www.codewars.com) with increasing levels of difficulty:

---

# 5x5 Nonogram Solver

__Kata:__ [5x5 Nonogram Solver](https://www.codewars.com/kata/5a479247e6be385a41000064)

__Sensei:__ [@Avanta](https://www.codewars.com/users/Avanta)

__Published Difficulty:__ [4 kyu](https://docs.codewars.com/gamification/ranks)

Solving this first puzzle is slightly easier than CodinGame's Nonogram Inversor. As a doctor once said to my wife in his thick Eastern-European accent, "Don't worry, it will get worse."

---

# 15x15 Nonogram Solver

__Kata:__ [15x15 Nonogram Solver](https://www.codewars.com/kata/5a5072a6145c46568800004d)

__Sensei:__ [@Bubbler](https://www.codewars.com/users/Bubbler)

__Published Difficulty:__ [2 kyu](https://docs.codewars.com/gamification/ranks)

In this puzzle, you must solve 103 Nonograms in 12 seconds (Python). My original logic-based solution needed significant optimization to pass all the test cases without timing out.

---

# Multisize Nonogram Solver

__Kata:__ [Multisize Nonogram Solver](https://www.codewars.com/kata/5a5519858803853691000069)

__Sensei:__ [@Avanta](https://www.codewars.com/users/Avanta)

__Published Difficulty:__ [1 kyu](https://docs.codewars.com/gamification/ranks)

I have not solved this puzzle yet. There are 60 random tests and I am only getting through the first half of those tests before timing out. I definitely need a faster approach, but the following line from the problem statement makes me wonder if I will eventually need a combination of logic and Algorithm X:

>I highly recommend not to try and use a brute force solution as some of the grids are very big. Also, you may not be able to solve all the grids by deduction alone so may have to guess one or two squares. :P

As for a better algorithm, Donald Knuth has something to say about that! (credit again goes to @5DN1L for finding this material). Are Binary Decision Diagrams (BDDs and ZDDs) possibly what we need? I don't know the answer to that, but here are a few links that might lead you to some answers:

[Ben Lynn - BDDs, ZDDs, Nonograms, etc.](https://crypto.stanford.edu/pbc/notes/zdd/)

<BR>

{{ youtube("SQE21efsf7Y", "Fun With Binary Decision Diagrams (BDDs) (June 5, 2008)") }}

<BR>

{{ youtube("-HzQYeqS9Wc", "Fun With Zero-Suppressed Binary Decision Diagrams (ZDDs) (2008)") }}

<BR>