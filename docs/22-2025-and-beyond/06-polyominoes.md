# Polyominoes

__Puzzle:__ [Polyominoes](https://www.codingame.com/training/medium/polyominoes)

__Author:__ [@VizGhar](https://www.codingame.com/profile/c152bee9fe8dc90ac4f6b84505b59ebb9086993)

__Published Difficulty:__ Medium

__Algorithm X Complexity:__ Textbook Exact Cover

---

<BR>

![Polyominoes](Polyominoes.png){ class="center-image" }

<BR>

---
# Strategy

Donald Knuth covers Algorithm X and Dancing Links in _The Art of Computer Programming, Volume 4B Combinatorial Algorithms, Part 2_. The PDF I purchased from [informIT](https://www.informit.com/promotions/art-of-computer-programming-books-and-ebooks-140521) is __734 pages__! In November, 2000, Knuth published a 26 page PDF titled _Dancing Links_ on [arXiv.org](https://arxiv.org/abs/cs/0011047) where it can be downloaded for free.

Knuth’s short paper is a great read. Not only does he cover Dancing Links in detail, he provides some interesting history of exact cover research and some powerful combinatoric data. Most importantly (for this page of this playground anyway), he provides significant detail on applying Algorithm X to Pentominoes, a subset of Polyominoes where every puzzle piece is made up of exactly 5 squares. Knuth’s Pentominoes explanation should provide any guidance you need to finish this puzzle.

Polyominoes uses the [CodinGame Game Engine Software Development Kit (SDK)]( https://www.codingame.com/playgrounds/25775/codingame-sdk-documentation/introduction). The SDK provides a viewer used to display a visual aspect to any game. Using the viewer, @VizGhar creates a beautiful visual of the polyominoes, twisting and turning as they gracefully fly across the gameboard and into place. In the words of [@darkhorse64](https://www.codingame.com/profile/c9ebe76a83b33730956eda0534d6cad86053292), “This [puzzle] creates a new standard for exact cover puzzles.”

<BR>