# Background

In August, 2022, I attempted to solve [Constrained Latin Squares](../04-your-turn/08-constrained-latin-squares.md), a recently published puzzle by [@darkhorse64](https://www.codingame.com/profile/c9ebe76a83b33730956eda0534d6cad86053292) on [CodinGame](https://www.codingame.com/home). I noticed [@5DN1L]( https://www.codingame.com/profile/bbb8f47ea4601179303c20acdbf5fb6c1904782) had, a week earlier, posted a link to [Puzzles solvable by Algorithm X / Dancing Links](https://www.codingame.com/forum/t/puzzles-solvable-by-algorithm-x-dancing-links/196871), a post where he had compiled a list of puzzles on CodinGame he had solved with Algorithm X. I love processes that are repeatable and the idea of using a single algorithm to solve a long list of medium/hard puzzles intrigued me.

For the next 18 months, I worked on @5DN1L’s list, reaching out to him over and over again with questions and ideas. I saw tremendous opportunity for not only a reusable software architecture, but also a repeatable engineering process for solving [Exact Cover](https://en.wikipedia.org/wiki/Exact_cover) problems. Eventually, he suggested I build an Algorithm X playground, and here we are!

I can’t thank @5DN1L enough for all of his guidance, support, ideas, encouragement, questions, answers, poking, prodding, reviewing, etc. This playground is his creation every bit as much as it is mine. His influence has made a permanent mark on who I am and how I approach problems. I am forever grateful.

---

# What is Algorithm X?

[Algorithm X](https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X) is a promise. If you can build a proper model to a particular problem space, Algorithm X promises to find all solutions to that problem space. Papers have been written and projects have been done to demonstrate “how” Algorithm X works. That is not the goal here. Instead, the focus of this exercise is to build expertise in the realm of modeling. The goal is to build models that Algorithm X easily digests and returns solutions. Only a cursory understanding of Algorithm X is required, and the implementation details will barely be covered. Instead, you will be asked to build models of problems and you will have the opportunity to see how well you modeled each problem simply by seeing how easily Algorithm X converts your models into solutions.

---

# What’s in It for You?

A quick Google search will surely bring you to countless implementations of [Algorithm X](https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X), usually solving a 9x9 Sudoku grid using the famous [Dancing Links (DLX)](https://en.wikipedia.org/wiki/Dancing_Links) technique proposed by the brilliant [Donald Knuth](https://www-cs-faculty.stanford.edu/~knuth/). This playground is NOT just another Sudoku demonstration. By the time you finish working your way through this material, you should feel confident solving any [Exact Cover](https://en.wikipedia.org/wiki/Exact_cover) problem you run across, including…

__Exact Cover (Algorithm X Candidate) Puzzles Created for this Playground:__
<BR>[Mrs. Knuth – Part I](../04-your-turn/01-mrs-knuth-part-I.md) (+50 XP)
<BR>[Mrs. Knuth – Part II](../08-your-turn/01-mrs-knuth-part-II.md) (+50 XP)
<BR>[Mrs. Knuth – Part III](../10-your-turn/01-mrs-knuth-part-III.md) (+50 XP)
<BR>[Equation Search](../10-your-turn/03-equation-search.md) (+50 XP)
<BR>[Ye_ An_th_r W_rd Se_rch](../16-your-turn/01-yet-another-word-search.md) (+50 XP)

__Support Puzzles Covered in this Playground__
<BR>[Shikaku Skill Builder](../05-generating-actions/02-shikaku-skill-builder.md) (+50 XP)
<BR>[Networking](../17-enforcing-sameness/04-test-your-skills.md#a-few-xp-for-your-efforts) (+50 XP)

__Great Candidates for Algorithm X:__
<BR>[Sudoku Solver](../04-your-turn/02-9x9-sudoku.md) (+50 XP)
<BR>[16x16 Sudoku](../04-your-turn/05-16x16-sudoku.md) (+50 XP)
<BR>[25x25 Sudoku](../04-your-turn/06-25x25-sudoku.md) (+50 XP)
<BR>[Mini Sudoku Solver](../04-your-turn/07-mini-sudoku-solver.md) (+50 XP)
<BR>[Constrained Latin Squares](../04-your-turn/08-constrained-latin-squares.md) (+50 XP)
<BR>[Literary Alfabet Soupe](../04-your-turn/09-literary-alfabet-soupe.md) (+50 XP)
<BR>[Shikaku Solver](../06-your-turn/01-shikaku-solver.md) (+50 XP)
<BR>[Dominoes Solver](../06-your-turn/02-dominoes-solver.md) (+50 XP)
<BR>[Paving with Bricks](../06-your-turn/03-paving-with-bricks.md) (+50 XP)
<BR>[n Queens](../08-your-turn/02-n-queens.md) (+50 XP)
<BR>[Finish the Eight Queens](../08-your-turn/03-finish-eight-queens.md) (+50 XP)
<BR>[Optimized Coloring](../08-your-turn/04-optimized-coloring.md) (+50 XP)
<BR>[Einstein’s Riddle Solver](../08-your-turn/05-einstein-riddle.md) (+50 XP)
<BR>[Winamax](../08-your-turn/06-winamax.md) (+250 XP) 🚀🚀🚀
<BR>[Three Little Piggies](../08-your-turn/07-three-little-piggies.md) (+50 XP)
<BR>[Breaking Bifid](../08-your-turn/08-breaking-bifid.md) (+50 XP)
<BR>[Futoshiki Solver](../08-your-turn/09-futoshiki-solver.md) (+50 XP)
<BR>[Suguru Solver](../08-your-turn/10-suguru-solver.md) (+50 XP)
<BR>[Dumbbells Solver](../10-your-turn/02-dumbbells-solver.md) (+50 XP)
<BR>[Hitori Solver](../10-your-turn/04-hitori-solver.md) (+50 XP)
<BR>[🎮 There Is No Spoon – Episode 2](../10-your-turn/05-no-spoon-2.md) (+250 XP) 🚀🚀🚀
<BR>[Takuzu Solver](../12-your-turn/05-takuzu-solver.md) (+50 XP)
<BR>[High-Rise Buildings](../13-steering-algorithm-x/02-high-rise-buildings.md) (+50 XP)
<BR>[Killer Sudoku Solver](../14-your-turn/01-killer-sudoku.md) (+50 XP)
<BR>[Kakuro Solver](../14-your-turn/02-kakuro-solver.md) (+50 XP)
<BR>[Killer Sudoku Extreme Challenge](../14-your-turn/03-killer-sudoku-extreme.md) (+50 XP)
<BR>[Tetris Floor](../14-your-turn/04-tetris-floor.md) (+50 XP)
<BR>[Agent X, Mission 2—Mysterious Cryptogram](../16-your-turn/02-agent-x-mission-2.md) (+50 XP)
<BR>[Harmless Rooks](../20-your-turn/01-harmless-rooks.md) (+50 XP)
<BR>[Periodic Table Spelling](../21-final-exam/02-periodic-table-spelling.md) (+50 XP)
<BR>[Kids Blocks](../21-final-exam/03-kids-blocks.md) (+50 XP)
<BR>[Depot Organization](../21-final-exam/04-depot-organization.md) (+50 XP)
<BR>[Fix the Spaces](../21-final-exam/05-fix-the-spaces.md) (+50 XP)
<BR>[Who Dunnit?](../22-2025-and-beyond/02-who-dunnit.md) (+50 XP)
<BR>[Picture Puzzle](../22-2025-and-beyond/03-picture-puzzle.md) (+50 XP)
<BR>[Nonogram Inversor](../22-2025-and-beyond/04-nonogram-inversor.md) (+50 XP)
<BR>[🎮 Polyominoes](../22-2025-and-beyond/06-polyominoes.md) (+50 XP)
<BR>[🎮 Tetrasticks](../22-2025-and-beyond/07-tetrasticks.md) (+50 XP)
<BR>[Haunted Manor](../22-2025-and-beyond/08-haunted-manor.md) (+50 XP)
<BR>[Completed Mahjong Hands](../22-2025-and-beyond/09-completed-mahjong-hands.md) (+50 XP)
<BR>[Crossword](../22-2025-and-beyond/10-crossword.md) (+50 XP)
<BR>[🎮 Pips](../22-2025-and-beyond/11-pips.md) (+50 XP)
<BR>[🎮 Battleship Solitaire](../22-2025-and-beyond/15-battleship-solitaire.md) (+50 XP)
<BR>[🎮 Magnets](../22-2025-and-beyond/16-magnets.md) (+50 XP)
<BR>[🎮 Connect the Colours - Part I](../22-2025-and-beyond/12-connect-the-colours-part-1.md) (+50 XP)
<BR>[🎮 Connect the Colours - Part II](../22-2025-and-beyond/13-connect-the-colours-part-2.md) (+50 XP)

🎮 = Solo Game with special visual effects that nicely demonstrate the exact cover.

---

# My Promise to You

I wholeheartedly believe that working through this playground and the accompanying puzzles will be a great experience on multiple levels. How can I say this? All these things happened for me as I studied [Algorithm X](https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X) and applied it to as many puzzles as possible. I promise…

* You will become proficient with a powerful and repeatable problem-solving technique known as Algorithm X.
* You will experience the compelling nature of reusable software architectures.
* You will find every puzzle listed above significantly easier than it would have been otherwise. I’m not saying they’ll all be easy, but they will indeed be easier.
* You will have a lot of fun.
* You will earn up to __3050 [CodinGame](https://www.codingame.com) XP!__

---

# Prerequisites

* Intermediate level knowledge of Python, including object-oriented programming concepts such as classes and class method overriding. However, if you are new to Python, going through this playground will identify some intermediate level concepts that you might consider moving to the top of your to-study list.

* Cursory understanding of backtracking. To complete this playground, it is more important that you understand the general concept of backtracking than it is you be able to code a backtracking algorithm.

---

# Language Translations

The CodinGame community is wide and diverse. Although much of this playground has been written for the Python programmer, it did not take long for language translations of the provided [`AlgorithmXSolver`](../03-AlgorithmXSolver/01-the-AlgorithmXSolver.md) to appear. Be sure to visit the [translations section](../23-solver-translations/01-overview.md) to see if a translation to your preferred language already exists.

---

# Future Updates

If this is not your first time visiting this playground, be sure to click [here](../24-odds-and-ends/02-revision-history.md) to see if any major updates (e.g. new puzzle) have been made since your last visit.

<BR>