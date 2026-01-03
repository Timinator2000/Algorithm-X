# Dart

The following Dart translation of `AlgorithmXSolver` is derived from the C++ version, which serves as the recommended reference for its structure, algorithms, and overall design.

Detailed explanations have been omitted, as they align closely with the discussion in the [C++ version](../23-solver-translations/05-cpp.md).

---

# Problem-Specific Requirements

```dart
class CellCovered extends Requirement {
  final int row, col;

  static String makeKey(int row, int col) 
    => 'cell covered $row $col';

  CellCovered(this.row, this.col) : super(makeKey(row, col));
}

class ValInRow extends Requirement {
  final int row;
  final String val;

  static String makeKey(int row, String val) 
    => 'val in row $row $val';

  ValInRow(this.row, this.val) : super(makeKey(row, val));
}

class ValInCol extends Requirement {
  final int col;
  final String val;

  static String makeKey(int col, String val) 
    => 'val in col $col $val';

  ValInCol(this.col, this.val) : super(makeKey(col, val));
}

class ValInBox extends Requirement {
  final int box;
  final String val;

  static String makeKey(int box, String val) 
    => 'val in box $box $val';

  ValInBox(this.box, this.val) : super(makeKey(box, val));
}
```

---

# Problem-Specific Actions

```dart
class PlaceValue extends Action {
  final int row, col;
  final String val;

  static String makeKey(int row, int col, String val) 
    => 'place value $row $col $val';

  PlaceValue(this.row, this.col, this.val) : super(makeKey(row, col, val));
}
```

---

# Example - 9x9 Sudoku

```dart
class SudokuSolver extends AlgorithmXSolver {
  final List<List<String>> grid;

  SudokuSolver(this.grid, values) {

    // Build the requirements - for instance:

    // The cell at (0, 0) must be covered:
    addRequirement(CellCovered(0, 0));

    // There must be a '3' in the first row, the first col and the first box:
    addRequirement(ValInRow(0, '3'));
    addRequirement(ValInCol(0, '3'));
    addRequirement(ValInBox(0, '3'));

    // Build the actions and attach the covered requirements.

    // Consider the single action of putting a '6' at location (2, 2):
    var action = addAction(PlaceValue(2, 2, '6'));

    attachRequirement(action, CellCovered.makeKey(2, 2));
    attachRequirement(action, ValInRow.makeKey(2, '6'));
    attachRequirement(action, ValInCol.makeKey(2, '6'));
    attachRequirement(action, ValInBox.makeKey(0, '6'));
  }


  @override
  void processSolution() {
    for (var action in solution) {
      var pvAction = action as PlaceValue;

        // Use the attributes of the pvAction to build the solution:
        //      pvAction.row
        //      pvAction.col
        //      pvAction.val
    }
  }
}


void main() {

  // read input

  final solver = SudokuSolver(grid, allValues);
  solver.solve();

  for (var row in grid) {
    print(row.join());
  }
}
```

---

# Mutual Exclusivity

MERequirement Definition:

```dart
class LoudInstrument extends MERequirement {
  static String makeKey(String day, int hour) => '$day $hour';

  LoudInstrument(String day, int h1, int h2)
    : super(makeKey(day, h1), makeKey(day, h2));
}
```

Registration:

```dart
  addMERequirement(LoudInstrument('F', 8, 9));
  addMERequirement(LoudInstrument('F', 9, 10));
  addMERequirement(LoudInstrument('F', 10, 11));
```

Usage:

```dart
  if (LOUD_INSTRUMENTS.contains(s.instrument)) {
    attachMERequirements(action, LoudInstrument.makeKey(day, hour));
  }
```

---

# Multiplicity

Add `toRemember`:

```dart
class PlaceStudent extends Action {
  // initialize other attributes ...
  final String toRemember;

  static String makeKey() => ' ... ';

  // In constructor, build a string that identifies what should be remembered about this action.
  PlaceStudent()
    : toRemember = '${student.name} $day $hour',
      super(makeKey());
}
```

Override `ProcessRowSelection`:

```dart
  @override
  void processRowSelection(Action action) {
    remember((action as PlaceStudent).toRemember);
  }
```

---

# Debug Print Helpers

- `printRequirements({int n = 1000000})`
- `printOptionalRequirements({int n = 1000000})`
- `printMERequirements({int n = 1000000})`
- `printActions({int n = 1000000, bool includeCoveredRequirements = false})`

---

# The Solver Code

```dart
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

import 'dart:io';
import 'dart:math';

// -------------------------------------------------------------
//
//  DLXCell is one cell in the Algorithm X matrix. This implementation was mostly
//  copied from @RoboStac's solution to Constrained Latin Squares on www.codingame.com.
//
//  https://www.codingame.com/training/medium/constrained-latin-squares
//
// -------------------------------------------------------------

class DLXCell {
  late DLXCell prevX, nextX;
  late DLXCell prevY, nextY;

  late DLXCell colHeader;
  late DLXCell rowHeader;

  late Requirement requirement; // column headers only
  late Action action;           // row headers only

  // Size quickly identifies how many rows are in any particular column.
  int size = 0;

  DLXCell() {
    prevX = nextX = this;
    prevY = nextY = this;
  }

  void removeX() {
    prevX.nextX = nextX;
    nextX.prevX = prevX;
  }

  void restoreX() {
    prevX.nextX = this;
    nextX.prevX = this;
  }

  void removeY() {
    prevY.nextY = nextY;
    nextY.prevY = prevY;
  }

  void restoreY() {
    prevY.nextY = this;
    nextY.prevY = this;
  }

  void attachHoriz(DLXCell other) {
    DLXCell left = prevX;
    other.prevX = left;
    left.nextX = other;
    other.nextX = this;
    prevX = other;
  }

  void attachVert(DLXCell other) {
    DLXCell up = prevY;
    other.prevY = up;
    up.nextY = other;
    other.nextY = this;
    prevY = other;
  }

  void removeColumn() {
    removeX();
    for (DLXCell node = nextY; node != this; node = node.nextY) {
      node.removeRow();
    }
  }

  void restoreColumn() {
    for (DLXCell node = prevY; node != this; node = node.prevY) {
      node.restoreRow();
    }
    restoreX();
  }

  void removeRow() {
    for (DLXCell node = nextX; node != this; node = node.nextX) {
      node.colHeader.size--;
      node.removeY();
    }
  }

  void restoreRow() {
    for (DLXCell node = prevX; node != this; node = node.prevX) {
      node.colHeader.size++;
      node.restoreY();
    }
  }

  void select() {
    for (DLXCell node = this;; node = node.nextX) {
      node.removeY();
      node.colHeader.removeColumn();
      if (node.nextX == this) break;
    }
  }

  void unselect() {
    for (DLXCell node = prevX;; node = node.prevX) {
      node.colHeader.restoreColumn();
      node.restoreY();
      if (node == this) break;
    }
  }
}

// -------------------------------------------------------------
// Requirement and MERequirement Base Classes
// -------------------------------------------------------------
class Requirement {
  final String key;
  bool isOptional = false;
  Requirement(this.key);
}

class MERequirement extends Requirement {
  final String a;
  final String b;

  MERequirement(String x, String y)
      : a = (x.compareTo(y) <= 0) ? x : y,
        b = (x.compareTo(y) <= 0) ? y : x,
        super(makeKey(x, y)) {
    isOptional = true;
  }

  static String makeKey(String x, String y) {
    return (x.compareTo(y) <= 0)
        ? '$x -me- $y'
        : '$y -me- $x';
  }
}

// -------------------------------------------------------------
// Action Base Class
// -------------------------------------------------------------
class Action {
  final String key;
  final List<Requirement> coveredRequirements = [];
  Action(this.key);
}

// -------------------------------------------------------------
// AlgorithmXSolver Base Class with DLX engine
// -------------------------------------------------------------
class AlgorithmXSolver {
  final constructStartTime = DateTime.now();

  // Requirement/Action containers
  final List<Requirement> requirements = [];
  final List<Requirement> optionalRequirements = [];
  final List<MERequirement> meRequirements = [];
  final List<Action> actions = [];

  // Lookup tables mapping requirement keys (strings) to requirement pointers.
  final Map<String, Requirement> requirementsLookup = {};
  final Map<String, MERequirement> meLookup = {};
  final Map<String, List<MERequirement>> meLists = {};

  // DLX structures
  late DLXCell matrixRoot;
  final Map<String, DLXCell> colHeaders = {};
  final Map<String, DLXCell> rowHeaders = {};
  final List<DLXCell> dlxCells = [];

  // The list of actions (rows) that produce the current path through the matrix.
  final List<Action> solution = [];

  // When stop_search is true, the search method knows a solution has been found and
  // the depth-first search is quickly unwound and the search method is exited.
  bool stopSearch = false;

  // For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
  // can add functionality to check solutions as they are being built to steer away from
  // invalid solutions. The basic Algorithm X Solver never modifies this attribute.
  bool solutionIsValid = true;

  // A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
  // In the basic Solver, nothing is ever put into the history. A subclass can override
  // the process_row_selection() method to add history in cases of multiplicity. 
  final List<Set<String>> history = [{}];

  int solutionCount = 0;

  AlgorithmXSolver() {
    matrixRoot = DLXCell();
  }

  // ------------------------------------------------------------------
  //  Requirement/Action helpers
  // ------------------------------------------------------------------
  void addRequirement(Requirement r) {
    requirements.add(r);
    requirementsLookup[r.key] = r;
  }

  void addOptionalRequirement(Requirement r) {
    r.isOptional = true;
    optionalRequirements.add(r);
    requirementsLookup[r.key] = r;
  }

  void addMERequirement(MERequirement me) {
    // Check for duplicate MERequirement
    if (meLookup.containsKey(me.key)) return;

    meRequirements.add(me);
    meLookup[me.key] = me;
    meLists.putIfAbsent(me.a, () => []).add(me);
    meLists.putIfAbsent(me.b, () => []).add(me);
  }

  Action addAction(Action a) {
    actions.add(a);
    return a;
  }

  void attachRequirement(Action a, String key) {
    var req = requirementsLookup[key];
    if (req == null) throw 'Requirement not found: $key';
    a.coveredRequirements.add(req);
  }

  void attachMERequirements(Action a, String key) {
    if (meLists.containsKey(key)) {
      a.coveredRequirements.addAll(meLists[key]!);
    }
  }

  // ------------------------------------------------------------------
  //  DLX matrix builder (called automatically in solve)
  // ------------------------------------------------------------------
  void buildMatrix() {
    assert(colHeaders.isEmpty, "buildMatrix called twice");

    // Merge all requirements into one list: required → optional → me.
    // Required requirements must precede optional requirements in header order.
    // Search stops scanning columns when first optional requirement is encountered.
    var allRequirements = [
      ...requirements,
      ...optionalRequirements,
      ...meRequirements
    ];

    // Create column headers
    for (var r in allRequirements) {
      var node = DLXCell();
      node.requirement = r;
      colHeaders[r.key] = node;
    }

    // Horizontally link columns to root
    matrixRoot.size = 1 << 30;
    for (var r in allRequirements) {
      matrixRoot.attachHoriz(colHeaders[r.key]!);
    }

    // Create a row in the matrix for every action.
    for (var a in actions) {
      var rowNode = DLXCell();
      rowNode.action = a;
      rowHeaders[a.key] = rowNode;

      DLXCell? prev;
      for (var r in a.coveredRequirements) {
        var col = colHeaders[r.key]!;

        var cell = DLXCell();
        cell.colHeader = col;
        cell.rowHeader = rowNode;

        col.attachVert(cell);
        col.size++;
        if (prev != null) prev.attachHoriz(cell);
        prev = cell;

        dlxCells.add(cell);
      }
    }
  }

  void solve({bool findAllSolutions = false, bool showTiming = false}) {

    int time = DateTime.now().difference(constructStartTime).inMilliseconds;
    if (showTiming)
      stderr.writeln('[Timing] Build Requirements & Actions: ${time} ms');

    final buildMatrixStart = DateTime.now();
    buildMatrix();

    time = DateTime.now().difference(buildMatrixStart).inMilliseconds;
    if (showTiming)
      stderr.writeln('[Timing] DLX Matrix Build: ${time} ms');

    final searchStart = DateTime.now();
    search(findAllSolutions);

    time = DateTime.now().difference(searchStart).inMilliseconds;
    if (showTiming)
      stderr.writeln('[Timing] Search: ${time} ms\n');
  }

  void search(bool findAllSolutions) {
    if (stopSearch) return;

    // Algorithm X: Choose a Column
    //
    // Choose the column (requirement) with the best value for "sort criteria". For
    // the basic implementation of sort criteria, Algorithm X always chooses the column
    // covered by the fewest number of actions. Optional requirements are not eligible 
    // for this step.
    DLXCell bestCol = matrixRoot;
    int bestValue = 1 << 30;
    for (DLXCell node = matrixRoot.nextX; node != matrixRoot; node = node.nextX) {

      // Optional requirements stop the search for the best column.
      if (node.requirement.isOptional) break;

      // Get the sort criteria for this requirement (column).
      int v = requirementSortCriteria(node);
      if (v < bestValue) {
        bestValue = v;
        bestCol = node;
      }
    }

    if (bestCol == matrixRoot) {
      processSolution();
      if (solutionIsValid) {
        solutionCount++;
        if (!findAllSolutions) stopSearch = true;
      }
      return;
    }

    // Algorithm X: Choose a Row
    //
    // The next step is to loop through all possible actions. To prepare for this,
    // a level of history is created. The history for this level starts out
    // as a complete copy of the most recent history.
    history.add(Set.from(history.last));

    // Loop through all possible actions in the order they were provided when identified.
    for (DLXCell node = bestCol.nextY; node != bestCol; node = node.nextY) {
      if (stopSearch) break;
      select(node);
      if (solutionIsValid) search(findAllSolutions);
      deselect(node);

      // All backtracking results in going back to a solution that is valid.
      solutionIsValid = true;
    }

    history.removeLast();
  }

  // Algorithm X: Shrink Matrix Due to Row Selection
  //
  // The select method updates the matrix when a row is selected as part of a solution.
  // Other rows that satisfy overlapping requirements need to be deleted and in the end,
  // all columns satisfied by the selected row get removed from the matrix.
  void select(DLXCell node) {
    node.select();
    solution.add(node.rowHeader.action);
    processRowSelection(node.rowHeader.action);
  }

  // Algorithm X: Rebuild Matrix Due to Row Deselection
  //
  // The select() method selects a row as part of the solution being explored. Eventually that
  // exploration ends and it is time to move on to the next row (action). Before moving on,
  // the matrix and the partial solution need to be restored to their prior states.
  void deselect(DLXCell node) {
    node.unselect();
    solution.removeLast();
    processRowDeselection(node.rowHeader.action);
  }

  // In cases of multiplicity, this method can be used to ask Algorithm X to remember that
  // it has already tried certain things. For instance, if Emma wants two music lessons per
  // week, trying to put her first lesson on Monday at 8am is no different than trying to put
  // her second lesson on Monday at 8am. See the Algorithm X Playground for more details, 
  // specifically Mrs. Knuth - Part III.
  void remember(String item) {
    var currentLevel = history.last;
    if (currentLevel.contains(item)) {
      solutionIsValid = false;
    } else {
      currentLevel.add(item);
    }
  }

  // In some cases it may be beneficial to have Algorithm X try covering certain requirements
  // before others as it looks for paths through the matrix. The default is to sort the requirements
  // by how many actions cover each requirement, but in some cases there might be several 
  // requirements covered by the same number of actions. By overriding this method, the
  // Algorithm X Solver can be directed to break ties a certain way or consider another way
  // of prioritizing the requirements.
  int requirementSortCriteria(DLXCell colHeader) => colHeader.size;

  // The following method can be overridden by a subclass to add logic to perform more detailed solution
  // checking if invalid paths are possible through the matrix. Some problems have requirements that
  // cannot be captured in the basic requirements. For instance, a solution might only be valid if it 
  // fits certain parameters that can only be checked at intermediate steps. In a case like that, this 
  // method can be overridden to add the functionality necessary to check the solution.
  //
  // If the subclass logic results in an invalid solution, the 'solution_is_valid' attribute should be set
  // to false instructing Algorithm X to stop progressing down this path in the matrix.
  void processRowSelection(Action action) {}

  // This method can be overridden by a subclass to add logic to perform more detailed solution
  // checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
  // process_row_selection() method above to "undo" what was done above.
  void processRowDeselection(Action action) {}

  // This method MUST be overridden to process a solution when it is found. If many possible solutions exist,
  // this method can be overridden to instruct Algorithm X to do something every time a solution is found.
  // For instance, Algorithm X might be looking for the best solution or maybe each solution must be
  // validated in some way. In either case, the solution_is_valid attribute can be set to false
  // if the current solution should not be considered valid and should not be generated.
  void processSolution() {}

  // ------------------------------------------------------------------
  // Debug printing helpers
  // ------------------------------------------------------------------
  void printRequirements({int n = 1000000}) {
    stderr.writeln('Required Requirements (${requirements.length}):');
    for (int i = 0; i < min(n, requirements.length); i++) {
      stderr.writeln('    ${requirements[i].key}');
    }
    stderr.writeln('');
  }

  void printOptionalRequirements({int n = 1000000}) {
    stderr.writeln('Optional Requirements (${optionalRequirements.length}):');
    for (int i = 0; i < min(n, optionalRequirements.length); i++) {
      stderr.writeln('    ${optionalRequirements[i].key}');
    }
    stderr.writeln('');
  }

  void printMERequirements({int n = 1000000}) {
    stderr.writeln('ME Requirements (${meRequirements.length}):');
    for (int i = 0; i < min(n, meRequirements.length); i++) {
      stderr.writeln('    ${meRequirements[i].key}');
    }
    stderr.writeln('');
  }

  void printActions({int n = 1000000, bool includeCoveredRequirements = false}) {
    stderr.writeln('Actions (${actions.length}):');
    for (int i = 0; i < min(n, actions.length); i++) {
      stderr.writeln('    ${actions[i].key}');
      if (includeCoveredRequirements) {
        for (var r in actions[i].coveredRequirements) {
          stderr.writeln('        ${r.key}');
        }
      }
    }
    stderr.writeln('');
  }
}
```

<BR>