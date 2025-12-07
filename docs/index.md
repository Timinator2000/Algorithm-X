<div style="width:100%; max-width:900px; margin:auto;">
<svg class="algorithm-banner" width="100%" viewBox="0 0 1000 720"
     xmlns="http://www.w3.org/2000/svg" role="img"
     shape-rendering="geometricPrecision">

  <style>
    .algorithm-banner { 
      background: transparent;
    }

    /* =======================
       Cells
       ======================= */
    .algorithm-banner .cell {
      fill: rgba(0,0,0,0.03);
      stroke: currentColor;
      stroke-width: 3;
      rx: 12;
      ry: 12;
      transition: all 0.25s ease;
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.15));
      pointer-events: all;
      vector-effect: non-scaling-stroke; 
    }

    /* Remove hover neon */
    .algorithm-banner .cell:hover {
      stroke: currentColor;
      stroke-width: 3;
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.15));
      cursor: default;
    }

    /* =======================
       Letters
       ======================= */
    .algorithm-banner .letter {
      font-family: "Fira Mono", monospace;
      font-size: 34px;
      font-weight: 700;
      text-anchor: middle;
      dominant-baseline: central;
      opacity: 0;  /* start hidden */
      pointer-events: none;
      transition: fill 0.25s ease;
    }

    /* Neon glow animation for boxes */
    @keyframes neonWave {
      0%, 100% { stroke: #00ffd5; filter: drop-shadow(0 0 8px #00ffd5)
                                  drop-shadow(0 0 16px #00ffd5)
                                  drop-shadow(0 0 24px #00ffd5); }
      50%      { stroke: #00a7a0; filter: drop-shadow(0 0 4px #00a7a0)
                                  drop-shadow(0 0 8px #00a7a0)
                                  drop-shadow(0 0 12px #00a7a0); }
    }
    .neon-wave {
      animation: neonWave 7.5s infinite ease-in-out;
    }

    /* Light/Dark mode colors */
    .algorithm-banner .letter { fill: #000; } /* light mode */
    @media (prefers-color-scheme: dark) {
      .algorithm-banner .letter { fill: #eee; }
    }
  </style>

  <!-- =======================
       ALGORITHM X
       ======================= -->
  <g id="algorithm-x">
    <rect class="cell" x="50"  y="220" width="56" height="56"/><text class="letter" x="78"  y="248" fill="#000">A</text>
    <rect class="cell" x="110" y="220" width="56" height="56"/><text class="letter" x="138" y="248" fill="#000">L</text>
    <rect class="cell" x="170" y="220" width="56" height="56"/><text class="letter" x="198" y="248" fill="#000">G</text>
    <rect class="cell" x="230" y="220" width="56" height="56"/><text class="letter" x="258" y="248" fill="#000">O</text>
    <rect class="cell" x="290" y="220" width="56" height="56"/><text class="letter" x="318" y="248" fill="#000">R</text>
    <rect class="cell" x="350" y="220" width="56" height="56"/><text class="letter" x="378" y="248" fill="#000">I</text>
    <rect class="cell" x="410" y="220" width="56" height="56"/><text class="letter" x="438" y="248" fill="#000">T</text>
    <rect class="cell" x="470" y="220" width="56" height="56"/><text class="letter" x="498" y="248" fill="#000">H</text>
    <rect class="cell" x="530" y="220" width="56" height="56"/><text class="letter" x="558" y="248" fill="#000">M</text>
    <rect class="cell" x="590" y="220" width="56" height="56"/>
    <rect class="cell" x="650" y="220" width="56" height="56"/><text class="letter" x="678" y="248" fill="#000">X</text>
  </g>

  <!-- KNUTH -->
  <g id="knuth">
    <rect class="cell" x="410" y="40"  width="56" height="56"/><text class="letter" x="438" y="68" fill="#000">K</text>
    <rect class="cell" x="410" y="100" width="56" height="56"/><text class="letter" x="438" y="128" fill="#000">N</text>
    <rect class="cell" x="410" y="160" width="56" height="56"/><text class="letter" x="438" y="188" fill="#000">U</text>
    <rect class="cell" x="410" y="280" width="56" height="56"/><text class="letter" x="438" y="308" fill="#000">H</text>
  </g>

  <!-- TIMINATOR -->
  <g id="timinator">
    <rect class="cell" x="530" y="100" width="56" height="56"/><text class="letter" x="558" y="128" fill="#000">T</text>
    <rect class="cell" x="530" y="160" width="56" height="56"/><text class="letter" x="558" y="188" fill="#000">I</text>
    <rect class="cell" x="530" y="280" width="56" height="56"/><text class="letter" x="558" y="308" fill="#000">I</text>
    <rect class="cell" x="530" y="340" width="56" height="56"/><text class="letter" x="558" y="368" fill="#000">N</text>
    <rect class="cell" x="530" y="400" width="56" height="56"/><text class="letter" x="558" y="428" fill="#000">A</text>
    <rect class="cell" x="530" y="460" width="56" height="56"/><text class="letter" x="558" y="488" fill="#000">T</text>
    <rect class="cell" x="530" y="520" width="56" height="56"/><text class="letter" x="558" y="548" fill="#000">O</text>
    <rect class="cell" x="530" y="580" width="56" height="56"/><text class="letter" x="558" y="608" fill="#000">R</text>
  </g>

  <!-- EXACT -->
  <g id="exact">
    <rect class="cell" x="650" y="160" width="56" height="56"/><text class="letter" x="678" y="188" fill="#000">E</text>
    <rect class="cell" x="650" y="280" width="56" height="56"/><text class="letter" x="678" y="308" fill="#000">A</text>
    <rect class="cell" x="650" y="340" width="56" height="56"/><text class="letter" x="678" y="368" fill="#000">C</text>
    <rect class="cell" x="650" y="400" width="56" height="56"/><text class="letter" x="678" y="428" fill="#000">T</text>
  </g>

  <!-- COVER -->
  <g id="cover">
    <rect class="cell" x="710" y="340" width="56" height="56"/><text class="letter" x="738" y="368" fill="#000">O</text>
    <rect class="cell" x="770" y="340" width="56" height="56"/><text class="letter" x="798" y="368" fill="#000">V</text>
    <rect class="cell" x="830" y="340" width="56" height="56"/><text class="letter" x="858" y="368" fill="#000">E</text>
    <rect class="cell" x="890" y="340" width="56" height="56"/><text class="letter" x="918" y="368" fill="#000">R</text>
  </g>

</svg>
</div>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const algorithmXCells = [...document.querySelectorAll("#algorithm-x .cell")];
  const allLetters = [...document.querySelectorAll(".algorithm-banner .letter")];

  // Reveal letters one by one
  let delay = 0;
  allLetters.forEach((letter) => {
    setTimeout(() => {
      letter.style.opacity = 1;
    }, delay);
    delay += 200; 
  });

  // Neon wave across ALGORITHM X boxes left-to-right after letters reveal
  setTimeout(() => {
    algorithmXCells.forEach((cell, index) => {
      setTimeout(() => {
        cell.classList.add("neon-wave");
      }, index * 200); // stagger by 200ms per box
    });
  }, delay + 300);
});
</script>


<BR>

# Background

In August, 2022, I attempted to solve [Constrained Latin Squares](04-your-turn/08-constrained-latin-squares.md), a recently published puzzle by [@darkhorse64](https://www.codingame.com/profile/c9ebe76a83b33730956eda0534d6cad86053292) on [CodinGame](https://www.codingame.com/home). I noticed [@5DN1L]( https://www.codingame.com/profile/bbb8f47ea4601179303c20acdbf5fb6c1904782) had, a week earlier, posted a link to [Puzzles solvable by Algorithm X / Dancing Links](https://www.codingame.com/forum/t/puzzles-solvable-by-algorithm-x-dancing-links/196871), a post where he had compiled a list of puzzles on CodinGame he had solved with Algorithm X. I love processes that are repeatable and the idea of using a single algorithm to solve a long list of medium/hard puzzles intrigued me.

For the next 18 months, I worked on @5DN1L’s list, reaching out to him over and over again with questions and ideas. I saw tremendous opportunity for not only a reusable software architecture, but also a repeatable engineering process for solving [Exact Cover](https://en.wikipedia.org/wiki/Exact_cover) problems. Eventually, he suggested I build an Algorithm X playground, and here we are!

I can’t thank @5DN1L enough for all of his guidance, support, ideas, encouragement, questions, answers, poking, prodding, reviewing, etc. This playground is his creation every bit as much as it is mine. His influence has made a permanent mark on who I am and how I approach problems. I am forever grateful.

---

# What is Algorithm X?

[Algorithm X](https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X) is a promise. If you can build a proper model to a particular problem space, Algorithm X promises to find all solutions to that problem space. Papers have been written and projects have been done to demonstrate “how” Algorithm X works. That is not the goal here. Instead, the focus of this exercise is to build expertise in the realm of modeling. The goal is to build models that Algorithm X easily digests and returns solutions. Only a cursory understanding of Algorithm X is required, and the implementation details will barely be covered. Instead, you will be asked to build models of problems and you will have the opportunity to see how well you modeled each problem simply by seeing how easily Algorithm X converts your models into solutions.

---

# What’s in It for You?

A quick Google search will surely bring you to countless implementations of [Algorithm X](https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X), usually solving a 9x9 Sudoku grid using the famous [Dancing Links (DLX)](https://en.wikipedia.org/wiki/Dancing_Links) technique proposed by the brilliant [Donald Knuth](https://www-cs-faculty.stanford.edu/~knuth/). This playground is NOT just another Sudoku demonstration. By the time you finish working your way through this material, you should feel confident solving any [Exact Cover](https://en.wikipedia.org/wiki/Exact_cover) problem you run across, including…

__Exact Cover (Algorithm X Candidate) Puzzles Created for this Playground:__
<BR>[Mrs. Knuth – Part I](04-your-turn/01-mrs-knuth-part-I.md) (+50 XP)
<BR>[Mrs. Knuth – Part II](08-your-turn/01-mrs-knuth-part-II.md) (+50 XP)
<BR>[Mrs. Knuth – Part III](10-your-turn/01-mrs-knuth-part-III.md) (+50 XP)
<BR>[Equation Search](10-your-turn/03-equation-search.md) (+50 XP)
<BR>[Ye_ An_th_r W_rd Se_rch](16-your-turn/01-yet-another-word-search.md) (+50 XP)

__Support Puzzles Covered in this Playground__
<BR>[Shikaku Skill Builder](05-generating-actions/02-shikaku-skill-builder.md) (+50 XP)
<BR>[Networking](17-enforcing-sameness/04-test-your-skills.md#a-few-xp-for-your-efforts) (+50 XP)

__Great Candidates for Algorithm X:__
<BR>[Sudoku Solver](04-your-turn/02-9x9-sudoku.md) (+50 XP)
<BR>[16x16 Sudoku](04-your-turn/05-16x16-sudoku.md) (+50 XP)
<BR>[25x25 Sudoku](04-your-turn/06-25x25-sudoku.md) (+50 XP)
<BR>[Mini Sudoku Solver](04-your-turn/07-mini-sudoku-solver.md) (+50 XP)
<BR>[Constrained Latin Squares](04-your-turn/08-constrained-latin-squares.md) (+50 XP)
<BR>[Literary Alfabet Soupe](04-your-turn/09-literary-alfabet-soupe.md) (+50 XP)
<BR>[Shikaku Solver](06-your-turn/01-shikaku-solver.md) (+50 XP)
<BR>[Dominoes Solver](06-your-turn/02-dominoes-solver.md) (+50 XP)
<BR>[Paving with Bricks](06-your-turn/03-paving-with-bricks.md) (+50 XP)
<BR>[n Queens](08-your-turn/02-n-queens.md) (+50 XP)
<BR>[Finish the Eight Queens](08-your-turn/03-finish-eight-queens.md) (+50 XP)
<BR>[Optimized Coloring](08-your-turn/04-optimized-coloring.md) (+50 XP)
<BR>[Einstein’s Riddle Solver](08-your-turn/05-einstein-riddle.md) (+50 XP)
<BR>[Winamax](08-your-turn/06-winamax.md) (+250 XP) 🚀🚀🚀
<BR>[Three Little Piggies](08-your-turn/07-three-little-piggies.md) (+50 XP)
<BR>[Breaking Bifid](08-your-turn/08-breaking-bifid.md) (+50 XP)
<BR>[Futoshiki Solver](08-your-turn/09-futoshiki-solver.md) (+50 XP)
<BR>[Suguru Solver](08-your-turn/10-suguru-solver.md) (+50 XP)
<BR>[Dumbbells Solver](10-your-turn/02-dumbbells-solver.md) (+50 XP)
<BR>[Hitori Solver](10-your-turn/04-hitori-solver.md) (+50 XP)
<BR>[🎮 There Is No Spoon – Episode 2](10-your-turn/05-no-spoon-2.md) (+250 XP) 🚀🚀🚀
<BR>[Takuzu Solver](12-your-turn/05-takuzu-solver.md) (+50 XP)
<BR>[High-Rise Buildings](13-steering-algorithm-x/02-high-rise-buildings.md) (+50 XP)
<BR>[Killer Sudoku Solver](14-your-turn/01-killer-sudoku.md) (+50 XP)
<BR>[Kakuro Solver](14-your-turn/02-kakuro-solver.md) (+50 XP)
<BR>[Killer Sudoku Extreme Challenge](14-your-turn/03-killer-sudoku-extreme.md) (+50 XP)
<BR>[Tetris Floor](14-your-turn/04-tetris-floor.md) (+50 XP)
<BR>[Agent X, Mission 2—Mysterious Cryptogram](16-your-turn/02-agent-x-mission-2.md) (+50 XP)
<BR>[Harmless Rooks](20-your-turn/01-harmless-rooks.md) (+50 XP)
<BR>[Periodic Table Spelling](21-final-exam/02-periodic-table-spelling.md) (+50 XP)
<BR>[Kids Blocks](21-final-exam/03-kids-blocks.md) (+50 XP)
<BR>[Depot Organization](21-final-exam/04-depot-organization.md) (+50 XP)
<BR>[Fix the Spaces](21-final-exam/05-fix-the-spaces.md) (+50 XP)
<BR>[Who Dunnit?](22-2025-and-beyond/02-who-dunnit.md) (+50 XP)
<BR>[Picture Puzzle](22-2025-and-beyond/03-picture-puzzle.md) (+50 XP)
<BR>[Nonogram Inversor](22-2025-and-beyond/04-nonogram-inversor.md) (+50 XP)
<BR>[🎮 Polyominoes](22-2025-and-beyond/06-polyominoes.md) (+50 XP)
<BR>[🎮 Tetrasticks](22-2025-and-beyond/07-tetrasticks.md) (+50 XP)
<BR>[Haunted Manor](22-2025-and-beyond/08-haunted-manor.md) (+50 XP)
<BR>[Completed Mahjong Hands](22-2025-and-beyond/09-completed-mahjong-hands.md) (+50 XP)
<BR>[Crossword](22-2025-and-beyond/10-crossword.md) (+50 XP)
<BR>[🎮 Pips](22-2025-and-beyond/11-pips.md) (+50 XP)
<BR>[🎮 Battleship Solitaire](22-2025-and-beyond/15-battleship-solitaire.md) (+50 XP)
<BR>[Nurikabe](22-2025-and-beyond/17-nurikabe.md) (+50 XP)
<BR>[The L-Game: Counting Board States](22-2025-and-beyond/18-the-l-game-counting-board-states.md) (+50 XP)
<BR>[🎮 Connect the Colours - Part I](22-2025-and-beyond/12-connect-the-colours-part-1.md) (+50 XP)
<BR>[🎮 Connect the Colours - Part II](22-2025-and-beyond/13-connect-the-colours-part-2.md) (+50 XP)

**AWAITING APPROVAL on the [CodinGame Contribution Page](https://www.codingame.com/contribute/community)**
<BR>[🎮 Magnets](22-2025-and-beyond/16-magnets.md) (+50 XP)

🎮 = Solo Game with gameboard visualization that nicely demonstrate the exact cover.

---

# My Promise to You

I wholeheartedly believe that working through this playground and the accompanying puzzles will be a great experience on multiple levels. How can I say this? All these things happened for me as I studied [Algorithm X](https://en.wikipedia.org/wiki/Knuth%27s_Algorithm_X) and applied it to as many puzzles as possible. I promise…

* You will become proficient with a powerful and repeatable problem-solving technique known as Algorithm X.
* You will experience the compelling nature of reusable software architectures.
* You will find every puzzle listed above significantly easier than it would have been otherwise. I’m not saying they’ll all be easy, but they will indeed be easier.
* You will have a lot of fun.
* You will earn up to __3150 [CodinGame](https://www.codingame.com) XP!__

---

# Prerequisites

* Intermediate level knowledge of Python, including object-oriented programming concepts such as classes and class method overriding. However, if you are new to Python, going through this playground will identify some intermediate level concepts that you might consider moving to the top of your to-study list.

* Cursory understanding of backtracking. To complete this playground, it is more important that you understand the general concept of backtracking than it is you be able to code a backtracking algorithm.

---

# Language Translations

The CodinGame community is wide and diverse. Although much of this playground has been written for the Python programmer, it did not take long for language translations of the provided [`AlgorithmXSolver`](03-AlgorithmXSolver/01-the-AlgorithmXSolver.md) to appear. Be sure to visit the [translations section](23-solver-translations/01-overview.md) to see if a translation to your preferred language already exists.

---

# Future Updates

If this is not your first time visiting this playground, be sure to click [here](24-odds-and-ends/02-revision-history.md) to see if any major updates (e.g. new puzzle) have been made since your last visit.

<BR>