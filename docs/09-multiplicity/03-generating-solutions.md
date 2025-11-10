# Generating Solutions for Mrs. Knuth - Part III

Before running Algorithm X, let’s reason our way through the problem statement one more time and determine what we expect to see.

```
M 8 Tu 8 W 8 Th 8 F 8 9 10 11 1
3
Drew Trombone 1 M Tu W Th F 10 11
Ella Flute 2 M 8 Tu 8 W Th F 11
Lola Drums 1 M Tu W Th F 11 1
1
Drew Ella
```

Because Drew and Ella are a troublesome pair and Drew’s only availability is on Friday, there is no way to schedule Ella on Friday. That leaves only Monday at 8 and Tuesday at 8 for Ella. Drew and Lola both play loud instruments, so they cannot be back-to-back. This eliminates the possibility of scheduling Lola on Friday at 11 since Drew’s only remaining availability would be Friday at 10. Lola will have to be scheduled Friday at 1. Finally, Drew could be scheduled on Friday at 10 or 11.

In the following code block, I have hard-coded the setup for the example test case. At this point, the schedule options are not scored. I am simply printing all the options returned by Algorithm X. There should be two possible solutions from which we will need to determine the schedule with the best score. Both solutions will have Ella on Monday at 8 and Tuesday at 8, while Lola will be Friday at 1. The only difference between the two options will be Drew’s location, either Friday at 10 or Friday at 11.

**Copy the following code into your coding environment and run it. There is a quiz at the bottom of this page!**

```python
# Unless your coding environment will let you create an AlgorithmX package,
# you will need to copy all of the AlgorithmXSolver code into your code.

from AlgorithmX import AlgorithmXSolver

class MrsKnuthPartIIISolver(AlgorithmXSolver):

    def __init__(self, teacher_availability, students):
        
        requirements = [('student scheduled', 'Drew', 1),
                        ('student scheduled', 'Ella', 1),
                        ('student scheduled', 'Ella', 2),
                        ('student scheduled', 'Lola', 1)]

        optional_requirements = [('slot filled', 'M', 8),
                                 ('slot filled', 'Tu', 8),
                                 ('slot filled', 'W', 8),
                                 ('slot filled', 'Th', 8),
                                 ('slot filled', 'F', 8),
                                 ('slot filled', 'F', 9),
                                 ('slot filled', 'F', 10),
                                 ('slot filled', 'F', 11),
                                 ('slot filled', 'F', 1),
                                 ('instrument on day', 'M', 'Trombone'),
                                 ('instrument on day', 'M', 'Drums'),
                                 ('instrument on day', 'M', 'Flute'),
                                 ('instrument on day', 'Tu', 'Trombone'),
                                 ('instrument on day', 'Tu', 'Drums'),
                                 ('instrument on day', 'Tu', 'Flute'),
                                 ('instrument on day', 'W', 'Trombone'),
                                 ('instrument on day', 'W', 'Drums'),
                                 ('instrument on day', 'W', 'Flute'),
                                 ('instrument on day', 'Th', 'Trombone'),
                                 ('instrument on day', 'Th', 'Drums'),
                                 ('instrument on day', 'Th', 'Flute'),
                                 ('instrument on day', 'F', 'Trombone'),
                                 ('instrument on day', 'F', 'Drums'),
                                 ('instrument on day', 'F', 'Flute'),
                                 (('Drew', 'F', 10), ('Ella', 'F', 11)),
                                 (('loud instrument', 'F', 8), ('loud instrument', 'F', 9)),
                                 (('loud instrument', 'F', 9), ('loud instrument', 'F', 10)),
                                 (('loud instrument', 'F', 10), ('loud instrument', 'F', 11))]

        actions = dict()

        action = ('place student', 'Drew', 'Trombone', 'F', 10, 1)
        actions[action] = [('student scheduled', 'Drew', 1),
                           ('slot filled', 'F', 10),
                           ('instrument on day', 'F', 'Trombone'),
                           (('Drew', 'F', 10), ('Ella', 'F', 11)),
                           (('loud instrument', 'F', 9), ('loud instrument', 'F', 10)),
                           (('loud instrument', 'F', 10), ('loud instrument', 'F', 11))]

        action = ('place student', 'Drew', 'Trombone', 'F', 11, 1)
        actions[action] = [('student scheduled', 'Drew', 1),
                           ('slot filled', 'F', 11),
                           ('instrument on day', 'F', 'Trombone'),
                           (('loud instrument', 'F', 10), ('loud instrument', 'F', 11))]

        action = ('place student', 'Ella', 'Flute', 'M', 8, 1)
        actions[action] = [('student scheduled', 'Ella', 1),
                           ('slot filled', 'M', 8),
                           ('instrument on day', 'M', 'Flute')]

        action = ('place student', 'Ella', 'Flute', 'M', 8, 2)
        actions[action] = [('student scheduled', 'Ella', 2),
                           ('slot filled', 'M', 8),
                           ('instrument on day', 'M', 'Flute')]

        action = ('place student', 'Ella', 'Flute', 'Tu', 8, 1)
        actions[action] = [('student scheduled', 'Ella', 1),
                           ('slot filled', 'Tu', 8),
                           ('instrument on day', 'Tu', 'Flute')]

        action = ('place student', 'Ella', 'Flute', 'Tu', 8, 2)
        actions[action] = [('student scheduled', 'Ella', 2),
                           ('slot filled', 'Tu', 8),
                           ('instrument on day', 'Tu', 'Flute')]

        action = ('place student', 'Ella', 'Flute', 'F', 11, 1)
        actions[action] = [('student scheduled', 'Ella', 1),
                           ('slot filled', 'F', 11),
                           ('instrument on day', 'F', 'Flute'),
                           (('Drew', 'F', 10), ('Ella', 'F', 11))]

        action = ('place student', 'Ella', 'Flute', 'F', 11, 2)
        actions[action] = [('student scheduled', 'Ella', 2),
                           ('slot filled', 'F', 11),
                           ('instrument on day', 'F', 'Flute'),
                           (('Drew', 'F', 10), ('Ella', 'F', 11))]

        action = ('place student', 'Lola', 'Drums', 'F', 11, 1)
        actions[action] = [('student scheduled', 'Lola', 1),
                           ('slot filled', 'F', 11),
                           ('instrument on day', 'F', 'Drums'),
                           (('loud instrument', 'F', 10), ('loud instrument', 'F', 11))]

        action = ('place student', 'Lola', 'Drums', 'F', 1, 1)
        actions[action] = [('student scheduled', 'Lola', 1),
                           ('slot filled', 'F', 1),
                           ('instrument on day', 'F', 'Drums')]
    
        super().__init__(requirements, actions, optional_requirements)


def main_program():

    teacher_availability = None
    students = None

    solver = MrsKnuthPartIIISolver(teacher_availability, students)

    count = 0
    for solution in solver.solve():
        count += 1
        print(f'Solution {count}')
        for _, name, instrument, day, hour, lesson_num in solution:
            print(f'   Add {name}/{instrument} to Mrs. Knuth\'s schedule on {day} at {hour}.')
```

---

# A Bit About the Code

I want you to know it is way harder to hard-code all those requirements and actions than it is to build them algorithmically with loops. I had to fix 20 or more typos before it worked properly; proof that algorithms are much more precise than us humans!

Does it make sense where all the requirements come from? `'instrument on day'` requirements had to be added for every day of the week because Mrs. Knuth has availability on all 5 days. There are also a bunch more `'slot filled'` requirements.

Understanding the multiplicity can be challenging. Keep in mind that scheduling a student's first lesson is a different action than scheduling a student's second lesson. That is why Ella now has 6 entries in the actions dictionary even though she only has 3 hours of availability.

---

# Quiz Time!

??? question "How many solutions did Algorithm X find?"
    <div class="quiz" data-id="multiplicity_quiz1"></div>

Did you get the result you expected? Either way, don’t worry. In the next two sections, I will dig deeper into what is happening and discuss how to teach Algorithm X to do better.

<BR>