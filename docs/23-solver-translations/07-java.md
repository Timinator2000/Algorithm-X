# Java

The following Java translation of `AlgorithmXSolver` is derived from the C++ version, which serves as the recommended reference for its structure, algorithms, and overall design.

Detailed explanations have been omitted, as they align closely with the discussion in the [C++ version](../23-solver-translations/05-cpp.md).

---

# Problem-Specific Requirements

```java
final class CellCovered extends Requirement {
    int row, col;

    static String makeKey(int r, int c) {
        return "cell covered " + r + " " + c;
    }

    CellCovered(int r, int c) {
        super(makeKey(r, c));
        row = r;
        col = c;
    }
}

final class ValInRow extends Requirement {
    int row;
    char val;

    static String makeKey(int r, char v) {
        return "val in row " + r + " " + v;
    }

    ValInRow(int r, char v) {
        super(makeKey(r, v));
        row = r;
        val = v;
    }
}

final class ValInCol extends Requirement {
    int col;
    char val;

    static String makeKey(int c, char v) {
        return "val in col " + c + " " + v;
    }

    ValInCol(int c, char v) {
        super(makeKey(c, v));
        col = c;
        val = v;
    }
}

final class ValInBox extends Requirement {
    int box;
    char val;

    static String makeKey(int b, char v) {
        return "val in box " + b + " " + v;
    }

    ValInBox(int b, char v) {
        super(makeKey(b, v));
        box = b;
        val = v;
    }
}
```

---

# Problem-Specific Actions

```java
final class PlaceValue extends Action {
    int row, col;
    char val;

    static String makeKey(int r, int c, char v) {
        return "place value " + r + " " + c + " " + v;
    }

    PlaceValue(int r, int c, char v) {
        super(makeKey(r, c, v));
        row = r;
        col = c;
        val = v;
    }
}
```

---

# Example - 9x9 Sudoku

```java
final class SudokuSolver extends AlgorithmXSolver {
    List<char[]> grid;

    SudokuSolver(List<char[]> grid, String values) {
        // Build the requirements - for instance:

        // The cell at (0, 0) must be covered:
        addRequirement(new CellCovered(0, 0));

        // There must be a '3' in the first row, the first col and the first box:
        addRequirement(new ValInRow(0, '3'));
        addRequirement(new ValInCol(0, '3'));
        addRequirement(new ValInBox(0, '3'));

        // Build the actions and attach the covered requirements.

        // Consider the single action of putting a '6' at location (2, 2):
        PlaceValue action = (PlaceValue) addAction(new PlaceValue(2, 2, '6'));

        attachRequirement(action, CellCovered.makeKey(2, 2));
        attachRequirement(action, ValInRow.makeKey(2, '6'));
        attachRequirement(action, ValInCol.makeKey(2, '6'));
        attachRequirement(action, ValInBox.makeKey(0, '6'));
    }


    @Override
    protected void processSolution() {
        for (Action action : solution) {
            PlaceValue pvAction = (PlaceValue) action;

            // Use the attributes of the action to build the solution:
            //      pvAction.row
            //      pvAction.col
            //      pvAction.val
        }
    }

};

public class Solution {
    public static void main(String args[]) {
        // read input

        SudokuSolver solver = new SudokuSolver(grid, ALL_VALUES);
        solver.solve();

        for (char[] row : grid)
            System.out.println(new String(row));
    }
}
```

---

# Mutual Exclusivity

MERequirement Definition:

```java
final class LoudInstrument extends MERequirement {

    public static String makeKey(String day, int hour) {
        return "loud instrument " + day + " " + hour;
    }

    public LoudInstrument(String day, int hour1, int hour2) {
        super(makeKey(day, hour1), makeKey(day, hour2));
    }
}
```

Registration:

```java
    addMERequirement(new LoudInstrument("F", 8, 9));
    addMERequirement(new LoudInstrument("F", 9, 10));
    addMERequirement(new LoudInstrument("F", 10, 11));
```

Usage:

```java
    if (Constants.LOUD_INSTRUMENTS.contains(s.instrument))
        attachMERequirements(action, LoudInstrument.makeKey("F", 8));
```

---

# Multiplicity

Add `toRemember`:

```java
final class PlaceStudent extends Action {
    // ( ... other attributes ... )
    public final String toRemember;

    public static String makeKey() {
        return /* unique string key for the action */;
    }

    public PlaceStudent() {
        super(MakeKey());
        // initialize other attributes ...

        // Build a string that identifies what should be remembered about this action.
        this.toRemember = student.name + " " + day + " " + hour;
    }
}
```

Override `processRowSelection`:

```java
    @Override
    protected void processRowSelection(Action action) {
        remember(((PlaceStudent) action).toRemember);
    }
```

---

# Debug Print Helpers

- `printRequirements()`
- `printRequirements(int n)`

---

- `printOptionalRequirements()`  
- `printOptionalRequirements(int n)`

---

- `printMERequirements()`
- `printMERequirements(int n)`

---

- `printActions()`
- `printActions(int n)`
- `printActions(bool includeCoveredRequirements)`
- `printActions(int n, bool includeCoveredRequirements)`

---

# The Solver Code

```java
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


import java.util.*;
import java.io.*;

// -------------------------------------------------------------
//
//  DLXCell is one cell in the Algorithm X matrix. This implementation was mostly
//  copied from @RoboStac's solution to Constrained Latin Squares on www.codingame.com.
//
//  https://www.codingame.com/training/medium/constrained-latin-squares
//
// -------------------------------------------------------------
class DLXCell {
    DLXCell prev_x, next_x;
    DLXCell prev_y, next_y;

    DLXCell col_header;
    DLXCell row_header;

    Requirement requirement;   // column headers only
    Action action;             // row headers only

    // Size quickly identifies how many rows are in any particular column.
    int size = 0;

    DLXCell() {
        prev_x = next_x = this;
        prev_y = next_y = this;
    }

    void remove_x() {
        prev_x.next_x = next_x;
        next_x.prev_x = prev_x;
    }

    void restore_x() {
        prev_x.next_x = this;
        next_x.prev_x = this;
    }

    void remove_y() {
        prev_y.next_y = next_y;
        next_y.prev_y = prev_y;
    }

    void restore_y() {
        prev_y.next_y = this;
        next_y.prev_y = this;
    }

    void attach_horiz(DLXCell other) {
        DLXCell left = prev_x;
        other.prev_x = left;
        left.next_x = other;
        other.next_x = this;
        prev_x = other;
    }

    void attach_vert(DLXCell other) {
        DLXCell up = prev_y;
        other.prev_y = up;
        up.next_y = other;
        other.next_y = this;
        prev_y = other;
    }

    void remove_column() {
        remove_x();
        for (DLXCell r = next_y; r != this; r = r.next_y)
            r.remove_row();
    }

    void restore_column() {
        for (DLXCell r = prev_y; r != this; r = r.prev_y)
            r.restore_row();
        restore_x();
    }

    void remove_row() {
        for (DLXCell n = next_x; n != this; n = n.next_x) {
            n.col_header.size--;
            n.remove_y();
        }
    }

    void restore_row() {
        for (DLXCell n = prev_x; n != this; n = n.prev_x) {
            n.col_header.size++;
            n.restore_y();
        }
    }

    void select() {
        for (DLXCell n = this; ; n = n.next_x) {
            n.remove_y();
            n.col_header.remove_column();
            if (n.next_x == this) break;
        }
    }

    void unselect() {
        for (DLXCell n = prev_x; ; n = n.prev_x) {
            n.col_header.restore_column();
            n.restore_y();
            if (n == this) break;
        }
    }
}

// -------------------------------------------------------------
// Requirement & MERequirement Base Classes
// -------------------------------------------------------------
abstract class Requirement {
    final String key;
    boolean isOptional = false;

    Requirement(String k) {
        key = k;
    }

    String getKey() {
        return key;
    }
}

abstract class MERequirement extends Requirement {
    String a, b;

    static String makeMEKey(String x, String y) {
        return (x.compareTo(y) < 0)
                ? x + " -me- " + y
                : y + " -me- " + x;
    }

    MERequirement(String aa, String bb) {
        super(makeMEKey(aa, bb));
        if (aa.compareTo(bb) < 0) {
            a = aa;
            b = bb;
        } else {
            a = bb;
            b = aa;
        }
        isOptional = true;
    }
}

// -------------------------------------------------------------
// Action Base Class
// -------------------------------------------------------------
abstract class Action {
    final String key;
    List<Requirement> coveredRequirements = new ArrayList<>();

    Action(String k) {
        key = k;
    }

    String getKey() {
        return key;
    }
}

// -------------------------------------------------------------
// AlgorithmXSolver Base Class with DLX engine
// -------------------------------------------------------------
class AlgorithmXSolver {

    protected final long constructStartTime = System.nanoTime();

    // Requirement/Action containers
    protected final List<Requirement> requirements = new ArrayList<>();
    protected final List<Requirement> optionalRequirements = new ArrayList<>();
    protected final List<MERequirement> meRequirements = new ArrayList<>();
    protected final List<Action> actions = new ArrayList<>();

    // Lookup tables
    protected final Map<String, Requirement> requirementsLookup = new HashMap<>();
    protected final Map<String, MERequirement> meLookup = new HashMap<>();
    protected final Map<String, List<MERequirement>> meLists = new HashMap<>();

    // DLX structures
    protected final DLXCell matrixRoot = new DLXCell();
    protected final Map<String, DLXCell> colHeaders = new HashMap<>();
    protected final Map<String, DLXCell> rowHeaders = new HashMap<>();
    protected final List<DLXCell> dlxCells = new ArrayList<>();

    // Current solution
    protected final List<Action> solution = new ArrayList<>();

    // When stop_search is true, the search method knows a solution has been found and
    // the depth-first search is quickly unwound and the search method is exited.
    protected boolean stopSearch = false;

    // For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
    // can add functionality to check solutions as they are being built to steer away from
    // invalid solutions. The basic Algorithm X Solver never modifies this attribute.
    protected boolean solutionIsValid = true;

    // A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
    // In the basic Solver, nothing is ever put into the history. A subclass can override
    // the ProcessRowSelection() method to add history in cases of multiplicity. 
    protected final List<Set<String>> history = new ArrayList<>(List.of(new HashSet<>()));

    public long solutionCount = 0;

    // ------------------------------------------------------------------
    // Requirement/Action helpers
    // ------------------------------------------------------------------
    void addRequirement(Requirement r) {
        requirementsLookup.put(r.key, r);
        requirements.add(r);
    }

    void addOptionalRequirement(Requirement r) {
        requirementsLookup.put(r.key, r);
        r.isOptional = true;
        optionalRequirements.add(r);
    }

    void addMERequirement(MERequirement r) {
        if (meLookup.containsKey(r.key)) return;

        meRequirements.add(r);
        meLookup.put(r.key, r);

        meLists.computeIfAbsent(r.a, k -> new ArrayList<>()).add(r);
        meLists.computeIfAbsent(r.b, k -> new ArrayList<>()).add(r);
    }

    Action addAction(Action a) {
        actions.add(a);
        return a;
    }

    void attachRequirement(Action a, String key) {
        Requirement r = requirementsLookup.get(key);
        if (r == null)
            throw new RuntimeException("Requirement not found: " + key);
        a.coveredRequirements.add(r);
    }

    void attachMERequirements(Action a, String key) {
        List<MERequirement> list = meLists.get(key);
        if (list != null)
            a.coveredRequirements.addAll(list);
    }

    // ------------------------------------------------------------------
    // DLX Matrix builder (called automatically in solve)
    // ------------------------------------------------------------------
    protected void buildMatrix() {
        if (!colHeaders.isEmpty())
            throw new RuntimeException("BuildMatrix called twice");

        // Merge all requirements into one list: required → optional → me.
        // Required requirements must precede optional requirements in header order.
        // Search stops scanning columns when first optional requirement is encountered.
        List<Requirement> all = new ArrayList<>();
        all.addAll(requirements);
        all.addAll(optionalRequirements);
        all.addAll(meRequirements);

        // Create column headers
        for (Requirement r : all) {
            DLXCell node = new DLXCell();
            node.requirement = r;
            colHeaders.put(r.key, node);
        }

        // Horizontally link columns to root
        matrixRoot.size = Integer.MAX_VALUE;
        for (Requirement r : all)
            matrixRoot.attach_horiz(colHeaders.get(r.key));

        // Create a row in the matrix for every action.
        for (Action action : actions) {
            DLXCell rowNode = new DLXCell();
            rowNode.action = action;
            rowHeaders.put(action.key, rowNode);

            DLXCell prev = null;
            for (Requirement r : action.coveredRequirements) {
                DLXCell col = colHeaders.get(r.key);
                DLXCell cell = new DLXCell();
                cell.col_header = col;
                cell.row_header = rowNode;

                col.attach_vert(cell);
                col.size++;

                if (prev != null)
                    prev.attach_horiz(cell);

                prev = cell;
                dlxCells.add(cell);
            }
        }
    }

    public void solve(boolean findAllSolutions, boolean showTiming) {
        if (showTiming) {
            long ms = (System.nanoTime() - constructStartTime) / 1_000_000;
            System.err.println("[Timing] Build Requirements & Actions: " + ms + " ms");
        }

        long t = System.nanoTime();
        buildMatrix();
        if (showTiming)
            System.err.println("[Timing] DLX Matrix Build: " + (System.nanoTime() - t) / 1_000_000 + " ms");

        t = System.nanoTime();
        search(findAllSolutions);
        if (showTiming)
            System.err.println("[Timing] Search: " + (System.nanoTime() - t) / 1_000_000 + " ms\n");
    }

    protected void search(boolean findAllSolutions) {
        if (stopSearch) return;

        // Algorithm X: Choose a Column
        //
        // Choose the column (requirement) with the best value for "sort criteria". For
        // the basic implementation of sort criteria, Algorithm X always chooses the column
        // covered by the fewest number of actions. Optional requirements are not eligible 
        // for this step.
        DLXCell best = matrixRoot;
        int bestValue = Integer.MAX_VALUE;

        for (DLXCell node = matrixRoot.next_x; node != matrixRoot; node = node.next_x) {
            // Optional requirements stop the search for the best column.
            if (node.requirement.isOptional)
                break;

            // Get the sort criteria for this requirement (column).
            int v = requirementSortCriteria(node);
            if (v < bestValue) {
                bestValue = v;
                best = node;
            }
        }

        if (best == matrixRoot) {
            processSolution();
            if (solutionIsValid) {
                solutionCount++;
                if (!findAllSolutions)
                    stopSearch = true;
            }
            return;
        }

        // Algorithm X: Choose a Row
        //
        // The next step is to loop through all possible actions. To prepare for this,
        // a new level of history is created. The history for this new level starts out
        // as a complete copy of the most recent history.
        history.add(new HashSet<>(history.get(history.size() - 1)));

        // Loop through all possible actions in the order they were provided when identified.
        for (DLXCell node = best.next_y; node != best; node = node.next_y) {
            if (stopSearch) break;

            select(node);
            if (solutionIsValid)
                search(findAllSolutions);
            deselect(node);

            // All backtracking results in going back to a solution that is valid.
            solutionIsValid = true;
        }

        history.remove(history.size() - 1);
    }

    // Algorithm X: Shrink Matrix Due to Row Selection
    //
    // The select method updates the matrix when a row is selected as part of a solution.
    // Other rows that satisfy overlapping requirements need to be deleted and in the end,
    // all columns satisfied by the selected row get removed from the matrix.
    protected void select(DLXCell node) {
        node.select();
        solution.add(node.row_header.action);
        processRowSelection(node.row_header.action);
    }

    // Algorithm X: Rebuild Matrix Due to Row Deselection
    //
    // The Select() method selects a row as part of the solution being explored. Eventually that
    // exploration ends and it is time to move on to the next row (action). Before moving on,
    // the matrix and the partial solution need to be restored to their prior states.
    protected void deselect(DLXCell node) {
        node.unselect();
        solution.remove(solution.size() - 1);
        processRowDeselection(node.row_header.action);
    }

    // In cases of multiplicity, this method can be used to ask Algorithm X to remember that
    // it has already tried certain things. For instance, if Emma wants two music lessons per
    // week, trying to put her first lesson on Monday at 8am is no different than trying to put
    // her second lesson on Monday at 8am. See the Algorithm X Playground for more details, 
    // specifically Mrs. Knuth - Part III.
    protected void remember(String item) {
        Set<String> cur = history.get(history.size() - 1);
        if (cur.contains(item))
            solutionIsValid = false;
        else
            cur.add(item);
    }

    // In some cases it may be beneficial to have Algorithm X try covering certain requirements
    // before others as it looks for paths through the matrix. The default is to sort the requirements
    // by how many actions cover each requirement, but in some cases there might be several 
    // requirements covered by the same number of actions. By overriding this method, the
    // Algorithm X Solver can be directed to break ties a certain way or consider another way
    // of prioritizing the requirements.
    protected int requirementSortCriteria(DLXCell colHeader) { return colHeader.size; }

    // The following method can be overridden by a subclass to add logic to perform more detailed solution
    // checking if invalid paths are possible through the matrix. Some problems have requirements that
    // cannot be captured in the basic requirements. For instance, a solution might only be valid if it 
    // fits certain parameters that can only be checked at intermediate steps. In a case like that, this 
    // method can be overridden to add the functionality necessary to check the solution.
    //
    // If the subclass logic results in an invalid solution, the 'solutionIsValid' attribute should be set
    // to false instructing Algorithm X to stop progressing down this path in the matrix.
    protected void processRowSelection(Action action) {}

    // This method can be overridden by a subclass to add logic to perform more detailed solution
    // checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
    // processRowSelection() method above to "undo" what was done above.
    protected void processRowDeselection(Action action) {}

    // This method MUST be overridden to process a solution when it is found. If many possible solutions exist,
    // this method can be overridden to instruct Algorithm X to do something every time a solution is found.
    // For instance, Algorithm X might be looking for the best solution or maybe each solution must be
    // validated in some way. In either case, the solutionIsValid attribute can be set to false
    // if the current solution should not be considered valid and should not be generated.
    protected void processSolution() {}

    // ------------------------------------------------------------------
    // Debug printing helpers
    // ------------------------------------------------------------------
    public void printRequirements(int n) {
        System.err.println("Required Requirements (" + requirements.size() + "):");
        int count = 0;
        for (Requirement r : requirements) {
            if (count++ >= n) break;
            System.err.println("    " + r.getKey());
        }
        System.err.println();
    }

    public void printOptionalRequirements(int n) {
        System.err.println("Optional Requirements (" + optionalRequirements.size() + "):");
        int count = 0;
        for (Requirement r : optionalRequirements) {
            if (count++ >= n) break;
            System.err.println("    " + r.getKey());
        }
        System.err.println();
    }

    public void printMERequirements(int n) {
        System.err.println("ME Requirements (" + meRequirements.size() + "):");
        int count = 0;
        for (MERequirement r : meRequirements) {
            if (count++ >= n) break;
            System.err.println("    " + r.getKey());
        }
        System.err.println();
    }

    public void printActions(int n, boolean includeCoveredRequirements) {
        System.err.println("Actions (" + actions.size() + "):");
        int count = 0;
        for (Action a : actions) {
            if (count++ >= n) break;
            System.err.println("    " + a.getKey());
            if (includeCoveredRequirements && !a.coveredRequirements.isEmpty()) {
                for (Requirement r : a.coveredRequirements) {
                    System.err.println("        " + r.getKey());
                }
            }
        }
        System.err.println();
    }

    // ------------------------------------------------------------------
    // Debug printing helpers - overrides for default arguments
    // ------------------------------------------------------------------
    public void printRequirements() {
        printOptionalRequirements(Integer.MAX_VALUE);
    }

    public void printOptionalRequirements() {
        printOptionalRequirements(Integer.MAX_VALUE);
    }

    public void printMERequirements() {
        printMERequirements(Integer.MAX_VALUE);
    }

    public void printActions() {
        printActions(Integer.MAX_VALUE, false);
    }

    public void printActions(int n) {
        printActions(n, false);
    }

    public void printActions(boolean includeCoveredRequirements) {
        printActions(Integer.MAX_VALUE, includeCoveredRequirements);
    }
}
```

<BR>