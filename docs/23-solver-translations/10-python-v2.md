# Python Version 2

The following Python translation of `AlgorithmXSolver` is derived from the C++ version, which serves as the recommended reference for its structure, algorithms, and overall design.

Detailed explanations have been omitted, as they align closely with the discussion in the [C++ version](../23-solver-translations/05-cpp.md).

---

# Problem-Specific Requirements

```python
class CellCovered(Requirement):
    @staticmethod
    def make_key(row, col):
        return f"cell covered {row} {col}"

    def __init__(self, row, col):
        super().__init__(CellCovered.make_key(row, col))
        self.row = row
        self.col = col


class ValInRow(Requirement):
    @staticmethod
    def make_key(row, val):
        return f"val in row {row} {val}"

    def __init__(self, row, val):
        super().__init__(ValInRow.make_key(row, val))
        self.row = row
        self.val = val


class ValInCol(Requirement):
    @staticmethod
    def make_key(col, val):
        return f"val in col {col} {val}"

    def __init__(self, col, val):
        super().__init__(ValInCol.make_key(col, val))
        self.col = col
        self.val = val


class ValInBox(Requirement):
    @staticmethod
    def make_key(box, val):
        return f"val in box {box} {val}"

    def __init__(self, box, val):
        super().__init__(ValInBox.make_key(box, val))
        self.box = box
        self.val = val
```

---

# Problem-Specific Actions

```python
class PlaceValue(Action):
    @staticmethod
    def make_key(row, col, val):
        return f"place value {row} {col} {val}"

    def __init__(self, row, col, val):
        super().__init__(PlaceValue.make_key(row, col, val))
        self.row = row
        self.col = col
        self.val = val
```

---

# Example - 9x9 Sudoku

```python
class SudokuSolver(AlgorithmXSolver):

    def __init__(self, grid, values):
        super().__init__()
        self.grid = grid

        # Build the requirements - for instance:

        # The cell at (0, 0) must be covered:
        self.add_requirement(CellCovered(0, 0))

        # There must be a '3' in the first row, the first col and the first box:
        self.add_requirement(ValInRow(0, '3'))
        self.add_requirement(ValInCol(0, '3'))
        self.add_requirement(ValInBox(0, '3'))

        # Build the actions and attach the covered requirements.

        # Consider the single action of putting a '6' at location (2, 2):
        action = self.add_action(PlaceValue(2, 2, '6'))

        self.attach_requirement(action, CellCovered.make_key(2, 2))
        self.attach_requirement(action, ValInRow.make_key(2, '6'))
        self.attach_requirement(action, ValInCol.make_key(2, '6'))
        self.attach_requirement(action, ValInBox.make_key(0, '6'))


    def process_solution(self):
        for action in self.solution:

          # Use the attributes of the action to build the solution:
          #      action.row
          #      action.col
          #      action.val


# read input

solver = SudokuSolver(grid, ALL_VALUES)
solver.solve()

for row in grid:
    print(*row, sep='')
```

---

# Mutual Exclusivity

MERequirement Definition:

```python
class LoudInstrument(MERequirement):
    @staticmethod
    def make_key(day, hour):
        return f"loud instrument {day} {hour}"

    def __init__(self, day, hour1, hour2):
        super().__init__(
            LoudInstrument.make_key(day, hour1),
            LoudInstrument.make_key(day, hour2))
```

Registration:

```python
    self.add_me_requirement(LoudInstrument('F', 8, 9))
    self.add_me_requirement(LoudInstrument('F', 9, 10))
    self.add_me_requirement(LoudInstrument('F', 10, 11))
```

Usage:

```python
    if student.instrument in LOUD_INSTRUMENTS:
        self.attach_me_requirements(action, LoudInstrument.make_key(day, hour))
```

---

# Multiplicity

Add `to_remember`:

```python
class PlaceStudent(Action):
    @staticmethod
    def make_key():
        return     # unique string key for the action

    def __init__()
        super().__init__(PlaceStudent.make_key())
        # initialize other attributes ...
    
        # Build a string that identifies what should be remembered about this action.
        to_remember = f"{student.name} {day} {hour}"
```

Override `proces_row_selection`:

```python
    def process_row_selection(self, action):
        self.remember(action.to_remember)
```

---

# Debug Print Helpers

- `print_requirements(n=1000000)`
- `print_optional_requirements(n=1000000)`
- `print_me_requirements(n=1000000)`
- `print_actions(n=1000000, include_covered_requirements=false)`

---

# The Solver Code

```python
# -------------------------------------------------------------
#
#  This solution uses Knuth's Algorithm X and his Dancing Links (DLX):
#  Last Updated: 01 January 2026 by @Timinator
#
#  For a detailed explanation and tutorial on this Algorithm X Solver,
#  please visit:
#
#  https://www.algorithm-x.com
#
# -------------------------------------------------------------

import sys
import math
import time
from collections import defaultdict


# -------------------------------------------------------------
#
#  DLXCell is one cell in the Algorithm X matrix. This implementation was mostly
#  copied from @RoboStac's solution to Constrained Latin Squares on www.codingame.com.
#
#  https://www.codingame.com/training/medium/constrained-latin-squares
#
# -------------------------------------------------------------
class DLXCell:
    def __init__(self):
        self.prev_x = self
        self.next_x = self
        self.prev_y = self
        self.next_y = self

        self.col_header = None
        self.row_header = None

        self.requirement = None   # column headers only
        self.action = None        # row headers only

        # Size quickly identifies how many rows are in any particular column.
        self.size = 0

    def remove_x(self):
        self.prev_x.next_x = self.next_x
        self.next_x.prev_x = self.prev_x

    def restore_x(self):
        self.prev_x.next_x = self
        self.next_x.prev_x = self

    def remove_y(self):
        self.prev_y.next_y = self.next_y
        self.next_y.prev_y = self.prev_y

    def restore_y(self):
        self.prev_y.next_y = self
        self.next_y.prev_y = self

    def attach_horiz(self, other):
        left = self.prev_x
        other.prev_x = left
        left.next_x = other
        other.next_x = self
        self.prev_x = other

    def attach_vert(self, other):
        up = self.prev_y
        other.prev_y = up
        up.next_y = other
        other.next_y = self
        self.prev_y = other

    def remove_column(self):
        self.remove_x()
        r = self.next_y
        while r is not self:
            r.remove_row()
            r = r.next_y

    def restore_column(self):
        r = self.prev_y
        while r is not self:
            r.restore_row()
            r = r.prev_y
        self.restore_x()

    def remove_row(self):
        n = self.next_x
        while n is not self:
            n.col_header.size -= 1
            n.remove_y()
            n = n.next_x

    def restore_row(self):
        n = self.prev_x
        while n is not self:
            n.col_header.size += 1
            n.restore_y()
            n = n.prev_x

    def select(self):
        n = self
        while True:
            n.remove_y()
            n.col_header.remove_column()
            if n.next_x is self:
                break
            n = n.next_x

    def unselect(self):
        n = self.prev_x
        while True:
            n.col_header.restore_column()
            n.restore_y()
            if n is self:
                break
            n = n.prev_x


# -------------------------------------------------------------
# Requirement & MERequirement Base Classes
# -------------------------------------------------------------
class Requirement:
    def __init__(self, key):
        self.key_ = key
        self.is_optional = False

    def key(self):
        return self.key_


class MERequirement(Requirement):
    @staticmethod
    def make_me_key(x, y):
        return f"{x} -me- {y}" if x < y else f"{y} -me- {x}"

    def __init__(self, a, b):
        super().__init__(MERequirement.make_me_key(a, b))
        if a < b:
            self.a, self.b = a, b
        else:
            self.a, self.b = b, a
        self.is_optional = True


# -------------------------------------------------------------
# Action Base Class
# -------------------------------------------------------------
class Action:
    def __init__(self, key):
        self.key_ = key
        self.covered_requirements = []

    def key(self):
        return self.key_


# -------------------------------------------------------------
# AlgorithmXSolver Base Class with DLX engine
# -------------------------------------------------------------
class AlgorithmXSolver:
    def __init__(self):
        self.construct_time = time.time()

        # Requirement/Action containers
        self.requirements = []
        self.optional_requirements = []
        self.me_requirements = []
        self.actions = []

        # Lookup tables mapping requirement keys (strings) to requirement pointers.
        self.requirements_lookup = {}
        self.me_lookup = {}
        self.me_lists = defaultdict(list)

        #  DLX structures
        self.matrix_root = DLXCell()
        self.col_headers = {}
        self.row_headers = {}
        self.dlx_cells = []

        # The list of actions (rows) that produce the current path through the matrix.
        self.solution = []

        # When stop_search is true, the search method knows a solution has been found and
        # the depth-first search is quickly unwound and the search method is exited.
        self.stop_search = False

        # For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
        # can add functionality to check solutions as they are being built to steer away from
        # invalid solutions. The basic Algorithm X Solver never modifies this attribute.
        self.solution_is_valid = True

        # A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
        # In the basic Solver, nothing is ever put into the history. A subclass can override
        # the process_row_selection() method to add history in cases of multiplicity. 
        self.history = [set()]

        self.solution_count = 0

    # ----------------------------------------------------------
    # Requirement / Action helpers
    # ----------------------------------------------------------
    def add_requirement(self, requirement):
        self.requirements_lookup[requirement.key()] = requirement
        self.requirements.append(requirement)

    def add_optional_requirement(self, requirement):
        self.requirements_lookup[requirement.key()] = requirement
        requirement.is_optional = True
        self.optional_requirements.append(requirement)

    def add_me_requirement(self, me_requirement):
        key = me_requirement.key()

        # Check for duplicate MERequirement
        if key in self.me_lookup:
            return

        self.me_requirements.append(me_requirement)
        self.me_lookup[key] = me_requirement
        self.me_lists[me_requirement.a].append(me_requirement)
        self.me_lists[me_requirement.b].append(me_requirement)

    def add_action(self, action):
        self.actions.append(action)
        return action

    def attach_requirement(self, action, key):
        if key not in self.requirements_lookup:
            raise RuntimeError(f"Requirement not found: {key}")
        action.covered_requirements.append(self.requirements_lookup[key])

    def attach_me_requirements(self, action, key):
        for me_req in self.me_lists.get(key, []):
            action.covered_requirements.append(me_req)

    # ----------------------------------------------------------
    # DLX matrix builder (called automatically in solve)
    # ----------------------------------------------------------
    def build_matrix(self):
        assert not self.col_headers

        # Merge all requirements into one list: required → optional → me.
        # Required requirements must precede optional requirements in header order.
        # Search stops scanning columns when first optional requirement is encountered.
        all_requirements = self.requirements + self.optional_requirements + self.me_requirements

        # Create column headers
        for r in all_requirements:
            node = DLXCell()
            node.requirement = r
            self.col_headers[r.key()] = node

        # Horizontally link columns to root
        self.matrix_root.size = sys.maxsize
        for r in all_requirements:
            self.matrix_root.attach_horiz(self.col_headers[r.key()])

        for action in self.actions:
            row_node = DLXCell()
            row_node.action = action
            self.row_headers[action.key()] = row_node

            prev = None
            for r in action.covered_requirements:
                col = self.col_headers[r.key()]
                cell = DLXCell()
                cell.col_header = col
                cell.row_header = row_node

                col.attach_vert(cell)
                col.size += 1
                if prev:
                    prev.attach_horiz(cell)
                prev = cell

                self.dlx_cells.append(cell)


    def solve(self, find_all_solutions=False, show_timing=False):
        if show_timing:
            print(f"[Timing] Build Requirements & Actions: "
                  f"{int((time.time() - self.construct_time)*1000)} ms", file=sys.stderr, flush=True)

        build_start = time.time()
        self.build_matrix()
        if show_timing:
            print(f"[Timing] DLX Matrix Build: "
                  f"{int((time.time() - build_start)*1000)} ms", file=sys.stderr, flush=True)

        search_start = time.time()
        self.search(find_all_solutions)
        if show_timing:
            print(f"[Timing] Search: "
                  f"{int((time.time() - search_start)*1000)} ms\n", file=sys.stderr, flush=True)


    def search(self, find_all_solutions):
        if self.stop_search:
            return

        # Algorithm X: Choose a Column
        #
        # Choose the column (requirement) with the best value for "sort criteria". For
        # the basic implementation of sort criteria, Algorithm X always chooses the column
        # covered by the fewest number of actions. Optional requirements are not eligible 
        # for this step.
        best_col = self.matrix_root
        best_value = sys.maxsize

        node = self.matrix_root.next_x
        while node is not self.matrix_root:

            # Optional requirements stop the search for the best column.
            if node.requirement.is_optional:
                break

            # Get the sort criteria for this requirement (column).
            v = self.requirement_sort_criteria(node)
            if v < best_value:
                best_value = v
                best_col = node
            node = node.next_x

        if best_col is self.matrix_root:
            self.process_solution()
            if self.solution_is_valid:
                self.solution_count += 1
                if not find_all_solutions:
                    self.stop_search = True
            return

        # Algorithm X: Choose a Row
        #
        # The next step is to loop through all possible actions. To prepare for this,
        # a new level of history is created. The history for this new level starts out
        # as a complete copy of the most recent history.
        self.history.append(set(self.history[-1]))

        # Loop through all possible actions in the order they were provided when identified.
        node = best_col.next_y
        while node is not best_col:
            if self.stop_search:
                break

            self.select(node)
            if self.solution_is_valid:
                self.search(find_all_solutions)
            self.deselect(node)
            node = node.next_y

            # All backtracking results in going back to a solution that is valid.
            self.solution_is_valid = True

        self.history.pop()

    # Algorithm X: Shrink Matrix Due to Row Selection
    #
    # The select method updates the matrix when a row is selected as part of a solution.
    # Other rows that satisfy overlapping requirements need to be deleted and in the end,
    # all columns satisfied by the selected row get removed from the matrix.
    def select(self, node):
        node.select()
        self.solution.append(node.row_header.action)
        self.process_row_selection(node.row_header.action)

    # Algorithm X: Rebuild Matrix Due to Row Deselection
    #
    # The select() method selects a row as part of the solution being explored. Eventually that
    # exploration ends and it is time to move on to the next row (action). Before moving on,
    # the matrix and the partial solution need to be restored to their prior states.
    def deselect(self, node):
        node.unselect()
        self.solution.pop()
        self.process_row_deselection(node.row_header.action)

    # In cases of multiplicity, this method can be used to ask Algorithm X to remember that
    # it has already tried certain things. For instance, if Emma wants two music lessons per
    # week, trying to put her first lesson on Monday at 8am is no different than trying to put
    # her second lesson on Monday at 8am. See the Algorithm X Playground for more details, 
    # specifically Mrs. Knuth - Part III.
    def remember(self, item):
        level = self.history[-1]
        if item in level:
            self.solution_is_valid = False
        else:
            level.add(item)

    # In some cases it may be beneficial to have Algorithm X try covering certain requirements
    # before others as it looks for paths through the matrix. The default is to sort the requirements
    # by how many actions cover each requirement, but in some cases there might be several 
    # requirements covered by the same number of actions. By overriding this method, the
    # Algorithm X Solver can be directed to break ties a certain way or consider another way
    # of prioritizing the requirements.
    def requirement_sort_criteria(self, col_header):
        return col_header.size

    # The following method can be overridden by a subclass to add logic to perform more detailed solution
    # checking if invalid paths are possible through the matrix. Some problems have requirements that
    # cannot be captured in the basic requirements. For instance, a solution might only be valid if it 
    # fits certain parameters that can only be checked at intermediate steps. In a case like that, this 
    # method can be overridden to add the functionality necessary to check the solution.
    #
    # If the subclass logic results in an invalid solution, the 'solution_is_valid' attribute should be set
    # to false instructing Algorithm X to stop progressing down this path in the matrix.
    def process_row_selection(self, action):
        pass

    # This method can be overridden by a subclass to add logic to perform more detailed solution
    # checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
    # process_row_selection() method above to "undo" what was done above.
    def process_row_deselection(self, action):
        pass

    # This method MUST be overridden to process a solution when it is found. If many possible solutions exist,
    # this method can be overridden to instruct Algorithm X to do something every time a solution is found.
    # For instance, Algorithm X might be looking for the best solution or maybe each solution must be
    # validated in some way. In either case, the solution_is_valid attribute can be set to false
    # if the current solution should not be considered valid and should not be generated.
    def process_solution(self):
        pass

    # ------------------------------------------------------------------
    # Debug print helpers
    # ------------------------------------------------------------------
    def print_requirements(self, n=1000000):
        print(f"Required Requirements ({len(self.requirements)}):", file=sys.stderr)
        for r in self.requirements[:n]:
            print(f"    {r.key()}", file=sys.stderr)
        print(file=sys.stderr, flush=True)


    def print_optional_requirements(self, n=1000000):
        print(f"Optional Requirements ({len(self.optional_requirements)}):", file=sys.stderr, flush=True)
        for r in self.optional_requirements[:n]:
            print(f"    {r.key()}", file=sys.stderr, flush=True)
        print(file=sys.stderr, flush=True)


    def print_me_requirements(self, n=1000000):
        print(f"ME Requirements ({len(self.me_requirements)}):", file=sys.stderr, flush=True)
        for r in self.me_requirements[:n]:
            print(f"    {r.key()}", file=sys.stderr, flush=True)
        print(file=sys.stderr, flush=True)


    def print_actions(self, n=1000000, include_covered_requirements=False):
        print(f"Actions ({len(self.actions)}):", file=sys.stderr, flush=True)
        for a in self.actions[:n]:
            print(f"    {a.key()}", file=sys.stderr, flush=True)

            if include_covered_requirements and a.covered_requirements:
                for r in a.covered_requirements:
                    print(f"        {r.key()}", file=sys.stderr, flush=True)

        print(file=sys.stderr, flush=True)
```

<BR>