# PHP

__Translation Author:__ [@TBali](https://www.codingame.com/profile/08e6e13d9f7cad047d86ec4d10c777500155033)

PHP is a high-level, interpreted language primarily used for web development. Its deep integration with HTML makes it a popular choice for server-side scripting. While PHP supports many modern programming constructs, it lacks native support for `tuple`s — structures that are frequently used in my Python-based `AlgorithmXSolver`, particularly as dictionary keys.

To address this, @TBali defines classes for both requirements and actions. Each instance of these classes includes a unique string stored in a `hash` attribute. In the PHP implementation of `AlgorithmXSolver`, these unique strings are used in place of Python's `tuple`s. This approach results in a smooth and intuitive user experience that closely mirrors the original Python logic.

---

# Abstract Requirements and Actions

The next code snippet shows the abstract classes for requirements and actions provided with the PHP `AlgorithmXSolver`. Each problem-specific implementation must define subclasses that extend these two classes.

```php
<?php
// --------------------------------------------------------------------
/**
 * A single requirement to be used in the solver.
 *
 * Actual puzzle requirement class shall extend this and set its `hash` property in its constructor.
 */
abstract class Requirement
{
    /**
     * @var string
     */
    protected $hash;

    public function hash(): string
    {
        return $this->hash;
    }
}


// --------------------------------------------------------------------
/**
 * A single action to be used in the solver.
 *
 * Actual puzzle requirement class shall extend this and set its `hash` property in its constructor.
 * Before passing list of actions to the solver, the `reqs` property must be filled with list of requirements.
 */
abstract class Action
{
    /** @var string */
    protected $hash;

    /**
     * The list of requirements that this action covers.
     *
     * @var array<int, Requirement>
     */
    public $reqs = [];

    public function hash(): string
    {
        return $this->hash;
    }
}
?>
```

---

# Problem-Specific Requirements and Actions

To use @TBali’s PHP solver, you must first create subclasses for your problem-specific requirements and actions.  These subclasses must assign a string value to the inherited `hash` attribute. Consider 9x9 Sudoku, where there are four types of requirements:

1. Every cell must contain exactly one value.
1. Each value must appear exactly once in every row.
1. Each value must appear exactly once in every column.
1. Each value must appear exactly once in every 3×3 box.

To represent these constraints, I define four separate subclasses — each corresponding to one of the above requirements — all inheriting from the generic `Requirement` base class.

Each subclass assigns a string to the inherited `hash` attribute. The string format is intentionally designed to resemble the tuple representations used in my Python-based implementation, preserving clarity and structure.

```php
<?php
class CellCovered extends Requirement
{
    /** @var int */
    public $row;
    /** @var int */
    public $col;

    public function __construct(int $row, int $col)
    {
        $this->row = $row;
        $this->col = $col;
        $this->hash = "cell covered $row $col";
    }
}


class ValueInRow extends Requirement
{
    /** @var int */
    public $row;
    /** @var string */
    public $val;

    public function __construct(int $row, string $val)
    {
        $this->row = $row;
        $this->val = $val;
        $this->hash ="value in row $row $val";
    }
}


class ValueInCol extends Requirement
{
    /** @var int */
    public $col;
    /** @var string */
    public $val;

    public function __construct(int $col, string $val)
    {
        $this->col = $col;
        $this->val = $val;
        $this->hash = "value in col $col $val";
    }
}

class ValueInBox extends Requirement
{
    /** @var int */
    public $box;
    /** @var string */
    public $val;

    public function __construct(int $box, string $val)
    {
        $this->box = $box;
        $this->val = $val;
        $this->hash = "value in box $box $val";
    }
}
?>
```

Next, a problem-specific subclass must be declared that extends the abstract `Action` class.

```php
<?php
class PlaceValue extends Action
{
    /** @var int */
    public $row;
    /** @var int */
    public $col;
    /** @var string */
    public $val;

    public function __construct(int $row, int $col, string $val)
    {
        $this->row = $row;
        $this->col = $col;
        $this->val = $val;
        $this->hash = "place value $row $col $val";
    }
}
?>
```

# Example - 9x9 Sudoku

```php
<?php
class SudokuSolver extends AlgorithmXSolver {

    public function __construct(array $grid, string $values) {

        $requirements = [];
        $actions = [];

        # Build the requirements and actions. Remember that the `req` attribute inherited
        # from the abstract class Action is a list that must contain all the requirements
        # covered by the action.

        parent::__construct($requirements, $actions);
   }
}


$solver = new SudokuSolver($sudoku, '123456789');

foreach ($solver->solve() as $solution) {
    foreach ($solution as $action) {

        # Use the attributes of the $action to build the solution:
        #      $action->row
        #      $action->col
        #      $action->val

    }
    break;
}

# print the solution
?>
```

---

# Mutual Exclusivity

My Python-based implementation uses `tuple`s to create requirements for [mutual exclusivity](../07-generalized-exact-cover/03-mutually-exclusive-actions.md). The PHP `AlgorithmXSolver` code comes with an `MERequirement` class that takes 2 strings in its constructor, each string uniquely identifying one of the mutually exclusive items. The following code implements the `me_requirement`s for loud instruments as seen in [Mrs. Knuth Part II](../07-generalized-exact-cover/08-your-solver.md):

```php
<?php
    $me_requirements = [New MERequirement("loud instrument F 8", "loud instrument F 9"), 
                        New MERequirement("loud instrument F 9", "loud instrument F 10"),
                        New MERequirement("loud instrument F 10", "loud instrument F 11")];
?>
```

Of course, you will be using loops in your solution and your ultimate code will look more similar to:

```php
<?php
    $me_requirements[] = New MERequirement("loud instrument $day $hour_1", "loud instrument $day $hour_2"); 
?>
```

The `MERequirement` class includes a `contains(string $me_item)` method to make searching for covered requirements easy when identifying requirements covered by an action:

```php
<?php
    if (in_array($student->instrument, LOUD_INSTRUMENTS)) {
        $me_item = "loud instrument $day $hour";
        foreach ($me_requirements as $me) {
            if ($me->contains($me_item)) {
                $action->reqs[] = $me;
            }
        }
    }
?>
```

---

# Multiplicity

The Python `AlgorithmXSolver` uses memory to avoid redundant searches by adding `tuple`s of data to the solver's memory. In the PHP solver, the same functionality exists, but a `string` of data must be passed to the `remember()` method instead of a `tuple`. Implementing the [Mrs. Knuth Part III](../09-multiplicity/05-memory.md) example discussed in the Python section looks like this:

```php
<?php
    protected function process_row_selection(Action $row): void
    {
        $this->remember("$row->name $row->day $row->hour");
    }
?>
```

---

# The Solver Code

```php
<?php
// --------------------------------------------------------------------
/**
 * Last edit: 2025-05-15 by @TBali
 *
 * Port to PHP of @Timinator's python implementation:
 * @see https://www.algorithm-x.com/03-AlgorithmXSolver/01-the-AlgorithmXSolver/
 *
 * @see https://en.wikipedia.org/wiki/Dancing_Links
 */

// --------------------------------------------------------------------
/**
 * A single cell in the matrix for a DLX-based Algorithm X solver.
 * Based on a Python code made by @Timinator, which was in turn based on a code by @RoboStac.
 */
class DLXCell
{
    /** @var DLXCell */
    public $prev_x;
    /** @var DLXCell */
    public $next_x;
    /** @var DLXCell */
    public $prev_y;
    /** @var DLXCell */
    public $next_y;
    /** @var DLXCell */
    public $col_header;
    /** @var DLXCell */
    public $row_header;

    /**
     * Only used for column and row headers.
     *
     * @var null|Action|Requirement|string
     */
    public $title;

    /**
     * Size quickly identifies how many rows are in any particular column.
     *
     * @var int
     */
    public $size = 0;

    public function __construct(?string $title = null)
    {
        $this->prev_x = $this;
        $this->next_x = $this;
        $this->prev_y = $this;
        $this->next_y = $this;
        $this->title = $title;
    }

    public function remove_x(): void
    {
        $this->prev_x->next_x = $this->next_x;
        $this->next_x->prev_x = $this->prev_x;
    }

    public function remove_y(): void
    {
        $this->prev_y->next_y = $this->next_y;
        $this->next_y->prev_y = $this->prev_y;
    }

    public function restore_x(): void
    {
        $this->prev_x->next_x = $this;
        $this->next_x->prev_x = $this;
    }

    public function restore_y(): void
    {
        $this->prev_y->next_y = $this;
        $this->next_y->prev_y = $this;
    }

    public function attach_horiz(self $other): void
    {
        $node = $this->prev_x;
        $other->prev_x = $node;
        $node->next_x = $other;
        $this->prev_x = $other;
        $other->next_x = $this;
    }

    public function attach_vert(self $other): void
    {
        $node = $this->prev_y;
        $other->prev_y = $node;
        $node->next_y = $other;
        $this->prev_y = $other;
        $other->next_y = $this;
    }

    public function remove_column(): void
    {
        $this->remove_x();
        $node = $this->next_y;
        while ($node !== $this) {
            $node->remove_row();
            $node = $node->next_y;
        }
    }

    public function restore_column(): void
    {
        $node = $this->prev_y;
        while ($node !== $this) {
            $node->restore_row();
            $node = $node->prev_y;
        }
        $this->restore_x();
    }

    public function remove_row(): void
    {
        $node = $this->next_x;
        while ($node !== $this) {
            --$node->col_header->size;
            $node->remove_y();
            $node = $node->next_x;
        }
    }

    public function restore_row(): void
    {
        $node = $this->prev_x;
        while ($node !== $this) {
            ++$node->col_header->size;
            $node->restore_y();
            $node = $node->prev_x;
        }
    }

    public function select(): void
    {
        $node = $this;
        do {
            $node->remove_y();
            $node->col_header->remove_column();
            $node = $node->next_x;
        } while ($node !== $this);
    }

    public function unselect(): void
    {
        $node = $this->prev_x;
        while ($node !== $this) {
            $node->col_header->restore_column();
            $node->restore_y();
            $node = $node->prev_x;
        }
        $node->col_header->restore_column();
        $node->restore_y();
    }
}


// --------------------------------------------------------------------
/**
 * A single requirement to be used in the solver.
 *
 * Actual puzzle requirement class shall extend this and set its `hash` property in its constructor.
 */
abstract class Requirement
{
    /**
     * @var string
     */
    protected $hash;

    public function hash(): string
    {
        return $this->hash;
    }
}


// --------------------------------------------------------------------
/**
 * A single requirement to be used in the solver to enforce mutual exclusivity.
 * 
 * @see https://www.codingame.com/playgrounds/156252/algorithm-x/mutual-exclusivity
 * @see https://www.codingame.com/playgrounds/156252/algorithm-x/php
 * 
 */
class MERequirement extends Requirement
{
    /** @var string */
    public $me_item_1;
    /** @var string */
    public $me_item_2;

    public function __construct(string $me_item_1, string $me_item_2)
    {
        $this->me_item_1 = $me_item_1;
        $this->me_item_2 = $me_item_2;
        $this->hash = $me_item_1 . " " . $me_item_2;
    }

    public function contains(string $me_item) : bool
    {
        return $me_item === $this->me_item_1 || $me_item === $this->me_item_2;
    }
}


// --------------------------------------------------------------------
/**
 * A single action to be used in the solver.
 *
 * Actual puzzle requirement class shall extend this and set its `hash` property in its constructor.
 * Before passing list of actions to the solver, the `reqs` property must be filled with list of requirements.
 */
abstract class Action
{
    /** @var string */
    protected $hash;

    /**
     * The list of requirements that this action covers.
     *
     * @var array<int, Requirement>
     */
    public $reqs = [];

    public function hash(): string
    {
        return $this->hash;
    }
}


// --------------------------------------------------------------------
/**
* DLX-based Algorithm X solver.
*
* This solution uses Knuth's Algorithm X and his Dancing Links (DLX)
* Difference: using separate classes for requirements and actions instead of tuples.
*
*/
class AlgorithmXSolver
{
    /**
     * A hashmap of requirements.
     *
     * @var array<string, Requirement>
     */
    protected $R = [];

    /**
     * A hashmap of actions.
     *
     * @var array<string, Action>
     */
    protected $A = [];

    /**
     * A hashmap of optional requirements.
     *
     * @var array<string, Requirement>
     */
    protected $O = [];

    /**
     * The list of actions (rows) that produce the current path through the matrix.
     *
     * @var array<int, Action>
     */
    protected $solution = [];

    /** @var int */
    public $solution_count = 0;

    /**
     * A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
     * In the basic Solver, nothing is ever put into the history. A subclass can override
     * the `process_row_selection()` method to add history in cases of multiplicity.
     *
     * @var array<int, array<string, bool>>
     */
    protected $history = [[]];

    /**
     * For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
     * can add functionality to check solutions as they are being built to steer away from
     * invalid solutions. The basic Algorithm X Solver never modifies this attribute.
     *
     * @var bool
     */
    protected $solution_is_valid = true;

    /** @var DLXCell */
    protected $matrix_root;

    /** @var array<string, DLXCell> */
    protected $col_headers = [];

    /**
     * Row headers are never attached to the rest of the DLX matrix. They are only used
     * currently to keep track of the action associated with each row.
     *
     * @var array<string, DLXCell>
     */
    protected $row_headers = [];

    /**
     * R - a list of requirements.
     * A - a list of actions (object Action also contains the lists of covered requirements).
     * O - a list of optional requirements. They can be covered, but they never cause failure.
     *     Optional requirements are important because if they get covered, no other action can
     *     also cover that same requirement. Also referred to as "at-most-one-time constraints".
     *
     * @param array<int, Requirement> $R
     * @param array<int, Action>      $A
     * @param array<int, Requirement> $O
     */
    public function __construct(array $R, array $A, array $O = [])
    {
        $R_with_O = array_merge($R, $O);
        foreach ($R_with_O as $req) {
            $this->R[$req->hash()] = $req;
        }
        foreach ($O as $req) {
            $this->O[$req->hash()] = $req;
        }
        $this->matrix_root = new DLXCell('root');
        $this->matrix_root->size = 10000000;
        foreach ($R_with_O as $req) {
            $node = new DLXCell();
            $node->title = $req;
            $this->col_headers[$req->hash()] = $node;
        }
        foreach ($A as $action) {
            $node = new DLXCell();
            $node->title = $action;
            $this->row_headers[$action->hash()] = $node;
        }
        foreach ($this->col_headers as $node) {
            $this->matrix_root->attach_horiz($node);
        }
        foreach ($A as $action) {
            $this->A[$action->hash()] = $action;
            $previous_cell = null;
            foreach ($action->reqs as $req) {
                $next_cell = new DLXCell();
                $next_cell->col_header = $this->col_headers[$req->hash()];
                $next_cell->row_header = $this->row_headers[$action->hash()];
                $next_cell->col_header->attach_vert($next_cell);
                ++$next_cell->col_header->size;
                if (!is_null($previous_cell)) {
                    $previous_cell->attach_horiz($next_cell);
                } else {
                    $previous_cell = $next_cell;
                }
            }
        }
    }

    /**
     * Algorithm X Step 1:
     *
     * Choose the column (requirement) with the best value for "sort criteria". For
     * the basic implementation of sort criteria, Algorithm X always chooses the column
     * covered by the fewest number of actions. Optional requirements are not eligible
     * for this step.
     */
    public function solve(): \Generator
    {
        $best_column = $this->matrix_root;
        $best_value  = 0;
        $node = $this->matrix_root->next_x;
        while ($node !== $this->matrix_root) {
            // Optional requirements (at-most-one-time constraints) are never chosen as best.
            if (!($node->title instanceof Requirement) or !isset($this->O[$node->title->hash()])) {
                // Get the sort criteria for this requirement (column).
                $value = $this->requirement_sort_criteria($node);
                if (($best_column === $this->matrix_root) or ($value < $best_value)) {
                    $best_column = $node;
                    $best_value  = $value;
                }
                $node = $node->next_x;
            } else {
                // Optional requirements stop the search for the best column.
                $node = $this->matrix_root;
            }
        }
        if ($best_column === $this->matrix_root) {
            $this->process_solution();
            if ($this->solution_is_valid) {
                ++$this->solution_count;
                yield $this->solution;
            }
        } else {
            // Build a list of all actions (rows) that cover the chosen requirement (column).
            $actions = [];
            $node = $best_column->next_y;
            while ($node !== $best_column) {
                $actions[] = $node;
                $node = $node->next_y;
            }
            // The next step is to loop through all possible actions. To prepare for this,
            // a new level of history is created. The history for this new level starts out
            // as a complete copy of the most recent history.
            $this->history[] = $this->history[count($this->history) - 1];
            // Loop through the possible actions sorted by the given sort criteria. A basic
            // Algorithm X implementation does not provide sort criteria. Actions are tried
            // in the order they happen to occur in the matrix.
            usort($actions, function (DLXCell $a, DLXCell $b): int {
                return $this->action_sort_criteria($a->row_header) <=> $this->action_sort_criteria($b->row_header);
            });
            foreach ($actions as $node) {
                $this->select($node);
                if ($this->solution_is_valid) {
                    foreach ($this->solve() as $s) {
                        yield $s;
                    }
                }
                $this->deselect($node);
                // All backtracking results in going back to a solution that is valid.
                $this->solution_is_valid = true;
            }
            array_pop($this->history);
        }
    }

    /**
     * Algorithm X Step 4 - Details:
     *
     * The select method updates the matrix when a row is selected as part of a solution.
     * Other rows that satisfy overlapping requirements need to be deleted and in the end,
     * all columns satisfied by the selected row get removed from the matrix.
     */
    protected function select(DLXCell $node): void
    {
        $node->select();
        if (!$node->row_header->title instanceof Action) {
            throw new \Exception('impossible');
        }
        $this->solution[] = $node->row_header->title;
        $this->process_row_selection($node->row_header->title);
    }

    /**
     * Algorithm X Step 4 - Clean Up:
     *
     * The select() method selects a row as part of the solution being explored. Eventually that
     * exploration ends and it is time to move on to the next row (action). Before moving on,
     * the matrix and the partial solution need to be restored to their prior states.
     */
    protected function deselect(DLXCell $node): void
    {
        $node->unselect();
        array_pop($this->solution);
        if (!$node->row_header->title instanceof Action) {
            throw new \Exception('impossible');
        }
        $this->process_row_deselection($node->row_header->title);
    }

    /**
     * In cases of multiplicity, this method can be used to ask Algorithm X to remember that
     * it has already tried certain things. For instance, if Emma wants two music lessons per
     * week, trying to put her first lesson on Monday at 8am is no different than trying to put
     * her second lesson on Monday at 8am. See the Algorithm X Playground for more details,
     * specifically Mrs. Knuth - Part III.
     */
    protected function remember(string $item_to_remember): void
    {
        if (isset($this->history[count($this->history) - 1][$item_to_remember])) {
            $this->solution_is_valid = false;
        } else {
            $this->history[count($this->history) - 1][$item_to_remember] = true;
        }
    }

    /**
     * In some cases it may be beneficial to have Algorithm X try certain paths through the matrix.
     * This can be the case when there is reason to believe certain actions have a better chance than
     * other actions at producing complete paths through the matrix. The method included here does
     * nothing, but can be overridden to influence the order in which Algorithm X tries rows (actions)
     * that cover some particular column.
     */
    protected function action_sort_criteria(DLXCell $row_header): int
    {
        return 0;
    }

    /**
     * In some cases it may be beneficial to have Algorithm X try covering certain requirements
     * before others as it looks for paths through the matrix. The default is to sort the requirements
     * by how many actions cover each requirement, but in some cases there might be several
     * requirements covered by the same number of actions. By overriding this method, the
     * Algorithm X Solver can be directed to break ties a certain way or consider another way
     * of prioritizing the requirements.
     */
    protected function requirement_sort_criteria(DLXCell $col_header): int
    {
        return $col_header->size;
    }

    /**
     * The following method can be overridden by a subclass to add logic to perform more detailed solution
     * checking if invalid paths are possible through the matrix. Some problems have requirements that
     * cannot be captured in the basic requirements list passed into the `__contruct()` method. For instance,
     * a solution might only be valid if it fits certain parameters that can only be checked at intermediate
     * steps. In a case like that, this method can be overridden to add the functionality necessary to
     * check the solution.
     * If the subclass logic results in an invalid solution, the `solution_is_valid` attribute should be set
     * to false instructing Algorithm X to stop progressing down this path in the matrix.
     */
    protected function process_row_selection(Action $row): void
    {
    }

    /**
     * This method can be overridden by a subclass to add logic to perform more detailed solution
     * checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
     * `process_row_selection()` method above to "undo" what was done above.
     */
    protected function process_row_deselection(Action $row): void
    {
    }

    /**
     * This method can be overridden to instruct Algorithm X to do something every time a solution is found.
     * For instance, Algorithm X might be looking for the best solution or maybe each solution must be
     * validated in some way. In either case, the `solution_is_valid` attribute can be set to False
     * if the current solution should not be considered valid and should not be generated.
     */
    protected function process_solution(): void
    {
    }
}
?>
```

<BR>