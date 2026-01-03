# JavaScript

The following JavaScript translation of `AlgorithmXSolver` is derived from the C++ version, which serves as the recommended reference for its structure, algorithms, and overall design.

Detailed explanations have been omitted, as they align closely with the discussion in the [C++ version](../23-solver-translations/05-cpp.md).

---

# Problem-Specific Requirements

```js
class CellCovered extends Requirement {
    static makeKey(row, col) {
        return `cell covered ${row} ${col}`;
    }

    constructor(row, col) {
        super(CellCovered.makeKey(row, col));
        this.row = row;
        this.col = col;
    }
}

class ValInRow extends Requirement {
    static makeKey(row, val) {
        return `val in row ${row} ${val}`;
    }

    constructor(row, val) {
        super(ValInRow.makeKey(row, val));
        this.row = row;
        this.val = val;
    }
}

class ValInCol extends Requirement {
    static makeKey(col, val) {
        return `val in col ${col} ${val}`;
    }

    constructor(col, val) {
        super(ValInCol.makeKey(col, val));
        this.col = col;
        this.val = val;
    }
}

class ValInBox extends Requirement {
    static makeKey(box, val) {
        return `val in box ${box} ${val}`;
    }

    constructor(box, val) {
        super(ValInBox.makeKey(box, val));
        this.box = box;
        this.val = val;
    }
}
```

---

# Problem-Specific Actions

```js
class PlaceValue extends Action {
    static makeKey(row, col, val) {
        return `place value ${row} ${col} ${val}`;
    }

    constructor(row, col, val) {
        super(PlaceValue.makeKey(row, col, val));
        this.row = row;
        this.col = col;
        this.val = val;
    }
}
```

---

# Example - 9x9 Sudoku

```js
class SudokuSolver extends AlgorithmXSolver {

    constructor(grid, values) {
        super();
        this.grid = grid;

        // Build the requirements - for instance:

        // The cell at (0, 0) must be covered:
        this.addRequirement(new CellCovered(0, 0));

        // There must be a '3' in the first row, the first col and the first box:
        this.addRequirement(new ValInRow(0, '3'));
        this.addRequirement(new ValInCol(0, '3'));
        this.addRequirement(new ValInBox(0, '3'));

        // Build the actions and attach the covered requirements.

        // Consider the single action of putting a '6' at location (2, 2):
        const action = this.addAction(new PlaceValue(2, 2, '6'));

        this.attachRequirement(action, CellCovered.makeKey(2, 2));
        this.attachRequirement(action, ValInRow.makeKey(2, '6'));
        this.attachRequirement(action, ValInCol.makeKey(2, '6'));
        this.attachRequirement(action, ValInBox.makeKey(0, '6'));
    }


    processSolution() {
        for (const action of this.solution) {

            // Use the attributes of the action to build the solution:
            //      action.row
            //      action.col
            //      action.val
        }
    }
};


// read input

const solver = new SudokuSolver(grid, ALL_VALUES);
solver.solve();

for (const row of grid)
    console.log(row.join(""));
```

---

# Mutual Exclusivity

MERequirement Definition:

```js
class LoudInstrument extends MERequirement {
    static makeKey(day, hour) {
        return `loud instrument ${day} ${hour}`;
    }

    constructor(day, hour1, hour2) {
        super(
            LoudInstrument.makeKey(day, hour1),
            LoudInstrument.makeKey(day, hour2)
        );
    }
}
```

Registration:

```js
    this.addMERequirement(new LoudInstrument("F", 8, 9));
    this.addMERequirement(new LoudInstrument("F", 9, 10));
    this.addMERequirement(new LoudInstrument("F", 10, 11));
```

Usage:

```js
    if (LOUD_INSTRUMENTS.has(s.instrument))
        this.attachMERequirements(action, LoudInstrument.makeKey(day, hour));
```

---

# Multiplicity

Add `toRemember`:

```js
class PlaceStudent extends Action {
    static makeKey() {
        return /* unique string key for the action */;
    }

    constructor() {
        super(PlaceStudent.makeKey());
        // initialize other attributes ...
        
        // Build a string that identifies what should be remembered about this action.
        this.toRemember = `${student.name} ${day} ${hour}`;
    }
}
```

Override `processRowSelection`:

```js
    processRowSelection(action) {
        this.remember(action.toRemember);
    }
```

---

# Debug Print Helpers

- `printRequirements(n = Number.MAX_SAFE_INTEGER)`
- `printOptionalRequirements(n = Number.MAX_SAFE_INTEGER)`
- `printMERequirements(n = Number.MAX_SAFE_INTEGER)`
- `printActions(n = Number.MAX_SAFE_INTEGER, includeCoveredRequirements = false)`

---

# The Solver Code

```js
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

// -------------------------------------------------------------
//
//  DLXCell is one cell in the Algorithm X matrix. This implementation was mostly
//  copied from @RoboStac's solution to Constrained Latin Squares on www.codingame.com.
//
//  https://www.codingame.com/training/medium/constrained-latin-squares
//
// -------------------------------------------------------------
class DLXCell {
    constructor() {
        this.prevX = this;
        this.nextX = this;
        this.prevY = this;
        this.nextY = this;

        this.colHeader = null;
        this.rowHeader = null;

        this.requirement = null;   // column headers only
        this.action = null;        // row headers only

        // Size quickly identifies how many rows are in any particular column.
        this.size = 0;
    }

    removeX() {
        this.prevX.nextX = this.nextX;
        this.nextX.prevX = this.prevX;
    }

    restoreX() {
        this.prevX.nextX = this;
        this.nextX.prevX = this;
    }

    removeY() {
        this.prevY.nextY = this.nextY;
        this.nextY.prevY = this.prevY;
    }

    restoreY() {
        this.prevY.nextY = this;
        this.nextY.prevY = this;
    }

    attachHoriz(other) {
        const left = this.prevX;
        other.prevX = left;
        left.nextX = other;
        other.nextX = this;
        this.prevX = other;
    }

    attachVert(other) {
        const up = this.prevY;
        other.prevY = up;
        up.nextY = other;
        other.nextY = this;
        this.prevY = other;
    }

    removeColumn() {
        this.removeX();
        for (let r = this.nextY; r !== this; r = r.nextY)
            r.removeRow();
    }

    restoreColumn() {
        for (let r = this.prevY; r !== this; r = r.prevY)
            r.restoreRow();
        this.restoreX();
    }

    removeRow() {
        for (let n = this.nextX; n !== this; n = n.nextX) {
            n.colHeader.size--;
            n.removeY();
        }
    }

    restoreRow() {
        for (let n = this.prevX; n !== this; n = n.prevX) {
            n.colHeader.size++;
            n.restoreY();
        }
    }

    select() {
        for (let n = this; ; n = n.nextX) {
            n.removeY();
            n.colHeader.removeColumn();
            if (n.nextX === this) break;
        }
    }

    unselect() {
        for (let n = this.prevX; ; n = n.prevX) {
            n.colHeader.restoreColumn();
            n.restoreY();
            if (n === this) break;
        }
    }
}

// -------------------------------------------------------------
// Requirement & MERequirement Base Classes
// -------------------------------------------------------------
class Requirement {
    constructor(key) {
        this.key = key;
        this.isOptional = false;
    }
}

class MERequirement extends Requirement {
    static makeMEKey(x, y) {
        return (x < y) ? `${x} -me- ${y}` : `${y} -me- ${x}`;
    }

    constructor(aa, bb) {
        super(MERequirement.makeMEKey(aa, bb));

        if (aa < bb) {
            this.a = aa;
            this.b = bb;
        } else {
            this.a = bb;
            this.b = aa;
        }
        this.isOptional = true;
    }
}

// -------------------------------------------------------------
// Action Base Class
// -------------------------------------------------------------
class Action {
    constructor(key) {
        this.key = key;
        this.coveredRequirements = [];
    }
}

// -------------------------------------------------------------
// AlgorithmXSolver Base Class with DLX engine
// -------------------------------------------------------------
class AlgorithmXSolver {
    constructor() {
        this.constructTimeStart = performance.now();

        // Requirement/Action containers
        this.requirements = [];
        this.optionalRequirements = [];
        this.meRequirements = [];
        this.actions = [];

        // Lookup tables
        this.requirementsLookup = new Map();
        this.meLookup = new Map();
        this.meLists = new Map();

        // DLX structures
        this.matrixRoot = new DLXCell();
        this.colHeaders = new Map();
        this.rowHeaders = new Map();
        this.dlxCells = [];

        // Current solution
        this.solution = [];

        // When stopSearch is true, the search method knows a solution has been found and
        // the depth-first search is quickly unwound and the search method is exited.
        this.stopSearch = false;

        // For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
        // can add functionality to check solutions as they are being built to steer away from
        // invalid solutions. The basic Algorithm X Solver never modifies this attribute.
        this.solutionIsValid = true;

        // A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
        // In the basic Solver, nothing is ever put into the history. A subclass can override
        // the ProcessRowSelection() method to add history in cases of multiplicity. 
        this.history = [new Set()];

        this.solutionCount = 0;
    }

    // ------------------------------------------------------------------
    // Requirement/Action helpers
    // ------------------------------------------------------------------
    addRequirement(requirement) {
        this.requirementsLookup.set(requirement.key, requirement);
        this.requirements.push(requirement);
    }

    addOptionalRequirement(requirement) {
        this.requirementsLookup.set(requirement.key, requirement);
        requirement.isOptional = true;
        this.optionalRequirements.push(requirement);
    }

    addMERequirement(meRequirement) {
        const key = meRequirement.key;

        if (this.meLookup.has(key))
            return;

        this.meRequirements.push(meRequirement);
        this.meLookup.set(key, meRequirement);

        if (!this.meLists.has(meRequirement.a))
            this.meLists.set(meRequirement.a, []);
        if (!this.meLists.has(meRequirement.b))
            this.meLists.set(meRequirement.b, []);

        this.meLists.get(meRequirement.a).push(meRequirement);
        this.meLists.get(meRequirement.b).push(meRequirement);
    }

    addAction(action) {
        this.actions.push(action);
        return action;
    }

    attachRequirement(action, key) {
        const requirement = this.requirementsLookup.get(key);
        if (!requirement)
            throw new Error(`Requirement not found: ${key}`);

        action.coveredRequirements.push(requirement);
    }

    attachMERequirements(action, key) {
        const list = this.meLists.get(key);
        if (list) {
            for (const me of list)
                action.coveredRequirements.push(me);
        }
    }

    // ------------------------------------------------------------------
    //  DLX matrix builder (called automatically in solve)
    // ------------------------------------------------------------------
    buildMatrix() {
        if (this.colHeaders.size !== 0)
            throw new Error("BuildMatrix called twice");

        // Merge all requirements into one list: required → optional → me.
        // Required requirements must precede optional requirements in header order.
        // Search stops scanning columns when first optional requirement is encountered.
        const allRequirements = [
            ...this.requirements,
            ...this.optionalRequirements,
            ...this.meRequirements
        ];

        // Create column headers
        for (const r of allRequirements) {
            const node = new DLXCell();
            node.requirement = r;
            this.colHeaders.set(r.key, node);
        }

        // Horizontally link columns to root
        this.matrixRoot.size = Number.MAX_SAFE_INTEGER;
        for (const r of allRequirements)
            this.matrixRoot.attachHoriz(this.colHeaders.get(r.key));

        // Create a row in the matrix for every action.
        for (const action of this.actions) {
            const rowNode = new DLXCell();
            rowNode.action = action;
            this.rowHeaders.set(action.key, rowNode);

            let prev = null;
            for (const r of action.coveredRequirements) {
                const col = this.colHeaders.get(r.key);
                const cell = new DLXCell();
                cell.colHeader = col;
                cell.rowHeader = rowNode;

                col.attachVert(cell);
                col.size++;

                if (prev)
                    prev.attachHoriz(cell);

                prev = cell;
                this.dlxCells.push(cell);
            }
        }
    }

    solve(findAllSolutions = false, showTiming = false) {
        if (showTiming) {
            console.error(
                "[Timing] Build Requirements & Actions: " +
                Math.round(performance.now() - this.constructTimeStart) + " ms"
            );
        }

        const sw = performance.now();
        this.buildMatrix();
        if (showTiming)
            console.error("[Timing] DLX Matrix Build: " +
                Math.round(performance.now() - sw) + " ms");

        const sw2 = performance.now();
        this.search(findAllSolutions);
        if (showTiming)
            console.error("[Timing] Search: " +
                Math.round(performance.now() - sw2) + " ms\n");
    }

    search(findAllSolutions) {
        if (this.stopSearch) return;

        // Algorithm X: Choose a Column
        //
        // Choose the column (requirement) with the best value for "sort criteria". For
        // the basic implementation of sort criteria, Algorithm X always chooses the column
        // covered by the fewest number of actions. Optional requirements are not eligible 
        // for this step.
        let bestCol = this.matrixRoot;
        let bestValue = Number.MAX_SAFE_INTEGER;

        for (let node = this.matrixRoot.nextX; node !== this.matrixRoot; node = node.nextX) {
            // Optional requirements stop the search for the best column.
            if (node.requirement.isOptional)
                break;

            // Get the sort criteria for this requirement (column).
            const v = this.requirementSortCriteria(node);
            if (v < bestValue) {
                bestValue = v;
                bestCol = node;
            }
        }

        if (bestCol === this.matrixRoot) {
            this.processSolution();
            if (this.solutionIsValid) {
                this.solutionCount++;
                if (!findAllSolutions)
                    this.stopSearch = true;
            }
            return;
        }

        // Algorithm X: Choose a Row
        //
        // The next step is to loop through all possible actions. To prepare for this,
        // a new level of history is created. The history for this new level starts out
        // as a complete copy of the most recent history.
        this.history.push(new Set(this.history[this.history.length - 1]));

        // Loop through all possible actions in the order they were provided when identified.
        for (let node = bestCol.nextY; node !== bestCol; node = node.nextY) {
            if (this.stopSearch) break;

            this.select(node);
            if (this.solutionIsValid)
                this.search(findAllSolutions);
            this.deselect(node);

            // All backtracking results in going back to a solution that is valid.
            this.solutionIsValid = true;
        }

        this.history.pop();
    }

    // Algorithm X: Shrink Matrix Due to Row Selection
    //
    // The select method updates the matrix when a row is selected as part of a solution.
    // Other rows that satisfy overlapping requirements need to be deleted and in the end,
    // all columns satisfied by the selected row get removed from the matrix.
    select(node) {
        node.select();
        this.solution.push(node.rowHeader.action);
        this.processRowSelection(node.rowHeader.action);
    }

    // Algorithm X: Rebuild Matrix Due to Row Deselection
    //
    // The Select() method selects a row as part of the solution being explored. Eventually that
    // exploration ends and it is time to move on to the next row (action). Before moving on,
    // the matrix and the partial solution need to be restored to their prior states.
    deselect(node) {
        node.unselect();
        this.solution.pop();
        this.processRowDeselection(node.rowHeader.action);
    }

    // In cases of multiplicity, this method can be used to ask Algorithm X to remember that
    // it has already tried certain things. For instance, if Emma wants two music lessons per
    // week, trying to put her first lesson on Monday at 8am is no different than trying to put
    // her second lesson on Monday at 8am. See the Algorithm X Playground for more details, 
    // specifically Mrs. Knuth - Part III.
    remember(item) {
        const currentLevel = this.history[this.history.length - 1];
        if (currentLevel.has(item))
            this.solutionIsValid = false;
        else
            currentLevel.add(item);
    }

    // In some cases it may be beneficial to have Algorithm X try covering certain requirements
    // before others as it looks for paths through the matrix. The default is to sort the requirements
    // by how many actions cover each requirement, but in some cases there might be several 
    // requirements covered by the same number of actions. By overriding this method, the
    // Algorithm X Solver can be directed to break ties a certain way or consider another way
    // of prioritizing the requirements.
    requirementSortCriteria(colHeader) {
        return colHeader.size;
    }

    // The following method can be overridden by a subclass to add logic to perform more detailed solution
    // checking if invalid paths are possible through the matrix. Some problems have requirements that
    // cannot be captured in the basic requirements. For instance, a solution might only be valid if it 
    // fits certain parameters that can only be checked at intermediate steps. In a case like that, this 
    // method can be overridden to add the functionality necessary to check the solution.
    //
    // If the subclass logic results in an invalid solution, the 'solutionIsValid' attribute should be set
    // to false instructing Algorithm X to stop progressing down this path in the matrix.
    processRowSelection(action) { }

    // This method can be overridden by a subclass to add logic to perform more detailed solution
    // checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
    // processRowSelection() method above to "undo" what was done above.
    processRowDeselection(action) { }

    // This method MUST be overridden to process a solution when it is found. If many possible solutions exist,
    // this method can be overridden to instruct Algorithm X to do something every time a solution is found.
    // For instance, Algorithm X might be looking for the best solution or maybe each solution must be
    // validated in some way. In either case, the solutionIsValid attribute can be set to false
    // if the current solution should not be considered valid and should not be generated.
    processSolution() { }

    // ------------------------------------------------------------------
    // Debug print helpers
    // ------------------------------------------------------------------
    printRequirements(n = Number.MAX_SAFE_INTEGER) {
        console.error(`Required Requirements (${this.requirements.length}):`);
        let count = 0;
        for (const r of this.requirements) {
            if (count++ >= n) break;
            console.error(`    ${r.key}`);
        }
        console.error();
    }

    printOptionalRequirements(n = Number.MAX_SAFE_INTEGER) {
        console.error(`Optional Requirements (${this.optionalRequirements.length}):`);
        let count = 0;
        for (const r of this.optionalRequirements) {
            if (count++ >= n) break;
            console.error(`    ${r.key}`);
        }
        console.error();
    }

    printMERequirements(n = Number.MAX_SAFE_INTEGER) {
        console.error(`ME Requirements (${this.meRequirements.length}):`);
        let count = 0;
        for (const r of this.meRequirements) {
            if (count++ >= n) break;
            console.error(`    ${r.key}`);
        }
        console.error();
    }

    printActions(n = Number.MAX_SAFE_INTEGER, includeCoveredRequirements = false) {
        console.error(`Actions (${this.actions.length}):`);
        let count = 0;
        for (const a of this.actions) {
            if (count++ >= n) break;
            console.error(`    ${a.key}`);

            if (includeCoveredRequirements && a.coveredRequirements.length > 0) {
                for (const r of a.coveredRequirements)
                    console.error(`        ${r.key}`);
            }
        }
        console.error();
    }
}
```

<BR>