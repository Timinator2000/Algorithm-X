# Haunted Manor

__Puzzle:__ [Haunted Manor](https://www.codingame.com/training/hard/haunted-manor)

__Author:__ [@\[CG\]jupoulton](https://www.codingame.com/profile/d39436e9a23b5060ed3efaf1c24b4ba8929551)

__Published Difficulty:__ Hard

__Algorithm X Complexity:__ More Confusing than a [Svengoolie](https://www.metv.com/svengoolie/) Movie Marathon

---

# Strategy

Even in a world overrun by the undead, there’s still room for small moments of warmth —  quiet laughter over a meager meal, the comforting weight of a weapon held steady, the unspoken promise between survivors. In the midst of chaos, resilience isn’t just about fighting to stay alive, but finding reasons to keep going.

This puzzle will test your resilience! Before hitting the keyboard, I highly recommend playing the online version, [Undead from Simon Tatham’s Portable Puzzle Collection](https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/undead.html).

---

# Object Model

A powerful object model can get you started in a good direction, and I invite you to compare this puzzle’s grid to the grid found in [High-Rise Buildings](../13-steering-algorithm-x/02-high-rise-buildings.md). In the latter, I proposed that each `CityView` has a relationship with `N` `Building`s and each `Building` has a relationship with 4 `CityView`s. More generically, the relationship could have been characterized as a many-to-many relationship. Each `CityView` groups together many `Building`s and each `Building` is part of many `CityView`s.

The same model appears to work for Haunted Manor. Let’s call the groups `Sightline`s and say that each `Sightline` groups together many `Cell`s, while each `Cell` can be a member of many `Sightline`s. Just as was done in High-Rise Buildings, it is tempting to create the following object model.

<BR>

![Haunted Manor Classes](HauntedManor1.png){ class="center-image" }

<BR>

Anytime we encounter a many-to-many relationship, it can be beneficial to step back and consider what the relational database folks might do. Since relational databases don’t directly support many-to-many relationships, they are implemented using a _junction table_ (aka _bridge table_ or _associative table_). The _junction table_ contains foreign keys referencing both tables, and breaks the many-to-many relationship into two one-to-many relationships. In the next diagram, I have inserted a class called a `Visual` to act similar to a _junction table_ between the `Sightline` class and the `Cell` class. 

<BR>

![Haunted Manor Junction Class](HauntedManor2.png){ class="center-image" }

<BR>

In coding, we can often move forward without this third class, but not always. Adding this _junction_ class makes sense when each instance has its own interesting attributes. Each `Visual` represents an instance of one `Cell` showing up in one `Sightline`. Are there any important attributes associated with an instance of one `Cell` in a particular`Sightline`? Yes, there is!

For each `Visual`, it is important to know if that `Visual` exists due to normal line of sight or due to reflected line of sight. The concept of a normal, line-of-sight `Visual` vs. a reflection only exists inside the relationship between one particular `Cell` and one particular `Sightline`. In the following diagram, I have added a single Boolean attribute called `reflection`.

<BR>

![Haunted Manor Final](HauntedManor3.png){ class="center-image" }

<BR>

Our class diagram tells a different story now. Each `Cell` has a relationship with many `Visual`s, each `Sightline` has a relationship with many `Visual`s, and each `Visual` has a relationship with exactly one `Cell` and exactly one `Sightline`. And the best part is that each `Visual` knows if it exists due to normal line of sight or reflected line of sight.

Consider what is possible with this new model. I can try putting a Vampire in an empty `Cell`. For each `Visual` associated with that `Cell`, I need to know if that `Visual` exists due to normal line of sight or reflected line of sight. If the `reflection` attribute is `True`, the Vampire does not count as being seen in the `Sightline` because Vampires do not have reflections. However, if the `reflection` attribute is `False`, the Vampire does count as being seen in the `Sightline`.

For this puzzle, having a third class to act as a _junction_ is powerful. The `reflection` attribute does not belong in the `Cell` class, nor does it belong in a `Sightline` class. The `reflection` attribute only makes sense when it describes a single `Cell` showing up in a `Sightline`.

---

# Path to Success

With a strong object model, you are ready to construct your Algorithm X matrix. At this point, Haunted Manor and High-Rise Buildings feel a bit more different than similar. Instead, I suggest you revisit your matrix setup for [There is No Spoon – Episode 2](../10-your-turn/05-no-spoon-2.md) where many of the same concepts can be found.

Getting your matrix set up properly is challenging, but Algorithm X will find solutions to all test cases, except the 7x7 manors, very quickly. To solve the 7x7 manors requires some problem-space reduction and that is a wonderful challenge on its own. I needed to really think through [sequences of events](../12-your-turn/04-no-spoon-2.md#one-potential-sequence-of-events) similar to what I discussed for There is No Spoon – Episode 2.

---

# I Ain’t Afraid of No Ghosts

I love everything about this puzzle. Creating an abstract object model is challenging. The problem-space reduction is challenging. Creating a solid Algorithm X setup is challenging. If you enjoy a challenge, this puzzle is for you!

I’m no fan of scary movies, but some of us grew up with various television shows about ghosts and goblins and hopefully this puzzle brings back fond memories. If you get stuck solving this puzzle, take a break and look for inspiration in this classic 1984 subject-matter video:

<BR>

{{ youtube("Fe93CLbHjxQ", "Ray Parker Jr. - Ghostbusters (Official Video)") }}

<BR>