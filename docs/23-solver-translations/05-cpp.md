# C++

C++ is a statically typed, compiled language designed for performance and explicit control over data and object lifetimes. In contrast to my Python implementation of `AlgorithmXSolver`, which relies heavily on `tuple`s as lightweight identifiers and dictionary keys, the C++ version uses named types and explicit ownership relationships, making structure, intent, and memory management clear and efficient.

In the C++ implementation, much of the logic for managing requirements and actions has been pushed into `AlgorithmXSolver`. By centralizing ownership and lifecycle management, the solver exposes cleaner, more well-defined interfaces, allowing derived solvers to focus on constraint modeling rather than internal mechanics. These design choices are discussed in more detail below.

---

#✅ Design Note: Canonical Implementation

At this point, the C++ version should be considered the canonical implementation of `AlgorithmXSolver`. While the Python solver was instrumental in early experimentation, the C++ design more accurately captures the solver’s structure, abstractions, and object lifetimes. **Any future translations into other languages should generally be derived from this C++ version rather than the original Python code.**

---

# Abstract Requirements and Actions

The C++ `AlgorithmXSolver` provides two core abstractions: `Requirement` and `Action`. Each instance of either type must be initialized with a string `key` that uniquely identifies it. These keys serve two important purposes: they greatly simplify debugging and logging, and they allow `AlgorithmXSolver` to efficiently map requirements to the actions that satisfy them.

During solver construction, requirements and actions are initially referenced by their keys. Once the DLX matrix is built, all relationships are resolved and stored internally as raw pointers, eliminating string lookups during the search and ensuring strong performance.

---

# Problem-Specific Requirements and Actions

To use the C++ solver, you must define subclasses for your problem-specific requirements and actions. Each subclass must pass a unique `key` to the base class constructor from which it inherits.

As a concrete example, consider a standard 9×9 Sudoku puzzle. It can be expressed using four distinct types of requirements:

1. Every cell must contain exactly one value.
2. Each value must appear exactly once in every row.
3. Each value must appear exactly once in every column.
4. Each value must appear exactly once in every 3×3 box.

To model these constraints, four separate subclasses are defined—one for each requirement type—all inheriting from the generic `Requirement` base class. Each subclass is responsible for generating a unique and descriptive key that identifies a specific instance of that requirement (for example, a particular cell, row/value pair, or box/value pair).

For consistency and readability, the following format is recommended when defining `Requirement` subclasses.

### Recommended Requirement Subclass Format

Each `Requirement` subclass follows the same general pattern:

1. **Store only the minimal data needed to describe the requirement**  
   Member variables correspond directly to the logical parameters of the constraint (e.g., row, column, value).

2. **Provide a `static make_key(...)` method**  
   This method constructs a unique, human-readable string `key` from those parameters. Centralizing `key` construction in a static method ensures consistency and avoids duplication between the constructor and other parts of the code.

3. **Pass the generated key to the base `Requirement` constructor**  
   The derived constructor calls `Requirement(make_key(...))` in its initializer list, guaranteeing that every requirement instance is uniquely identified at construction time.

4. **Keep the class lightweight and immutable in spirit**  
   Requirement objects act as identifiers and structural elements within the solver. They should not contain solver logic or mutable state.

5. **Prefer `struct` over `class` for solver primitives**  
   Requirement and Action subclasses are simple, lightweight data containers whose members are intentionally public. Using `struct` makes this intent explicit and avoids unnecessary boilerplate, while still allowing full use of constructors, inheritance, and composition.

The following examples illustrate this format using the four Sudoku requirement types:

```cpp
struct CellCovered : public Requirement {
    int row;
    int col;

    static string make_key(int row, int col) {
        return "cell covered " + to_string(row) + " " + to_string(col);
    }

    CellCovered(int row, int col) 
        : Requirement(make_key(row, col)), 
          row(row), 
          col(col) 
    {}
};


struct ValInRow : public Requirement {
    int row;
    char val;

    static string make_key(int row, char val) {
        return "val in row " + to_string(row) + " " + val;
    }

    ValInRow(int row, char val) 
        : Requirement(make_key(row, val)), 
          row(row), 
          val(val) 
    {}
};


struct ValInCol : public Requirement {
    int col;
    char val;

    static string make_key(int col, char val) {
        return "val in col " + to_string(col) + " " + val;
    }

    ValInCol(int col, char val) 
        : Requirement(make_key(col, val)), 
          col(col), 
          val(val) 
    {}
};


struct ValInBox : public Requirement {
    int box;
    char val;

    static string make_key(int box, char val) {
        return "val in box " + to_string(box) + " " + val;
    }

    ValInBox(int box, char val) 
        : Requirement(make_key(box, val)), 
          box(box), 
          val(val) 
    {}
};
```

Each of these classes defines a family of requirements. Individual instances are distinguished solely by their constructor parameters and the resulting key, allowing the solver to treat them uniformly while still preserving precise semantic meaning.

`Action` subclasses follow the same conventions and design principles described above.

```cpp
struct PlaceValue : public Action {
    int row;
    int col;
    char val;

    static string make_key(int row, int col, char val) {
        return "place value "  + to_string(row) + " "  + to_string(col) + " " + val;
    }

    PlaceValue(int row, int col, char val) 
        : Action(make_key(row, col, val)), 
        row(row), 
        col(col), 
        val(val) 
    {}
};
```

---

# Constructing an `AlgorithmXSolver` Subclass

In the C++ implementation, the construction of an `AlgorithmXSolver` subclass differs in an important way from the original Python design. In C++, the base class constructor is always executed *before* the derived class constructor. This ordering is leveraged intentionally in the solver’s design.

During base class construction, `AlgorithmXSolver` initializes and owns the internal containers used to store requirements and actions. These containers establish the solver’s structural foundation and remain valid for the lifetime of the solver instance. By the time control reaches the derived class constructor, the solver is fully prepared to accept problem-specific requirements and actions.

This design ensures that all requirements and actions are created, registered, and owned by `AlgorithmXSolver`, **centralizing memory management and eliminating ambiguity about object lifetimes.**

---

## Adding Requirements and Actions

Once the base class constructor has completed, the derived solver constructor is responsible for populating the solver with problem-specific requirements and actions. This is done exclusively through the public helper methods provided by `AlgorithmXSolver`.

Rather than constructing and storing requirements or actions directly, derived classes call these helper methods to create and register them with the solver’s internal containers. This guarantees that:

- Ownership of all requirements and actions remains with `AlgorithmXSolver`
- Keys are validated and indexed consistently
- Internal mappings between requirements and actions are constructed correctly

At a high level, the derived constructor typically follows this pattern:

1. Call the base class constructor (implicitly or explicitly).
2. Add all `Requirement` instances using the solver’s provided methods.
3. Add all `Action` instances:
    1. Construct and register the `Action` with the solver using helper methods.
    2. Attach covered requirements to the action using helper methods.

This separation of responsibilities allows derived solvers to focus entirely on modeling the problem domain, while `AlgorithmXSolver` manages storage, ownership, and internal consistency.

---

## Helper Methods

All requirements and actions must be added through helper methods. Derived solvers should never directly allocate, store, or manage solver primitives.

The four primary helper methods are:

- `add_requirement`
- `add_optional_requirement`
- `attach_requirement`
- `add_action`

Each method is described below in terms of its parameters and usage.

---

### `add_requirement`

Registers a required `Requirement` instance with the solver.

**Parameters**

- A pointer to a `Requirement` subclass instance (typically created via `new` or `make_unique` and passed immediately to the solver).

**Semantics**

- The requirement’s `key` must be globally unique within the solver.

This method should be used for all primary constraints in the problem.

---

### `add_optional_requirement`

Registers an optional `Requirement` instance with the solver.

**Parameters**

- A pointer to a `Requirement` subclass instance.

**Semantics**

- Optional requirements follow the same key uniqueness and reuse rules as required requirements.

This method should be used for all optional requirements (secondary constraints).

---

### `attach_requirement`

Associates a previously registered requirement with an action.

**Parameters**

- `action` — A pointer to an `Action` previously registered or in the process of being registered.
- `key` — A string used to look up the previously registered requirement.

**Semantics**

- The action is associated with the already-registered requirement matching the key.
- Internally, associations are stored as raw pointers and later translated directly into DLX matrix links.

**See Sudoku example below for usage details**

---

### `add_action`

Registers an `Action` instance with the solver.

**Parameters**

- A pointer to an `Action` subclass instance.

**Semantics**

- The action’s `key` must be globally unique.
- Actions are registered independently of any requirements they may satisfy.

---

All helper methods are intended to be used during solver construction, prior to building the DLX matrix. Once construction is complete, the solver’s internal representation is fixed and optimized for search.

---

# Overriding `process_solution`

When the solver finds a solution, the list of selected `Action` instances that constitute a solution is stored in the solver’s `solution` member attribute. To produce a problem-specific output, your derived solver must override the virtual method `process_solution`.

## Method Signature and Usage

```cpp
virtual void process_solution() override;
{
    for (Action *action : solution) {
        auto *action_ptr = static_cast<ActionSubclassType *>(action);
        // add action details to the solution
}
```

## Responsibilities

- Interpret the selected actions stored in `solution`.
- Construct and store the final solution in whatever format your application requires (e.g., arrays, strings, objects).
- Optionally, update solver statistics, counters, or perform side effects as needed.

## Usage Notes

- `process_solution` is called automatically for every solution found during the search.
- The `solution` vector may be read freely; the solver manages all memory for `Action` instances, so do **not** delete or free them.

---

# Creating and Running Your Solver

To run your C++ solver, first create an instance of your `AlgorithmXSolver` subclass. The constructor should take any problem-specific parameters necessary to initialize your requirements and actions. Once the solver instance is constructed, call the `solve()` method to build the DLX matrix and start the search. The `solve()` method takes two **optional** parameters:

1. **`find_all_solutions`** – a boolean value indicating whether the solver should continue searching for all solutions (`true`) or stop after finding the first solution (`false` - default).

2. **`show_timing`** – a boolean value indicating whether the solver should display timing statistics after the search completes (`true`) or remain silent (`false` - default).

---

### Example Usage

```cpp
// Create solver with problem-specific parameters
SudokuSolver solver(grid, ALL_VALUES);

// Solve, stopping after the first solution, with timing output
solver.solve(false, true);

// Solve, searching for all solutions, without timing output
solver.solve(true, false);
```

---

# Example - 9x9 Sudoku

```cpp
class SudokuSolver : public AlgorithmXSolver {
protected:
    vector<string> &grid;

public:
    SudokuSolver(vector<string> &grid, const string &values) : grid(grid)
    {
        // Build the requirements - for instance:

        // The cell at (0, 0) must be covered:
        add_requirement(make_unique<CellCovered>(0, 0));

        // There must be a '3' in the first row, the first col and the first box:
        add_requirement(make_unique<ValInRow>(0, '3'));
        add_requirement(make_unique<ValInCol>(0, '3'));
        add_requirement(make_unique<ValInBox>(0, '3'));

        // Build the actions and attach the covered requirements.

        // Consider the single action of putting a '6' at location (2, 2):
        auto action_ptr = add_action(make_unique<PlaceValue>(2, 2, '6'));

        attach_requirement(action_ptr, CellCovered::make_key(2, 2));
        attach_requirement(action_ptr, ValInRow::make_key(2, '6'));
        attach_requirement(action_ptr, ValInCol::make_key(2, '6'));
        attach_requirement(action_ptr, ValInBox::make_key(0, '6'));
    }


protected:
    void process_solution() override
    {
        for (Action *action : solution) {
            auto *action_ptr = static_cast<PlaceValue *>(action);

            // Use the attributes of the action to build the solution:
            //      action_ptr->row
            //      action_ptr->col
            //      action_ptr->val
        }
    }

};


int main(){

    // read input

    auto solver = SudokuSolver(grid, ALL_VALUES);
    solver.solve();

    for (const string &row: grid)
        cout << row << '\n';
}
```

---

# Mutual Exclusivity

To handle [mutual exclusivity](../07-generalized-exact-cover/03-mutually-exclusive-actions.md) in C++, create a subclass of `MERequirement`.  Each `MERequirement` is defined by **two unique keys**, corresponding to the two solution pieces that cannot appear together. The base class handles all internal bookkeeping.

For example, consider loud instruments in [Mrs. Knuth Part II](../07-generalized-exact-cover/08-your-solver.md). First, create a subclass:

```cpp
struct LoudInstrument : public MERequirement {
    static string make_key(const string& day, int hour) {
        return "loud instrument " + day + " " + to_string(hour);
    }

    LoudInstrument(string day, int hour_1, int hour_2)
        : MERequirement(make_key(day, hour_1),
                        make_key(day, hour_2))
    {}
};
```

Inside your solver subclass constructor, register instances of `LoudInstrument` with the solver using the helper method `add_me_requirement`. The solver handles duplicates automatically (e.g., registering `a` with `b` and later `b` with `a`).

```cpp
    add_me_requirement(make_unique<LoudInstrument>("F", 8, 9));
    add_me_requirement(make_unique<LoudInstrument>("F", 9, 10));
    add_me_requirement(make_unique<LoudInstrument>("F", 10, 11));
```

If you were to add the following, AlgorithmXSolver would recognize it as a duplicate and silently discard the registration attempt:

```cpp
    add_me_requirement(make_unique<LoudInstrument>("F", 9, 8));
```

This behavior may seem obvious in a small example, but for problems with extensive mutual exclusivity, the solver’s internal ME bookkeeping can reduce error-prone manual logic and significantly improve construction-time robustness.

To attach `MERequirement`s to an action, use `attach_me_requirements`. This links **all relevant** `MERequirement`s to the action:

```cpp
    if (LOUD_INSTRUMENTS.count(student.instrument) != 0)
        attach_me_requirements(action_ptr, LoudInstrument::make_key("F", 8));
```

In practice, you will loop over all relevant times or conditions, for example:

```cpp
    if (LOUD_INSTRUMENTS.count(student.instrument) != 0)
        attach_me_requirements(action_ptr, LoudInstrument::make_key(day, hour));
```

---

# Multiplicity

To avoid redundant searches, `AlgorithmXSolver` provides a `remember` method that takes a single string of data. When you declare your action subclass, add a `to_remember` attribute that uniquely identifies what it is you want Algorithm X to remember. Then, tell `AlgorithmXSolver` to remember that information each time a row is selected by overriding the `process_row_selection` method.

For example, implementing the [Mrs. Knuth Part III](../09-multiplicity/05-memory.md) example:

```cpp
struct PlaceStudent : public Action {
    // ( ... other attributes ... )
    string to_remember;

    static string make_key() {
        return /* unique string key for the action */;
    }

    PlaceStudent()
        : Action(make_key())
        // initialize other attributes ...
    {
        // Build a string that identifies what should be remembered about this action.
        to_remember = name + " " + day + " " + to_string(hour);
    }
};
```

By storing a `to_remember` string in each action, you avoid rebuilding it for every call to `process_row_selection`:

```cpp
    void process_row_selection(Action* action) override
    {
        auto *action_ptr = static_cast<PlaceStudent*>(action);
        remember(action_ptr->to_remember);
    }

```

---

# Debug Print Helpers

`AlgorithmXSolver` includes a small set of built-in debug helpers designed to inspect the solver’s requirements and actions. These methods are intentionally simple and opinionated: they print human-readable summaries to `std::cerr` and are meant strictly for diagnostics, not structured logging.

**All helpers** support an optional `n` parameter, allowing output to be truncated when debugging large problem instances.

---

### Requirement Debug Print Helpers

The following helpers print the solver’s various **requirement collections**, each in insertion order:

- `print_requirements(size_t n = SIZE_MAX)`
- `print_optional_requirements(size_t n = SIZE_MAX)`  
- `print_me_requirements(size_t n = SIZE_MAX)`

Each helper:

- Prints the total count followed by each requirement’s `key()`
- Supports truncation via the optional `n` parameter
- Is primarily useful for verifying that constraints were registered and classified correctly before search begins

---

### Action Debug Print Helper

- `print_actions(size_t n = SIZE_MAX, bool include_covered_requirements = false)`

Prints the solver’s registered **actions**.

- Always prints each action’s `key()`
- Supports truncation via the optional `n` parameter
- When `include_covered_requirements` is `true`, also prints the requirements covered by each action (indented beneath the action)
- Particularly useful for validating action–requirement wiring and coverage relationships prior to running the search

---

# The Solver Code

```cpp
// -------------------------------------------------------------
//
//  This solution uses Knuth's Algorithm X and his Dancing Links (DLX):
//  Last Updated: 01 January 2026 by @Timinator
//
//  For a detailed explanation and tutorial on this Algorithm X Solver, 
//  please visit:
//
//  https://www.algorithm-x.com
//
// -------------------------------------------------------------

// Containers
#include <vector>
#include <array>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>

// Memory / ownership
#include <memory>

// Utilities
#include <string>
#include <utility>
#include <algorithm>
#include <limits>
#include <chrono>
#include <math.h>

// Debug / I/O
#include <iostream>

// Assertions
#include <cassert>

using namespace std;

// -------------------------------------------------------------
// Forward declarations
// -------------------------------------------------------------
struct Requirement;
struct Action;
struct DLXCell;

// -------------------------------------------------------------
//
//  DLXCell is one cell in the Algorithm X matrix. This implementation was mostly
//  copied from @RoboStac's solution to Constrained Latin Squares on www.codingame.com.
//
//  https://www.codingame.com/training/medium/constrained-latin-squares
//
// -------------------------------------------------------------
struct DLXCell {
    DLXCell *prev_x{this}, *next_x{this};
    DLXCell *prev_y{this}, *next_y{this};

    DLXCell *col_header{nullptr};
    DLXCell *row_header{nullptr};

    Requirement *requirement{nullptr};      // column headers only
    Action      *action{nullptr};           // row headers only

    // Size quickly identifies how many rows are in any particular column.
    int size{0};

    inline void remove_x() { prev_x->next_x = next_x; next_x->prev_x = prev_x; }
    inline void restore_x(){ prev_x->next_x = this; next_x->prev_x = this; }
    inline void remove_y() { prev_y->next_y = next_y; next_y->prev_y = prev_y; }
    inline void restore_y(){ prev_y->next_y = this; next_y->prev_y = this; }

    inline void attach_horiz(DLXCell *other) {
        DLXCell *left = prev_x;
        other->prev_x = left; left->next_x = other;
        other->next_x = this; prev_x = other;
    }

    inline void attach_vert(DLXCell *other) {
        DLXCell *up = prev_y;
        other->prev_y = up; up->next_y = other;
        other->next_y = this; prev_y = other;
    }

    void remove_column() {
        remove_x();
        for(DLXCell *r = next_y; r != this; r = r->next_y) r->remove_row();
    }

    void restore_column() {
        for(DLXCell *r = prev_y; r != this; r = r->prev_y) r->restore_row();
        restore_x();
    }

    void remove_row() {
        for(DLXCell *n = next_x; n != this; n = n->next_x) {
            --n->col_header->size;
            n->remove_y();
        }
    }

    void restore_row() {
        for(DLXCell *n = prev_x; n != this; n = n->prev_x) {
            ++n->col_header->size;
            n->restore_y();
        }
    }

    void select() {
        for(DLXCell *n=this;; n=n->next_x){
            n->remove_y();
            n->col_header->remove_column();
            if(n->next_x==this) break;
        }
    }

    void unselect() {
        for(DLXCell *n=prev_x;; n=n->prev_x){
            n->col_header->restore_column();
            n->restore_y();
            if(n==this) break;
        }
    }
};

// -------------------------------------------------------------
// Requirement & MERequirement Base Classes
// -------------------------------------------------------------
struct Requirement {
    string key_;
    bool is_optional{false};
    explicit Requirement(const string &k): key_(k) {}
    virtual ~Requirement() = default;
    string key() const { return key_; }
};

struct MERequirement : Requirement {
    string a, b;

    static string make_me_key(const string& x, const string& y) {
        if (x < y)
            return x + " -me- " + y;
        else
            return y + " -me- " + x;
    }

    MERequirement(const string& aa, const string& bb)
        : Requirement(make_me_key(aa, bb))
    {
        if (aa < bb) {
            a = aa;
            b = bb;
        } else {
            a = bb;
            b = aa;
        }
        is_optional = true;
    }
};

// -------------------------------------------------------------
// Action Base Class
// -------------------------------------------------------------
struct Action {
    string key_;
    vector<Requirement*> covered_requirements;
    explicit Action(const string &k): key_(k) {}
    virtual ~Action() = default;
    string key() const { return key_; }
};

// -------------------------------------------------------------
// AlgorithmXSolver Base Class with DLX engine
// -------------------------------------------------------------
class AlgorithmXSolver {
protected:
    using clock = chrono::high_resolution_clock;
    clock::time_point construct_time;

    // Requirement/Action containers
    vector<unique_ptr<Requirement>> requirements;
    vector<unique_ptr<Requirement>> optional_requirements;
    vector<unique_ptr<MERequirement>> me_requirements;
    vector<unique_ptr<Action>> actions;

    // Lookup tables mapping requirement keys (strings) to requirement pointers.
    unordered_map<string, Requirement*> requirements_lookup;
    unordered_map<string, MERequirement*> me_lookup;
    unordered_map<string, vector<MERequirement*>> me_lists;

    // DLX structures
    unique_ptr<DLXCell> matrix_root{make_unique<DLXCell>()};
    unordered_map<string, unique_ptr<DLXCell>> col_headers;
    unordered_map<string, unique_ptr<DLXCell>> row_headers;
    vector<unique_ptr<DLXCell>> dlx_cells;

    // The list of actions (rows) that produce the current path through the matrix.
    vector<Action*> solution;

    // When stop_search is true, the search method knows a solution has been found and
    // the depth-first search is quickly unwound and the search method is exited.
    bool stop_search{false};

    // For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
    // can add functionality to check solutions as they are being built to steer away from
    // invalid solutions. The basic Algorithm X Solver never modifies this attribute.
    bool solution_is_valid{true};

    // A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
    // In the basic Solver, nothing is ever put into the history. A subclass can override
    // the process_row_selection() method to add history in cases of multiplicity. 
    vector<unordered_set<string>> history{ {} };

public:
    size_t solution_count{0};

    AlgorithmXSolver() : construct_time(clock::now()) {}
    virtual ~AlgorithmXSolver() = default;

    // ------------------------------------------------------------------
    //  Requirement/Action helpers
    // ------------------------------------------------------------------
    void add_requirement(unique_ptr<Requirement> requirement) {
        Requirement* ptr = requirement.get();
        requirements_lookup[ptr->key()] = ptr;
        requirements.push_back(move(requirement));
    }

    void add_optional_requirement(unique_ptr<Requirement> requirement) {
        Requirement* ptr = requirement.get();
        requirements_lookup[ptr->key()] = ptr;
        optional_requirements.push_back(move(requirement));
        ptr->is_optional = true;
    }

    void add_me_requirement(unique_ptr<MERequirement> me_requirement) {
        const string& key = me_requirement->key();

        // Check for duplicate MERequirement
        if (me_lookup.contains(key))
            return;

        MERequirement* ptr = me_requirement.get();
        me_requirements.push_back(move(me_requirement));
        me_lookup[key] = ptr;

        me_lists[ptr->a].push_back(ptr);
        me_lists[ptr->b].push_back(ptr);
    }

    Action* add_action(unique_ptr<Action> action) {
        Action* ptr = action.get();
        actions.push_back(move(action));
        return ptr;
    }

    void attach_requirement(Action* action, const string& key) {
        auto it = requirements_lookup.find(key);
        if (it == requirements_lookup.end()) {
            throw runtime_error("Requirement not found: " + key);
        }
        Requirement* requirement = it->second;
        action->covered_requirements.push_back(requirement);
    }

    void attach_me_requirements(Action* action, const string& key) {
        auto it = me_lists.find(key);
        if (it != me_lists.end()) {
            for (MERequirement* me_requirement : it->second) {
                action->covered_requirements.push_back(me_requirement);
            }
        }
    }

    // ------------------------------------------------------------------
    //  DLX matrix builder (called automatically in solve)
    // ------------------------------------------------------------------
    void build_matrix() {

        assert(col_headers.empty() && "build_matrix called twice");

        // Merge all requirements into one list: required → optional → me.
        // Required requirements must precede optional requirements in header order.
        // Search stops scanning columns when first optional requirement is encountered.
        vector<Requirement*> all_requirements;
        for (auto &r : requirements) all_requirements.push_back(r.get());
        for (auto &r : optional_requirements) all_requirements.push_back(r.get());
        for (auto &r : me_requirements) all_requirements.push_back(r.get());

        // Create column headers
        for (Requirement* r : all_requirements) {
            auto node = make_unique<DLXCell>();
            node->requirement = r;
            col_headers[r->key()] = move(node);
        }

        // Horizontally link columns to root
        matrix_root->size = INT_MAX;
        for (Requirement* r : all_requirements) {
            matrix_root->attach_horiz(col_headers[r->key()].get());
        }

        // Create a row in the matrix for every action.
        for (auto &action_uptr : actions) {
            Action* action = action_uptr.get();
            auto row_node = make_unique<DLXCell>();
            row_node->action = action;
            row_headers[action->key()] = move(row_node);

            DLXCell* prev = nullptr;
            for (Requirement* r : action->covered_requirements) {
                DLXCell* col = col_headers[r->key()].get();

                auto cell = make_unique<DLXCell>();
                DLXCell* cell_ptr = cell.get();

                cell_ptr->col_header = col;
                cell_ptr->row_header = row_headers[action->key()].get();

                col->attach_vert(cell_ptr);
                ++col->size;
                if (prev) prev->attach_horiz(cell_ptr);
                prev = cell_ptr;

                dlx_cells.push_back(move(cell));
            }
        }
    }

void solve(bool find_all_solutions = false, bool show_timing = false) {
    using namespace chrono;

    auto solve_start = clock::now();

    if (show_timing) {
        auto init_ms = duration_cast<milliseconds>(solve_start - construct_time).count();
        cerr << "[Timing] Build Requirements & Actions: " << init_ms << " ms\n";
    }

    auto build_start = clock::now();
    build_matrix();
    auto build_end = clock::now();

    if (show_timing) {
        cerr << "[Timing] DLX Matrix Build: "
             << duration_cast<milliseconds>(build_end - build_start).count()
             << " ms\n";
    }

    auto search_start = clock::now();
    search(find_all_solutions);
    auto search_end = clock::now();

    if (show_timing) {
        cerr << "[Timing] Search: "
             << duration_cast<milliseconds>(search_end - search_start).count()
             << " ms\n\n";
    }
}

protected:
    void search(bool find_all_solutions) {
        if (stop_search) return;

        // Algorithm X: Choose a Column
        //
        // Choose the column (requirement) with the best value for "sort criteria". For
        // the basic implementation of sort criteria, Algorithm X always chooses the column
        // covered by the fewest number of actions. Optional requirements are not eligible 
        // for this step.
        DLXCell *best_col = matrix_root.get();
        int best_value = INT_MAX;
        for (DLXCell *node = matrix_root->next_x; node != matrix_root.get(); node = node->next_x) {

            // Optional requirements stop the search for the best column.
            if (node->requirement->is_optional) 
                break;

            // Get the sort criteria for this requirement (column).
            int v = requirement_sort_criteria(node);
            if (v < best_value) { best_value = v; best_col = node; }
        }

        if (best_col == matrix_root.get()) {
            process_solution();
            if (solution_is_valid) {
                ++solution_count;
                if (!find_all_solutions) 
                    stop_search = true; 
            }
            return;
        }

        // Algorithm X: Choose a Row
        //
        // The next step is to loop through all possible actions. To prepare for this,
        // a new level of history is created. The history for this new level starts out
        // as a complete copy of the most recent history.
        history.push_back(history.back());

        // Loop through all possible actions in the order they were provided when identified.
        for (DLXCell *node = best_col->next_y; node != best_col; node = node->next_y) {
            if (stop_search) 
                break;

            select(node);
            if (solution_is_valid) 
                search(find_all_solutions);
            deselect(node);

            // All backtracking results in going back to a solution that is valid.
            solution_is_valid = true;
        }

        history.pop_back();
    }

    // Algorithm X: Shrink Matrix Due to Row Selection
    //
    // The select method updates the matrix when a row is selected as part of a solution.
    // Other rows that satisfy overlapping requirements need to be deleted and in the end,
    // all columns satisfied by the selected row get removed from the matrix.
    void select(DLXCell *node) {
        node->select();
        solution.push_back(node->row_header->action);
        process_row_selection(node->row_header->action);
    }

    // Algorithm X: Rebuild Matrix Due to Row Deselection
    //
    // The select() method selects a row as part of the solution being explored. Eventually that
    // exploration ends and it is time to move on to the next row (action). Before moving on,
    // the matrix and the partial solution need to be restored to their prior states.
    void deselect(DLXCell *node) {
        node->unselect();
        solution.pop_back();
        process_row_deselection(node->row_header->action);
    }

    // In cases of multiplicity, this method can be used to ask Algorithm X to remember that
    // it has already tried certain things. For instance, if Emma wants two music lessons per
    // week, trying to put her first lesson on Monday at 8am is no different than trying to put
    // her second lesson on Monday at 8am. See the Algorithm X Playground for more details, 
    // specifically Mrs. Knuth - Part III.
    void remember(const string& item_to_remember)
    {
        auto& current_level = history.back();

        if (current_level.contains(item_to_remember)) {
            solution_is_valid = false;
        } else {
            current_level.insert(item_to_remember);
        }
    }

    // In some cases it may be beneficial to have Algorithm X try covering certain requirements
    // before others as it looks for paths through the matrix. The default is to sort the requirements
    // by how many actions cover each requirement, but in some cases there might be several 
    // requirements covered by the same number of actions. By overriding this method, the
    // Algorithm X Solver can be directed to break ties a certain way or consider another way
    // of prioritizing the requirements.
    virtual int requirement_sort_criteria(DLXCell *col_header) { 
        return col_header->size;
    }

    // The following method can be overridden by a subclass to add logic to perform more detailed solution
    // checking if invalid paths are possible through the matrix. Some problems have requirements that
    // cannot be captured in the basic requirements. For instance, a solution might only be valid if it 
    // fits certain parameters that can only be checked at intermediate steps. In a case like that, this 
    // method can be overridden to add the functionality necessary to check the solution.
    //
    // If the subclass logic results in an invalid solution, the 'solution_is_valid' attribute should be set
    // to false instructing Algorithm X to stop progressing down this path in the matrix.
    virtual void process_row_selection(Action* /*action*/) {}

    // This method can be overridden by a subclass to add logic to perform more detailed solution
    // checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
    // process_row_selection() method above to "undo" what was done above.
    virtual void process_row_deselection(Action* /*action*/) {}

    // This method MUST be overridden to process a solution when it is found. If many possible solutions exist,
    // this method can be overridden to instruct Algorithm X to do something every time a solution is found.
    // For instance, Algorithm X might be looking for the best solution or maybe each solution must be
    // validated in some way. In either case, the solution_is_valid attribute can be set to false
    // if the current solution should not be considered valid and should not be generated.
    virtual void process_solution() {}

public:

    // ------------------------------------------------------------------
    // Debug printing helpers
    // ------------------------------------------------------------------
    void print_requirements(size_t n = SIZE_MAX) const {
        cerr << "Required Requirements (" << requirements.size() << "):\n";
        size_t count = 0;
        for (const auto& r : requirements) {
            if (count++ >= n) break;
            cerr << "    " << r->key() << '\n';
        }
        cerr << endl;
    }

    void print_optional_requirements(size_t n = SIZE_MAX) const {
        cerr << "Optional Requirements (" << optional_requirements.size() << "):\n";
        size_t count = 0;
        for (const auto& r : optional_requirements) {
            if (count++ >= n) break;
            cerr << "    " << r->key() << '\n';
        }
        cerr << endl;
    }

    void print_me_requirements(size_t n = SIZE_MAX) const {
        cerr << "ME Requirements (" << me_requirements.size() << "):\n";
        size_t count = 0;
        for (const auto& r : me_requirements) {
            if (count++ >= n) break;
            cerr << "    " << r->key() << '\n';
        }
        cerr << endl;
    }

    void print_actions(size_t n = SIZE_MAX, bool include_covered_requirements = false) const {
        cerr << "Actions (" << actions.size() << "):" << endl;
        size_t count = 0;
        for (const auto& a : actions) {
            if (count++ >= n) break;
            cerr << "    " << a->key() << endl;
            if (include_covered_requirements && !a->covered_requirements.empty()) {
                for (Requirement* r : a->covered_requirements) {
                    cerr << "        " << r->key() << endl;
                }
            }
        }
        cerr << endl;
    }
};

```

<BR>