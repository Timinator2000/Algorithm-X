# All-or-None Sets of Events

Many puzzles have been discussed where it is important to make sure 2 items are not part of the same solution. Optional Requirements were used to enforce [mutual exclusivity](../07-generalized-exact-cover/03-mutually-exclusive-actions.md). Specifically, if either `a` __or__ `b` can be part of a solution, but they cannot _both_ be part of the same solution, an additional requirement was added to the optional requirements list to enforce the needed mutual exclusivity.

What if `a` and `b` can only be part of a solution if they are __both__ part of the solution? In this case, `a` and `b` form an _all-or-none set of events_. The set only contains two items, `a` and `b`, and only two options exist. All items in the set may be part of the solution or none of the items in the set may be part of the solution. Mutual exclusivity allows the enforcement of items that must be different. All-or-none sets of events allow the enforcement of items that must be the same. 

---

# Quiz Time

Consider a slightly more interesting scenario with the following all-or-none sets of events:

1. `a` and `b`
1. `c` and `d`
1. `g` and `h`
1. `x` and `y`
1. `a` and `h`

??? question "How many all-or-none sets of events are present in this scenario?"
    <div class="quiz" data-id="all_or_none_quiz1"></div>

Any sets that intersect in any way must be joined together. Let’s rewrite the sets from 1, 3 and 5 above:

`b` and `a` . . . . . . `a` and `h` . . . . . . `h` and `g`

Any solution that has `b` must also have `a` and then must also have `h` and then must also have `g`. The same logic applies starting with `a`, `h` or `g`. Since these sets must be combined, the final 3 all-or-none sets of events are:

1. `a` and `b` and `g` and `h`
1. `c` and `d`
1. `x` and `y`

For each of the three sets above, either all members of the set must be part of a solution or none of the members must be part of a solution. For some problems, building these all-or-none sets of events can be challenging, but before we progress down that path, let’s take a look at implementation.

---

# The School Scavenger Hunt

To explore implementation options for all-or-none sets of events, consider the following scenario. You must divide a group of 18 children into 3 teams of 6 for the elementary school scavenger hunt. To make things fair for the younger kids, each team will have one child from each grade. Fortunately, you have a very accommodating distribution of ages:

| Grade | Names |
|:-----:|:--------|
|1|Wednesday Addams<br>Maggie Simpson<br>Michelle Tanner|
|2|Brenda Walsh<br>Arnold Jackson<br>Arthur Fonzarelli|
|3|Stephanie Tanner<br>Darlene Conner<br>Carlton Banks|
|4|Willis Jackson<br>Pugsley Addams<br>Marcia Brady|
|5|Greg Brady<br>Lisa Simpson<br>Joanie Cunningham|
|6|Richie Cunningham<br>Bart Simpson<br>D. J. Tanner|

Each child will be assigned to either the red, the green or the blue team. To help the parents during drop-off and pickup, it is important that siblings be assigned to the same team. All siblings share identical last names.

This year, the 2nd grade students will be team captains. Brenda Walsh is the red team captain, Arnold Jackson is the green team captain and Arthur Fonzarelli is the blue team captain.

---

# All-or-None Sets of Children

That sounds like a Jeopardy question, doesn't it? 

* Contestant: "_Common Words_ for $300, Alex."
* Alex: "This word is commonly used to refer to an all-or-none set of children."
* Contestant: "What is a _family_?"

Grouping the children by last name results in the following all-or-none sets of names:

* Bart Simpson, Maggie Simpson, Lisa Simpson
* D. J. Tanner, Michelle Tanner, Stephanie Tanner
* Wednesday Addams, Pugsley Addams
* Richie Cunningham, Joanie Cunningham
* Willis Jackson, Arnold Jackson
* Marcia Brady, Greg Brady
* Brenda Walsh
* Arthur Fonzarelli
* Darlene Conner
* Carlton Banks

Let's first explore using colors to enforce sameness.

<BR>