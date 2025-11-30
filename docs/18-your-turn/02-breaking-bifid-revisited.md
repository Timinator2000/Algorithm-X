# Breaking Bifid (Revisited)

__Puzzle:__ [Breaking Bifid](https://www.codingame.com/training/hard/breaking-bifid)

__Author:__ [@therealbeef](https://www.codingame.com/profile/ecad91b9a50d51a3d9515d303487dd7c7077604)

__Published Difficulty:__ Hard

__Algorithm X Complexity:__ Imagine Untangling the World's Largest Pile of Holiday Lights

---

# All-or-None Sets of Events

Breaking Bifid is a complex puzzle and I encourage you to revisit the [original discussion](../08-your-turn/08-breaking-bifid.md) that ended with the following graphic:

<BR>

![Breaking Bifid Toy Example - Conclusion](Toy4.png){ class="center-image" }

<BR>

Drawing two more purple boxes around the `M` and the `E` produces the following:

```python
('row', 'A') must be the same as ('row', 'S')
('row', 'N') must be the same as ('col', 'S')
('row', 'D') must be the same as ('row', 'M')
('col', 'A') must be the same as ('col', 'M')
('col', 'N') must be the same as ('row', 'E')
('col', 'D') must be the same as ('col', 'E')
```

Each row above is an all-or-none set of events. The two elements in each row must be the same. There is no overlap in this toy example, but if there was, you would want to review the exercise a few pages back and combine any sets that overlap.

---

# Enforcing Sameness with Colors

Each time a letter is placed on the grid, that letter is assigned to a particular row and column. Based on the all-or-none sets of events, several other letters might need to have their row or column colored with the same number. The first step in a coloring solution is to add an attribute to your solver to keep track of color assignments. In this case, two attributes could be used, one for row assignments and one for column assignments.

```python
        row_color_assignments = {letter:[] for letter in all_letters_in_plaintext_or_ciphertext}
        col_color_assignments = {letter:[] for letter in all_letters_in_plaintext_or_ciphertext}
```

We might also consider the following to keep track of colors with a single attribute:

```python
        color_assignments = {letter:{'row':[], 'col':[]} for letter in all_letters_in_plaintext_or_ciphertext}
```

__KEY POINT:__ Using colors in this way eliminates the need for any `me_requirements` as outlined in the original discussion. The colors enforce sameness. In the original discussion, each all-or-none set of 2 events was converted to a group of optional requirements used by Algorithm X to enforce mutual exclusivity.

---

# Enforcing Sameness with Complex Actions

I highly recommend you go down this route on your own. Once you remove all overlap from the all-or-none sets of events, things become possible I did not envision. I will explain further, but I urge you to explore this on your own before opening the spoiler below.

??? note "Spoiler Alert: I am serious. I did not see this coming."

    After reducing the all-or-none sets of events, how many distinct sets remain? For **Test Case 1: Long test**, only 5 sets remain. More importantly, each set has 5 `('row', letter)` elements and 5 `('col', letter)` elements. That means the row assignment of 5 letters and the col assignments of 5 letters all need to be the same. And, this is exactly what is expected.

    For a message of reasonable length, all 25 letters are probably part of the key. If that is the case, for each number from 1 to 5, there are exactly 9 letters where either the letter’s row or column or both is equal to that number. In the graphic below, every location where row = 3 or column = 3 has been highlighted.

    <BR>

    <div class="grid-center">
        <div class="grid-5x5">
            <div class="box">(0,0)</div>
            <div class="box">(0,1)</div>
            <div class="box">(0,2)</div>
            <div class="box highlight">(0,<span class="digit3">3</span>)</div>
            <div class="box">(0,4)</div>
            <div class="box">(1,0)</div>
            <div class="box">(1,1)</div>
            <div class="box">(1,2)</div>
            <div class="box highlight">(1,<span class="digit3">3</span>)</div>
            <div class="box">(1,4)</div>
            <div class="box">(2,0)</div>
            <div class="box">(2,1)</div>
            <div class="box">(2,2)</div>
            <div class="box highlight">(2,<span class="digit3">3</span>)</div>
            <div class="box">(2,4)</div>
            <div class="box highlight">(<span class="digit3">3</span>,0)</div>
            <div class="box highlight">(<span class="digit3">3</span>,1)</div>
            <div class="box highlight">(<span class="digit3">3</span>,2)</div>
            <div class="box highlight">(<span class="digit3">3</span>,<span class="digit3">3</span>)</div>
            <div class="box highlight">(<span class="digit3">3</span>,4)</div>
            <div class="box">(4,0)</div>
            <div class="box">(4,1)</div>
            <div class="box">(4,2)</div>
            <div class="box highlight">(4,<span class="digit3">3</span>)</div>
            <div class="box">(4,4)</div>
        </div>
    </div>

    <BR>

    When this puzzle was originally discussed, I wrote the following:

    >The action steps I can take to build a solution are pretty simple. One at a time, a letter of the alphabet (J is excluded) can be placed in one of the 25 squares. As for requirements, the only obvious requirements are that every letter be used and every square be covered.

    Let’s now consider a completely different gameboard and tiles. The gameboard simply has the numbers 1 through 5. The tiles are the all-or-none sets of events. Each set needs to be assigned to one number on the gameboard. There are 5 sets and there are 5 numbers. **I honestly did not see this coming. Is a gameboard analogy really needed? Is Algorithm X even needed?**

    The first 4 test cases all reduce to exactly 5 all-or-none sets of events. In each of those cases, 5 sets need to be assigned to 5 different numbers. Too easy, right? What about **Test Case 5: Minimal text**? Because the text is so short, the all-or-none sets do not reduce down to 5, leaving the following options.

    1. Algorithm X could be used to determine how more than 5 sets can be assigned to only 5 numbers. To be honest, Algorithm X still seems like a bit too much compared to a simple algorithm to combine independent sets until the total number of sets gets to 5.

    ??? note "Spoiler Alert: Click here for Option 2."

        Assuming you have `n` all-or-none sets, you could expand the matrix to `n` by `n`, making it very easy to assign `n` sets to `n` numbers.

        Let’s briefly discuss this second option. The all-or-none sets of events are completely independent of each other. The first set assigned to one of the numbers always works, no matter which number it gets assigned to. A 100 x 100 matrix could be used and numbers chosen randomly between 0 and 99. The consistency of the number across all elements of the set assigned to it is what matters, not the size of the matrix.

        Breaking Bifid is a wonderful puzzle and the complexity gave me tremendous opportunity to explore various Algorithm X techniques. Only after travelling down the path of complex actions did I determine how to solve the puzzle without backtracking.

<BR>