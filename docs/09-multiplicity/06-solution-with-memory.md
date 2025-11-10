# Using Memory to Make Algorithm X Smarter

The following code block is identical to the last code block except for 3 lines added to override the `_process_row_selection(self, row)` method and give Algorithm X the necessary memory to avoid duplicates. **Copy the following code into your coding environment and run it to see Algorithm X eliminate the duplicates!**

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


    def _process_row_selection(self, row):
        _, name, _, day, hour, _ = row
        self._remember((name, day, hour))


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

On to the puzzles!

<BR>