# Ruby

The following Ruby translation of `AlgorithmXSolver` is derived from the C++ version, which serves as the recommended reference for its structure, algorithms, and overall design.

Detailed explanations have been omitted, as they align closely with the discussion in the [C++ version](../23-solver-translations/05-cpp.md).

---

# Problem-Specific Requirements

```ruby
class CellCovered < Requirement
  attr_reader :row, :col

def self.make_key(r, c)
    "cell covered #{r} #{c}"
  end

  def initialize(r, c)
    super(self.class.make_key(r, c))
    @row = r
    @col = c
  end
end

class ValInRow < Requirement
  attr_reader :row, :val;

  def self.make_key(r, v)
    "val in row #{r} #{v}"
  end

  def initialize(r, v)
    super(self.class.make_key(r, v))
    @row = r
    @val = v
  end
end

class ValInCol < Requirement
  attr_reader :col, :val;

  def self.make_key(c, v)
    "val in col #{c} #{v}"
  end

  def initialize(c, v)
    super(self.class.make_key(c, v))
    @col = c
    @val = v
  end
end

class ValInBox < Requirement
  attr_reader :box, :val;

  def self.make_key(b, v)
    "val in box #{b} #{v}"
  end

  def initialize(b, v)
    super(self.class.make_key(b, v))
    @box = b
    @val = v
  end
end
```

---

# Problem-Specific Actions

```ruby
class PlaceValue < Action
  attr_reader :row, :col, :val

  def self.make_key(r, c, v)
    "place value #{r} #{c} #{v}"
  end

  def initialize(r, c, v)
    super(self.class.make_key(r, c, v))
    @row = r
    @col = c
    @val = v
  end
end
```

---

# Example - 9x9 Sudoku

```ruby
class SudokuSolver < AlgorithmXSolver

  def initialize(grid, values)
    super()
    @grid = grid

    # Build the requirements - for instance:

    # The cell at (0, 0) must be covered:
    add_requirement(CellCovered.new(0, 0))

    # There must be a '3' in the first row, the first col and the first box:
    add_requirement(ValInRow.new(0, '3'))
    add_requirement(ValInCol.new(0, '3'))
    add_requirement(ValInBox.new(0, '3'))

    # Build the actions and attach the covered requirements.

    # Consider the single action of putting a '6' at location (2, 2):
    action = add_action(PlaceValue.new(2, 2, '6'))

    attach_requirement(action, CellCovered.make_key(2, 2))
    attach_requirement(action, ValInRow.make_key(2, '6'))
    attach_requirement(action, ValInCol.make_key(2, '6'))
    attach_requirement(action, ValInBox.make_key(0, '6'))
  end

  def process_solution
    @solution.each do |action|

      # Use the attributes of the action to build the solution:
      #      action.row
      #      action.col
      #      action.val

    end
  end
end


// read input

solver = SudokuSolver.new(grid, ALL_VALUES)
solver.solve()

grid.each { |row| puts row }
```

---

# Mutual Exclusivity

MERequirement Definition:

```ruby
class LoudInstrument < MERequirement
  def self.make_key(day, hour)
    "#{day} #{hour}"
  end

  def initialize(day, hour1, hour2)
    super(self.class.make_key(day, hour1),
          self.class.make_key(day, hour2))
  end
end
```

Registration:

```ruby
    add_me_requirement(LoudInstrument.new('F', 8, 9));
    add_me_requirement(LoudInstrument.new('F', 9, 10));
    add_me_requirement(LoudInstrument.new('F', 10, 11));
```

Usage:

```ruby
    if LOUD_INSTRUMENTS.include?(student.instrument)
      attach_me_requirements(action, LoudInstrument.make_key(day, hour))
    end
```

---

# Multiplicity

Add `@to_remember`:

```ruby
class PlaceStudent < Action
  attr_reader # create public getter methods for instance variables
  attr_reader :to_remember 

  def self.make_key()
    " ... " # unique string key for the action
  end

  def initialize()
    super(self.class.make_key())
    # initialize other attributes ...
    
    # Build a string that identifies what should be remembered about this action.
    @to_remember = "#{student.name} #{day} #{hour}"
  end
end
```

Override `proces_row_selection`:

```ruby
  def process_row_selection(action)
    remember(action.to_remember)
  end
```

---

# Debug Print Helpers

- `print_requirements(n = 1000000)`
- `print_optional_requirements(n = 1000000)`
- `print_me_requirements(n = 1000000)`
- `print_actions(n = 1000000, include_covered_requirements = false)`

---

# The Solver Code

```ruby
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

require 'set'

# -------------------------------------------------------------
#
#  DLXCell is one cell in the Algorithm X matrix. This implementation was mostly
#  copied from @RoboStac's solution to Constrained Latin Squares on www.codingame.com.
#
#  https://www.codingame.com/training/medium/constrained-latin-squares
#
# -------------------------------------------------------------
class DLXCell
  attr_accessor :prev_x, :next_x, :prev_y, :next_y
  attr_accessor :col_header, :row_header
  attr_accessor :requirement, :action
  attr_accessor :size

  def initialize
    @prev_x = @next_x = self
    @prev_y = @next_y = self
    @col_header = nil
    @row_header = nil
    @requirement = nil
    @action = nil

    # Size quickly identifies how many rows are in any particular column.
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

# -------------------------------------------------------------
# Requirement & MERequirement Base Classes
# -------------------------------------------------------------
class Requirement
  attr_accessor :key, :is_optional

  def initialize(key)
    @key = key
    @is_optional = false
  end
end

class MERequirement < Requirement
  attr_reader :a, :b

  def self.make_me_key(x, y)
    x < y ? "#{x} -me- #{y}" : "#{y} -me- #{x}"
  end

  def initialize(aa, bb)
    super(self.class.make_me_key(aa, bb))
    if aa < bb
      @a, @b = aa, bb
    else
      @a, @b = bb, aa
    end
    @is_optional = true
  end
end

# -------------------------------------------------------------
# Action Base Class
# -------------------------------------------------------------
class Action
  attr_reader :key, :covered_requirements

  def initialize(key)
    @key = key
    @covered_requirements = []
  end
end

# -------------------------------------------------------------
# AlgorithmXSolver Base Class with DLX engine
# -------------------------------------------------------------
class AlgorithmXSolver
  attr_reader :solution_count

  def initialize
    @construct_time = Time.now

    # Requirement/Action containers
    @requirements = []
    @optional_requirements = []
    @me_requirements = []
    @actions = []

    # Lookup tables mapping requirement keys (strings) to requirement pointers.
    @requirements_lookup = {}
    @me_lookup = {}
    @me_lists = Hash.new { |h, k| h[k] = [] }

    #  DLX structures
    @matrix_root = DLXCell.new
    @col_headers = {}
    @row_headers = {}
    @dlx_cells = []

    # The list of actions (rows) that produce the current path through the matrix.
    @solution = []

    # When stop_search is true, the search method knows a solution has been found and
    # the depth-first search is quickly unwound and the search method is exited.
    @stop_search = false

    # For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
    # can add functionality to check solutions as they are being built to steer away from
    # invalid solutions. The basic Algorithm X Solver never modifies this attribute.
    @solution_is_valid = true

    # A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
    # In the basic Solver, nothing is ever put into the history. A subclass can override
    # the process_row_selection() method to add history in cases of multiplicity. 
    @history = [Set.new]

    @solution_count = 0
  end

  # ------------------------------------------------------------------
  # Requirement/Action helpers
  # ------------------------------------------------------------------
  def add_requirement(req)
    @requirements_lookup[req.key] = req
    @requirements << req
  end

  def add_optional_requirement(req)
    req.is_optional = true
    @requirements_lookup[req.key] = req
    @optional_requirements << req
  end

  def add_me_requirement(req)
    # Check for duplicate MERequirement
    return if @me_lookup.key?(req.key)

    @me_requirements << req
    @me_lookup[req.key] = req
    @me_lists[req.a] << req
    @me_lists[req.b] << req
  end

  def add_action(action)
    @actions << action
    action
  end

  def attach_requirement(action, key)
    req = @requirements_lookup[key]
    raise "Requirement not found: #{key}" unless req
    action.covered_requirements << req
  end

  def attach_me_requirements(action, key)
    @me_lists[key].each { |r| action.covered_requirements << r }
  end

  # ------------------------------------------------------------------
  # DLX matrix builder (called automatically in solve)
  # ------------------------------------------------------------------
  def build_matrix
    raise "build_matrix called twice" unless @col_headers.empty?

    # Merge all requirements into one list: required → optional → me.
    # Required requirements must precede optional requirements in header order.
    # Search stops scanning columns when first optional requirement is encountered.
    all_requirements = @requirements + @optional_requirements + @me_requirements

    # Create column headers
    all_requirements.each do |r|
      node = DLXCell.new
      node.requirement = r
      @col_headers[r.key] = node
    end

    # Horizontally link columns to root
    @matrix_root.size = Float::INFINITY
    all_requirements.each do |r|
      @matrix_root.attach_horiz(@col_headers[r.key])
    end

    # Create a row in the matrix for every action.
    @actions.each do |action|
      row_node = DLXCell.new
      row_node.action = action
      @row_headers[action.key] = row_node

      prev = nil
      action.covered_requirements.each do |r|
        col = @col_headers[r.key]
        cell = DLXCell.new
        cell.col_header = col
        cell.row_header = row_node

        col.attach_vert(cell)
        col.size += 1
        prev.attach_horiz(cell) if prev
        prev = cell

        @dlx_cells << cell
      end
    end
  end

  def solve(find_all_solutions = false, show_timing = false)
    solve_start = Time.now

    if show_timing
      init_ms = ((solve_start - @construct_time) * 1000).to_i
      STDERR.puts "[Timing] Build Requirements & Actions: #{init_ms} ms"
    end

    build_start = Time.now
    build_matrix
    build_end = Time.now

    if show_timing
      build_ms = ((build_end - build_start) * 1000).to_i
      STDERR.puts "[Timing] DLX Matrix Build: #{build_ms} ms"
    end

    search_start = Time.now
    search(find_all_solutions)
    search_end = Time.now

    if show_timing
      search_ms = ((search_end - search_start) * 1000).to_i
      STDERR.puts "[Timing] Search: #{search_ms} ms"
      STDERR.puts
    end
  end

  protected

  def search(find_all_solutions)
    return if @stop_search

    # Algorithm X: Choose a Column
    #
    # Choose the column (requirement) with the best value for "sort criteria". For
    # the basic implementation of sort criteria, Algorithm X always chooses the column
    # covered by the fewest number of actions. Optional requirements are not eligible 
    # for this step.
    best_col = @matrix_root
    best_value = Float::INFINITY

    node = @matrix_root.next_x
    while node != @matrix_root
      
      # Optional requirements stop the search for the best column.
      break if node.requirement.is_optional
      
      # Get the sort criteria for this requirement (column).
      v = requirement_sort_criteria(node)
      if v < best_value
        best_value = v
        best_col = node
      end
      node = node.next_x
    end

    if best_col == @matrix_root
      process_solution
      if @solution_is_valid
        @solution_count += 1
        @stop_search = true unless find_all_solutions
      end
      return
    end

    # Algorithm X: Choose a Row
    #
    # The next step is to loop through all possible actions. To prepare for this,
    # a new level of history is created. The history for this new level starts out
    # as a complete copy of the most recent history.
    @history << @history.last.dup

    # Loop through all possible actions in the order they were provided when identified.
    node = best_col.next_y
    while node != best_col
      break if @stop_search
      select(node)
      search(find_all_solutions) if @solution_is_valid
      deselect(node)
      node = node.next_y

      # All backtracking results in going back to a solution that is valid.
      @solution_is_valid = true
    end

    @history.pop
  end

  # Algorithm X: Shrink Matrix Due to Row Selection
  #
  # The select method updates the matrix when a row is selected as part of a solution.
  # Other rows that satisfy overlapping requirements need to be deleted and in the end,
  # all columns satisfied by the selected row get removed from the matrix.
  def select(node)
    node.select
    @solution << node.row_header.action
    process_row_selection(node.row_header.action)
  end

  # Algorithm X: Rebuild Matrix Due to Row Deselection
  #
  # The select() method selects a row as part of the solution being explored. Eventually that
  # exploration ends and it is time to move on to the next row (action). Before moving on,
  # the matrix and the partial solution need to be restored to their prior states.
  def deselect(node)
    node.unselect
    @solution.pop
    process_row_deselection(node.row_header.action)
  end

  # In cases of multiplicity, this method can be used to ask Algorithm X to remember that
  # it has already tried certain things. For instance, if Emma wants two music lessons per
  # week, trying to put her first lesson on Monday at 8am is no different than trying to put
  # her second lesson on Monday at 8am. See the Algorithm X Playground for more details, 
  # specifically Mrs. Knuth - Part III.
  def remember(item)
    current = @history.last
    if current.include?(item)
      @solution_is_valid = false
    else
      current.add(item)
    end
  end

  # In some cases it may be beneficial to have Algorithm X try covering certain requirements
  # before others as it looks for paths through the matrix. The default is to sort the requirements
  # by how many actions cover each requirement, but in some cases there might be several 
  # requirements covered by the same number of actions. By overriding this method, the
  # Algorithm X Solver can be directed to break ties a certain way or consider another way
  # of prioritizing the requirements.
  def requirement_sort_criteria(col)
    col.size
  end

  # The following method can be overridden by a subclass to add logic to perform more detailed solution
  # checking if invalid paths are possible through the matrix. Some problems have requirements that
  # cannot be captured in the basic requirements. For instance, a solution might only be valid if it 
  # fits certain parameters that can only be checked at intermediate steps. In a case like that, this 
  # method can be overridden to add the functionality necessary to check the solution.
  #
  # If the subclass logic results in an invalid solution, the 'solution_is_valid' attribute should be set
  # to false instructing Algorithm X to stop progressing down this path in the matrix.
  def process_row_selection(_action); end
  
  # This method can be overridden by a subclass to add logic to perform more detailed solution
  # checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
  # process_row_selection() method above to "undo" what was done above.
  def process_row_deselection(_action); end
  
  # This method MUST be overridden to process a solution when it is found. If many possible solutions exist,
  # this method can be overridden to instruct Algorithm X to do something every time a solution is found.
  # For instance, Algorithm X might be looking for the best solution or maybe each solution must be
  # validated in some way. In either case, the solution_is_valid attribute can be set to false
  # if the current solution should not be considered valid and should not be generated.
  def process_solution; end

  # ------------------------------------------------------------------
  # Debug print helpers
  # ------------------------------------------------------------------
  def print_requirements(n = 1000000)
    STDERR.puts "Required Requirements (#{@requirements.size}):"
    @requirements.take(n).each do |r|
      STDERR.puts "    #{r.key}"
    end
    STDERR.puts
  end

  def print_optional_requirements(n = 1000000)
    STDERR.puts "Optional Requirements (#{@optional_requirements.size}):"
    @optional_requirements.take(n).each do |r|
      STDERR.puts "    #{r.key}"
    end
    STDERR.puts
  end

  def print_me_requirements(n = 1000000)
    STDERR.puts "ME Requirements (#{@me_requirements.size}):"
    @me_requirements.take(n).each do |r|
      STDERR.puts "    #{r.key}"
    end
    STDERR.puts
  end

  def print_actions(n = 1000000, include_covered_requirements = false)
    STDERR.puts "Actions (#{@actions.size}):"
    @actions.take(n).each do |a|
      STDERR.puts "    #{a.key}"
      if include_covered_requirements && !a.covered_requirements.empty?
        a.covered_requirements.each do |r|
          STDERR.puts "        #{r.key}"
        end
      end
    end
    STDERR.puts
  end
end
```

<BR>