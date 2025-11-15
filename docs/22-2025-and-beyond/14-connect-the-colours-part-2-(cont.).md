# Connect the Colours - Part 2 (cont.)

The path explosion described on the previous page makes pre-computing all possible actions extremely difficult. With only two seconds to produce your first move — and identical limits across all languages - you might be tempted to use a language faster than Python.

I did solve this puzzle in Python with [full path enumeration](../05-generating-actions/01-finding-all.md), but the sparse boards are brutal: the number of possible routes becomes enormous. To enumerate all candidate actions for Algorithm X, you must prune aggressively. Any search branch that isolates even a single cell, or any partial path that redundantly covers a region already handled by another candidate, should be terminated immediately.

If that sounded like Penn Jillette delivering coded hints on [*Fool Us*](https://www.cwtv.com/shows/penn-teller-fool-us/), the spoilers below contain slightly more straight-up versions.

??? note "Spoiler Alert: Logic"

    It’s worth remembering that *Connect the Colours* is fundamentally a logic puzzle. In Part I, we were handed checkpoints: cells that had to be covered by a specific color. Part II provides no explicit checkpoints, but that doesn’t mean the board contains none. Using pure logic, can you identify any cells with only one possible color? If so, you can treat them exactly like the checkpoints you defined in Part I.

??? note "Spoiler Alert: Isolation Errors"

    <BR>

    ![An Isolation Error](ConnectColoursIsolationError.png){ class="center-image" }

    <BR>

    In the diagram above, the potential path (in blue) isolates the top-left corner cell. Once a corner cell is cut off like this, no other path can possibly cover it, so the blue path must be rejected. Detecting these isolation errors early — and doing so frequently — greatly improves the speed of your path search.

??? note "Spoiler Alert: Eliminate Redundancy"

    When generating potential paths, you must be able to recognize when two partial paths are effectively the same. In the example below, is there any meaningful difference between the two branches? Both occupy the *same cell* and reached that position by covering the *same group of cells*. In the context of this puzzle, these two paths are **redundant**.

    <BR>

    ![Redundant Paths](ConnectColoursRedundantPaths.png){ class="center-image" }

    <BR>

    Without a way to uniquely identify a path, your search will repeatedly re-explore identical situations, wasting time and inflating the search space. Every path therefore needs a **unique signature** so you can quickly compare it against previously explored states and immediately discard duplicates.

    The simplest way to build such a signature is to record *every cell* in the path’s body—along with its head—and use that collection of coordinates as the path’s identity. In Python, this normally means sorting the body cells into a tuple and pairing that tuple with the head coordinate. You can then insert that composite key into a set to detect redundancy.

    The drawback is that this approach is **expensive**. Sorting coordinates, creating large tuples, and hashing many individual values all add up. When you’re generating a lot of paths, this overhead becomes a significant bottleneck.

    A far more efficient method is to encode the path body as a **single integer bitmap**. Each cell on the grid corresponds to a bit position; a path’s body is represented by setting those bits. This produces a compact, constant-size key that can be hashed extremely quickly. Combined with the head’s small `(x, y)` tuple, you get a lightweight and uniquely identifying signature with minimal overhead.

    Here’s the performance comparison:

    * **Tuple representation:**
    Easy to write but slow. It requires sorting coordinates, allocating tuples, and hashing lots of data. The cost grows with path length and can dominate runtime as the search space expands.

    * **Bitmap representation:**
    Much faster. Bitmap updates are just bit operations, and hashing a single integer plus a tiny head tuple is extremely cheap. No sorting, far less allocation, lower memory pressure, and duplicate detection becomes efficient enough to apply constantly.

    ---

    # A Simple Bitmap Strategy

    The idea is straightforward: assign each cell on the board a **power-of-two value**, ensuring each cell corresponds to a unique bit in an integer. Once that’s done, the entire “visited set” can be represented as a single number.

    Let’s walk through a tiny example to make this concrete.

    ## Example: A 1×5 Grid

    Label the grid cells from left to right:

    ```
    [0] [1] [2] [3] [4]
    ```

    Because the grid has 5 cells, we need **5 bits** to represent which ones are active. That means our bitmap will be a number between:

    * **0** (`00000` in binary, nothing selected)
    * **31** (`11111` in binary, all selected)

    ## Assigning Cell Bitmasks

    We assign powers of two from left to right:

    | Cell | Bit Position | Bitmask |
    | ---- | ------------ | ------- |
    | 0    | bit 0        | **1**   |
    | 1    | bit 1        | **2**   |
    | 2    | bit 2        | **4**   |
    | 3    | bit 3        | **8**   |
    | 4    | bit 4        | **16**  |

    Each mask has exactly one bit set.

    ## Forming the Bitmap (Adding Bitmasks)

    To represent a set of visited cells, simply **add** their bitmasks.

    Suppose the active cells are 0, 2, and 4:

    ```
    1 (cell 0) + 4 (cell 2) + 16 (cell 4) = 21
    ```

    The bitmap is **21**, which is binary `10101`, neatly showing which bits—and therefore which cells—are active.

    ## Removing a Cell (Subtracting Bitmasks)

    If you backtrack or unmark a cell, **subtract** its mask.

    Example: remove cell 2 (mask 4) from `21`:

    ```
    21 − 4 = 17
    ```

    Binary `10001`.

    Now only cells 0 and 4 are active.

    ## Why This Works

    * Every possible combination of visited cells corresponds to **one unique integer**.
    * Adding and removing cells is **constant time**.

    * Detecting redundancy becomes trivial:

    ```
    if (bitmap in visited_set): skip
    ```

    This strategy gives each partial path a clean, compact signature, dramatically reducing redundancy and improving search performance. In Connect the Colours, the only additional ingredient you need is the path head’s coordinates — a crucial detail for distinguishing one partial path from another.

    ---

    # Leveling Up Your Bitboard Skills

    CodinGame has many wonderful opportunities for practicing bitmaps, especially in multi-player games that feature grid-based gameboards. If you'd like to take your bitboarding to the next level, I recommend taking a look at [@darkhorse64](https://www.codingame.com/profile/c9ebe76a83b33730956eda0534d6cad86053292)'s multi-player game [Mad Knights](https://www.codingame.com/multiplayer/bot-programming/mad-knights).

    Mad Knights is played on a classic **8×8 chessboard**, which makes it an ideal environment for experimenting with bitmaps: every cell on the board corresponds cleanly to one of the 64 bits in a standard unsigned integer. Even better, the game limits each player to controlling **a single knight**, dramatically reducing complexity while still giving you plenty of opportunities to practice shifting, masking, and manipulating bit patterns to generate movement options. If you want a fun, competitive way to sharpen your bitboarding skills, Mad Knights is a perfect place to start!

<BR>