# A Long-Lost Relative?

It is highly unlikely that Mrs. Knuth is any relation to Donald Knuth, but one never knows. Mrs. Knuth is the school band teacher, and she needs help scheduling her students for lessons during the summer. We haven’t even covered how Algorithm X works, but we are going to use it to help Mrs. Knuth with her scheduling problem and solve the first Mrs. Knuth puzzle:

[Mrs. Knuth – Part I](https://www.codingame.com/training/medium/mrs--knuth---part-i)

---

# Puzzle Overview

Of course, you will need to properly organize your input and format your output, but the algorithm for building the schedules is a perfect candidate for Algorithm X. For your convenience, I have copied the scheduling portion of the puzzle's goal section here:

>Mrs. Knuth, the school band teacher, has asked you to write an algorithm to generate her weekly private lesson schedule for the summer. Her availability is different from week to week, but she will always teach between 1 and 5 days per week. On each day that she teaches, she will teach between 2 and 8 hours. Because she likes consistency, she will teach the same number of hours on each day she teaches, but the actual time slots during which she is available might be different from day to day.
>
>Mrs. Knuth is a creature of habit. Her workday starts at 8am every day and ends at 5pm with an hour break for lunch each day from noon to 1pm. Although she is at school 9 total hours every day, she might not be available to teach on some days, she might have partial teaching availability on other days or she might have a day where she teaches every free minute other than during lunch.
>
>Mrs. Knuth is also a bit odd when it comes to music. To keep her mind fresh, she refuses to teach more than a single hour per day for any particular instrument. If she teaches 3 hours in one day, those lessons must be for 3 different instruments. If she teaches 8 hours in one day, all 8 instruments that day must be different.
>
>Given Mrs. Knuth’s open availability and each student’s instrument and lesson availability, generate a schedule for Mrs. Knuth that allows her to work with each student one time per week and meets her quirky demands.

---

# Example Test Case

To make this a bit more concrete, let’s look at the example test case input:

```text
M Tu W Th 2 3 4 F
3
Ayla Trumpet M Tu W Th 2 F
Bob Drums M Tu W Th 2 3 F
Alex Tuba M Tu W Th 2 4 F
```

In this example problem, Mrs. Knuth is only available at 2, 3 and 4 on Thursday. There are 3 students that need to be scheduled. Ayla (Trumpet) is available only at 2 on Thursday, Bob (Drums) is available at 2 and 3 on Thursday, and Alex (Tuba) is available at 2 and 4 on Thursday.

This initial Part I puzzle also has some interesting puzzle constraints that should be considered as we build our understanding of the problem.

1. `numStudents` = Mrs. Knuth's available hours per week.

1. count of each type of `instrument` = count of days with hours in `teacherAvailability`, meaning the student roster will always contain the appropriate number of instruments to make sure no duplication of instruments on any one day is possible.

Why are these constraints important? Because of (1), we know that all of Mrs. Knuth’s available slots must be filled. Because of (2) above, we know that each instrument must show up on each day Mrs. Knuth teaches. Our initial analysis identifies 3 areas for potential requirements:

1. Each student must be put on Mrs. Knuth’s schedule.

1. Each slot in Mrs. Knuth’s availability must get filled.

1. Each instrument must show up once on each day Mrs. Knuth teaches.

Our next step is to formally identify each requirement a potential solution must satisfy.

<BR>