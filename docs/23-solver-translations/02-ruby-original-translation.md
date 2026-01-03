# Ruby

__Translation Author:__ [@Rafarafa](https://www.codingame.com/profile/68977779383d7e4ea558c7a5446487f40556084)

Ruby is a high-level, dynamically typed programming language known for its readability and ease of use. Ruby shares many similarities with Python, such as automatic memory management and object-oriented principles.

@Rafarafa has provided a word for word translation, even preserving the comments found in the provided Python code. Using the Ruby solver below is extremely similar to the Python examples found in the playground.

---

# Key Difference

My Python [`AlgorithmXSolver`](../03-AlgorithmXSolver/01-the-AlgorithmXSolver.md#using-the-algorithmxsolver-class) makes extensive use of `tuple`s. Because Ruby does not have `tuple`s, you will use `array`s for requirements and actions. These `array`s will be used as keys in a `hash`, so take appropriate care to ensure the `array` elements never change.

Be sure to scan through @Rafarafa's other comments for information regarding other minor differences.

---

# Example - 9x9 Sudoku

```ruby
class SudokuSolver < AlgorithmXSolver
  
  def initialize(grid, values)

    # Build requirements and actions.
    
    super(requirements, actions)
  end
end

n = 9
grid = n.times.map { gets.chomp.split("") }
solver = SudokuSolver.new(grid, [*"1"..n.to_s].take(n).join)
solution = solver.solve.take(1).first

solution.each do | _, row, col, val|
  grid[row][col] = val
end
```

---

# The Solver Code

```ruby
# Last edit: 2025-01-15 by @Rafarafa
#
# Port to ruby of @Timinator's python implementation:
# https://www.algorithm-x.com/03-AlgorithmXSolver/01-the-AlgorithmXSolver/
#
# The comments have been preserved verbatim, except for the necessary
# changes to match ruby's conventions (__init__ > initialize etc.)

################################################
################################################

require 'set'

#  This solution uses Knuth's Algorithm X and his Dancing Links (DLX):
#  (DLX-Based Algorithm X Solver Last Revised 01 December 2024)
#
#  For a detailed explanation and tutorial, please visit:
#
#  https://www.algorithm-x.com
#

#  DLXCell is one cell in the Algorithm X matrix. This implementation was mostly
#  copied from @RoboStac's solution to Constrained Latin Squares on www.codingame.com.
#
#  https://www.codingame.com/training/medium/constrained-latin-squares
#
class DLXCell
  attr_accessor :prev_x, :next_x, :prev_y, :next_y, :col_header, :row_header, :title, :size

  def initialize(title = nil)
    @prev_x = self
    @next_x = self
    @prev_y = self
    @next_y = self

    @col_header = nil
    @row_header = nil

    # Only used for column and row headers
    @title = title

    # Size quickly identifies how many rows are in any particular column
    @size = 0
  end

  def remove_x
    @prev_x.next_x = @next_x
    @next_x.prev_x = @prev_x
  end

  def remove_y
    @prev_y.next_y = @next_y
    @next_y.prev_y = @prev_y
  end

  def restore_x
    @prev_x.next_x = self
    @next_x.prev_x = self
  end

  def restore_y
    @prev_y.next_y = self
    @next_y.prev_y = self
  end

  def attach_horiz(other)
    n = @prev_x
    other.prev_x = n
    n.next_x = other
    @prev_x = other
    other.next_x = self
  end

  def attach_vert(other)
    n = @prev_y
    other.prev_y = n
    n.next_y = other
    @prev_y = other
    other.next_y = self
  end

  def remove_column
    remove_x
    node = @next_y
    while node != self
      node.remove_row
      node = node.next_y
    end
  end

  def restore_column
    node = @prev_y
    while node != self
      node.restore_row
      node = node.prev_y
    end
    restore_x
  end

  def remove_row
    node = @next_x
    while node != self
      node.col_header.size -= 1
      node.remove_y
      node = node.next_x
    end
  end

  def restore_row
    node = @prev_x
    while node != self
      node.col_header.size += 1
      node.restore_y
      node = node.prev_x
    end
  end

  def select
    node = self
    loop do
      node.remove_y
      node.col_header.remove_column
      node = node.next_x
      break if node == self
    end
  end

  def unselect
    node = @prev_x
    while node != self
      node.col_header.restore_column
      node.restore_y
      node = node.prev_x
    end
    node.col_header.restore_column
    node.restore_y
  end
end

class AlgorithmXSolver
  attr_accessor :solution, :solution_count, :history, :solution_is_valid

  # R - an array of requirements. The initialize() method converts R to a hash, but R must
  #     originally be passed in as a simple array of requirements. Each requirement is an array
  #     of values that uniquely identify that requirement from all other requirements.
  #
  # A - must be passed in as a hash - keys are actions, values are arrays of covered requirements
  #
  # O - array of optional requirements. They can be covered, but they never cause failure.
  #     Optional requirements are important because if they get covered, no other action can
  #     also cover that same requirement. Also referred to as "at-most-one-time constraints".
  #
  def initialize(requirements, actions, optional = [])
    @A = actions
    @R = requirements + optional
    @O = optional.to_set

    # The array of actions (rows) that produce the current path through the matrix.
    @solution = []
    @solution_count = 0

    # A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
    # In the basic Solver, nothing is ever put into the history. A subclass can override
    # the _process_row_selection() method to add history in cases of multiplicity.
    @history = [Set.new]

    # For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
    # can add functionality to check solutions as they are being built to steer away from
    # invalid solutions. The basic Algorithm X Solver never modifies this attribute.
    @solution_is_valid = true

    # Create a column in the matrix for every requirement.
    @matrix_root = DLXCell.new
    @matrix_root.size = 10_000_000
    @matrix_root.title = 'root'

    @col_headers = @R.map { |requirement| DLXCell.new(requirement) }

    # Row headers are never attached to the rest of the DLX matrix. They are only used
    # currently to keep track of the action associated with each row.
    @row_headers = Hash[@A.keys.map { |action| [action, DLXCell.new(action)] }]

    @R = Hash[@R.zip(@col_headers)]

    @col_headers.each { |col_header| @matrix_root.attach_horiz(col_header) }

    # Create a row in the matrix for every action.
    @A.each do |action, covered_requirements|
      previous_cell = nil

      covered_requirements.each do |requirement|
        next_cell = DLXCell.new
        next_cell.col_header = @R[requirement]
        next_cell.row_header = @row_headers[action]
        next_cell.col_header.attach_vert(next_cell)
        next_cell.col_header.size += 1

        if previous_cell
          previous_cell.attach_horiz(next_cell)
        else
          previous_cell = next_cell
        end
      end
    end
  end

  def solve
    # Proxy to emulate Python yield semantics.
    #
    # If only a set amount of solutions is required, this should be called
    # together with the `take` method. Note that if we `take` n elements, it 
    # forces an early exit as soon as we reach those n elements, resulting
    # in a performance increase.
    #
    # That is, if you only want the first solution do:
    # >>> solution = solver.solve.take(1).first
    # 
    # Instead of:
    # >>> solution = solver.solve.next
    #
    # Since this last one will still explore after finding the first solution.
    # Note that this can cause "stack level too deep (SystemStackError)" on
    # very demanding puzzles such as 25x25 Sudoku.
    Enumerator.new { |yielder| solve_go(yielder) }
  end

  def solve_go(yielder)
    # Algorithm X Step 1:
    #
    # Choose the column (requirement) with the best value for "sort criteria". For
    # the basic implementation of sort criteria, Algorithm X always chooses the column
    # covered by the fewest number of actions. Optional requirements are not eligible
    # for this step.
    best_column = @matrix_root
    best_value = 'root'

    node = @matrix_root.next_x
    while node != @matrix_root
      # Optional requirements (at-most-one-time constraints) are never chosen as best.
      if !@O.include?(node.title)
        # Get the sort criteria for this requirement (column).
        value = _requirement_sort_criteria(node)
        if best_column == @matrix_root || value < best_value
          best_column = node
          best_value = value
        end
        node = node.next_x
      else
        # Optional requirements stop the search for the best column.
        node = @matrix_root
      end
    end

    if best_column == @matrix_root
      _process_solution
      if @solution_is_valid
        @solution_count += 1
        yielder << @solution.dup
      end
      return
    end

    # Build an array of all actions (rows) that cover the chosen requirement (column).
    actions = []
    node = best_column.next_y
    while node != best_column
      actions << node
      node = node.next_y
    end

    # The next step is to loop through all possible actions. To prepare for this,
    # a new level of history is created. The history for this new level starts out
    # as a complete copy of the most recent history.
    @history.push(@history.last.dup)

    # Loop through the possible actions sorted by the given sort criteria. A basic
    # Algorithm X implementation does not provide sort criteria. Actions are tried
    # in the order they happen to occur in the matrix.
    actions.sort_by { |n| _action_sort_criteria(n.row_header) }.each do |node|
      select(node: node)
      solve_go(yielder) if @solution_is_valid
      deselect(node: node)

      # All backtracking results in going back to a solution that is valid.
      @solution_is_valid = true
    end

    @history.pop
  end

  # Algorithm X Step 4 - Details:
  #
  # The select method updates the matrix when a row is selected as part of a solution.
  # Other rows that satisfy overlapping requirements need to be deleted and in the end,
  # all columns satisfied by the selected row get removed from the matrix.
  def select(node:)
    node.select
    @solution << node.row_header.title
    _process_row_selection(node.row_header.title)
  end

  # Algorithm X Step 4 - Clean Up:
  #
  # The select() method selects a row as part of the solution being explored. Eventually that
  # exploration ends and it is time to move on to the next row (action). Before moving on,
  # the matrix and the partial solution need to be restored to their prior states.
  def deselect(node:)
    node.unselect
    @solution.pop
    _process_row_deselection(node.row_header.title)
  end

  # In cases of multiplicity, this method can be used to ask Algorithm X to remember that
  # it has already tried certain things. For instance, if Emma wants two music lessons per
  # week, trying to put her first lesson on Monday at 8am is no different than trying to put
  # her second lesson on Monday at 8am. See the Algorithm X Playground for more details,
  # specifically Mrs. Knuth - Part III.
  def _remember(item_to_remember)
    if @history.last.include?(item_to_remember)
      @solution_is_valid = false
    else
      @history.last.add(item_to_remember)
    end
  end

  # In some cases it may be beneficial to have Algorithm X try certain paths through the matrix.
  # This can be the case when there is reason to believe certain actions have a better chance than
  # other actions at producing complete paths through the matrix. The method included here does
  # nothing, but can be overridden to influence the order in which Algorithm X tries rows (actions)
  # that cover some particular column.
  def _action_sort_criteria(_row_header)
    0
  end

  # In some cases it may be beneficial to have Algorithm X try covering certain requirements
  # before others as it looks for paths through the matrix. The default is to sort the requirements
  # by how many actions cover each requirement, but in some cases there might be several
  # requirements covered by the same number of actions. By overriding this method, the
  # Algorithm X Solver can be directed to break ties a certain way or consider another way
  # of prioritizing the requirements.
  def _requirement_sort_criteria(col_header)
    col_header.size
  end

  # The following method can be overridden by a subclass to add logic to perform more detailed solution
  # checking if invalid paths are possible through the matrix. Some problems have requirements that
  # cannot be captured in the basic requirements array passed into the initialize() method. For instance,
  # a solution might only be valid if it fits certain parameters that can only be checked at intermediate
  # steps. In a case like that, this method can be overridden to add the functionality necessary to
  # check the solution.
  #
  # If the subclass logic results in an invalid solution, the 'solution_is_valid' attribute should be set
  # to False instructing Algorithm X to stop progressing down this path in the matrix.
  def _process_row_selection(row); end

  # This method can be overridden by a subclass to add logic to perform more detailed solution
  # checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
  # _process_row_selection() method above to "undo" what was done above.
  def _process_row_deselection(row); end

  # This method can be overridden to instruct Algorithm X to do something every time a solution is found.
  # For instance, Algorithm X might be looking for the best solution or maybe each solution must be
  # validated in some way. In either case, the solution_is_valid attribute can be set to False
  # if the current solution should not be considered valid and should not be generated.
  def _process_solution; end
end
```

<BR>