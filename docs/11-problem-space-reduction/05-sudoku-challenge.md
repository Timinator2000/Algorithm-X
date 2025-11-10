# This Will Be Important Later

You may have already finished all the Sudoku puzzles without any problem-space reduction. I strongly suggest you consider following through with what I'm about to propose and the reason is because of [Killer Sudoku Solver](../14-your-turn/01-killer-sudoku.md) and [Killer Sudoku Extreme Challenge](../14-your-turn/03-killer-sudoku-extreme.md). 100% of any effort you put forward on this exercise will benefit you when you solve the Killer Sudoku puzzles, which begin with all the same rules as Sudoku and then add a few details you can tackle later.

---

# Initial Challenge - Lone Singles

My initial challenge is for you to implement the reduction technique covered in the previous pages. On the website [Learn-Sudoku.com](https://learn-sudoku.com), this technique is referred to as [Lone Singles](https://learn-sudoku.com/lone-singles.html). For any cell that has been reduced to a single candidate, that value may be removed from the candidate lists of all other cells in the same groups. With just this one reduction technique, you can achieve the following results on each of the [CodinGame](https://www.codingame.com/) Sudoku puzzles...without any backtracking.

| Puzzle | Results                                |
|:--|:------------------------------------------------------------------|
|[Sudoku Solver](https://www.codingame.com/training/medium/sudoku-solver)|<span style="color:green">✅ Test Case 1: Very Easy</span><BR><span style="color:red">❌ Test Case 2: Easy - Oh, so close!<BR>❌ Test Case 3: Intermediate/Hard - Minimal reduction.<BR>❌ Test Case 4: World's Hardest Sudoku - No reduction at all.</span>|
|[16x16 Sudoku](https://www.codingame.com/training/medium/16x16-sudoku)|<span style="color:green">✅ Test Case 1: Test 1<BR>✅ Test Case 2: Test 2</span><BR><span style="color:red">❌ Test Case 3: Test 3 - Minimal reduction.<BR>❌ Test Case 4: Test 4 - Minimal reduction.<BR>❌ Test Case 5: Test 5 - Minimal reduction.<BR>❌ Test Case 6: Test 6 - Minimal reduction.</span>|
|[25x25 Sudoku](https://www.codingame.com/training/expert/25x25-sudoku)|<span style="color:red">❌ Test Case 1: Test 1 - 77 more cells found.<BR>❌ Test Case 2: Test 2 - Minimal reduction.<BR>❌ Test Case 3: Test 3 - Minimal reduction.<BR>❌ Test Case 4: Test 4 - Minimal reduction.<BR>❌ Test Case 5: Test 5 - Minimal reduction.</span>|
|[Mini Sudoku Solver](https://www.codingame.com/training/hard/mini-sudoku-solver)|<span style="color:green">✅ Test Case 1: Test 1<BR>✅ Test Case 2: Test 2<BR>✅ Test Case 3: Test 3<BR>✅ Test Case 4: Test 4</span>|

---

# Level 2 Challenge - Hidden Singles

Going back to [Learn-Sudoku.com](https://learn-sudoku.com), let's add another fairly easy technique, [Hidden Singles](https://learn-sudoku.com/hidden-singles.html). A hidden single is a cell in a group that has one candidate that does not appear in the candidate list of any other cell in the group. Because this candidate only appears in a single cell in the group, it is known where the candidate belongs. Adding this one additional basic technique will improve your results.

| Puzzle | Results                                |
|:--|:------------------------------------------------------------------|
|[Sudoku Solver](https://www.codingame.com/training/medium/sudoku-solver)|<span style="color:green">✅ Test Case 1: Very Easy<BR>✅ Test Case 2: Easy<BR></span><span style="color:red">❌ Test Case 3: Intermediate/Hard - 12 more cells found.<BR>❌ Test Case 4: World's Hardest Sudoku - No reduction at all.</span>|
|[16x16 Sudoku](https://www.codingame.com/training/medium/16x16-sudoku)|<span style="color:green">✅ Test Case 1: Test 1<BR>✅ Test Case 2: Test 2</span><BR><span style="color:red">❌ Test Case 3: Test 3 - 49 more cells found.<BR>❌ Test Case 4: Test 4 - 14 more cells found.<BR>❌ Test Case 5: Test 5 - 41 more cells found.<BR>❌ Test Case 6: Test 6 - 56 more cells found.</span>|
|[25x25 Sudoku](https://www.codingame.com/training/expert/25x25-sudoku)|<span style="color:green">✅ Test Case 1: Test 1</span><BR><span style="color:red">❌ Test Case 2: Test 2 - 56 more cells found.<BR>❌ Test Case 3: Test 3 - 68 more cells found.<BR>❌ Test Case 4: Test 4 - 58 more cells found.<BR>❌ Test Case 5: Test 5 - 66 more cells found.</span>|
|[Mini Sudoku Solver](https://www.codingame.com/training/hard/mini-sudoku-solver)|<span style="color:green">✅ Test Case 1: Test 1<BR>✅ Test Case 2: Test 2<BR>✅ Test Case 3: Test 3<BR>✅ Test Case 4: Test 4</span>|

---

# Ultimate Sudoku Logic Challenge

[Learn-Sudoku.com](https://learn-sudoku.com) has several more reduction strategies. Can you implement enough to solve __every__ traditional Sudoku puzzle with logic alone? I will keep my own progress updated in a table at the end of this playground. If you take on this challenge, I do have one suggestion for your data structure. I have found it helpful if each cell has pointers to the groups to which it belongs. Conceptually, the object model has one small addition shown below.

<BR>

![Sudoku Data Structure](SudokuDataStructure2.png){ class="center-image" }

<BR>

As the `SudokuGroup`s are being filled with `SudokuCell`s, it is easy enough to give each cell 3 pointers, one to each of the groups where it is a member. I have used a named tuple to hold these three pointers. In the constructor, the new `groups` attribute is initialized to `None`.

```python
CellGroups = namedtuple('CellGroups', 'row col box')

class SudokuCell():

    def __init__(self, value: str, all_possible_values: str):
        self.value = value
        self.candidates = set(all_possible_values) if value == UNKNOWN else {value}
        self.groups = CellGroups(None, None, None)
```

As the groups are being built in the `SudokuSolver` constructor, give each cell a tuple of pointers to the groups to which it belongs.

```python
        for row in range(size):
            for col in range(size):
                box = row // box_size * box_size + col // box_size
                cell = self.grid[(row, col)]

                rows[row].cells.append(cell)
                cols[col].cells.append(cell)
                boxes[box].cells.append(cell)

                cell.groups = CellGroups(rows[row], cols[col], boxes[box])
```

---

# Solving Logic Puzzles Logically

Many __Sudoku__ puzzles can be solved without making any guesses. Click [here](../24-odds-and-ends/01-solving-with-logic-only.md) to see my progress toward solving as many logic puzzles as possible, strictly with logic, no guessing and no backtracking.

<BR>