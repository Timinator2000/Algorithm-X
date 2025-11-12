# Multiplicity

Mrs. Knuth is moving up the ladder at school and she is once again requesting changes. The details are found here:

[Mrs. Knuth - Part III](https://www.codingame.com/training/hard/mrs--knuth---part-iii)

There seems to be a lot of new information in the puzzle, but only this key paragraph affects our Algorithm X approach:

>Mrs. Knuth has received some wonderful news! This summer, she will only be working with a handful of honor students. Although she'll have fewer students, each student is now allowed to request multiple hours of instruction per week. This creates a situation where many potential schedules exist. Based on her preferences, Mrs. Knuth needs you to find the best schedule possible.

Let's jump right into the example:

```
M 8 Tu 8 W 8 Th 8 F 8 9 10 11 1
3
Drew Trombone 1 M Tu W Th F 10 11
Ella Flute 2 M 8 Tu 8 W Th F 11
Lola Drums 1 M Tu W Th F 11 1
1
Drew Ella
```

Ella wants two lessons! How can such a minor change make such an impact on our existing model? Using what we learned in the previous two Mrs. Knuth puzzles, we would identify the following three requirements:

```text
('student scheduled', 'Drew')
('student scheduled', 'Ella')
('student scheduled', 'Lola')
```

Until now, requirements needed to be covered exactly once, but now the Ella requirement needs to be covered twice and in future test cases, students are requesting even more than 2 hours of instruction. This list of requirements is no longer sufficient. Remember, requirements should fit a "yes/no" model when we determine what has been covered and what has not. With the above, we can tell if Ella has been scheduled or not, but we cannot tell if she has been scheduled once or twice. This list of requirements is not enough to capture the full scope of the problem.

In [The Art of Computer Programming](https://www-cs-faculty.stanford.edu/~knuth/taocp.html), Donald Knuth discusses _Algorithm M_ for handling problems with requirements/constraints that might need to be covered multiple times and I suggest you add learning about Algorithm M to your to-do list. However, this playground is an Algorithm X tutorial and an overarching goal is to explore how much can be accomplished with a single out-of-the-box `AlgorithmXSolver`!

<BR>