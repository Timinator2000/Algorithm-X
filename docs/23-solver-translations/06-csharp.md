# C\#

The following C# translation of `AlgorithmXSolver` is derived from the C++ version, which serves as the recommended reference for its structure, algorithms, and overall design.

Detailed explanations have been omitted, as they align closely with the discussion in the [C++ version](../23-solver-translations/05-cpp.md).

---

# Note

- `Action` has been changed to `AlgoXAction` to avoid any potential confusion with `System.Action`.

---

# Problem-Specific Requirements

```csharp
sealed class CellCovered : Requirement
{
    public int row, col;

    public static string MakeKey(int row, int col)
        => $"cell covered {row} {col}";

    public CellCovered(int row, int col)
        : base(MakeKey(row, col))
    {
        this.row = row;
        this.col = col;
    }
}

sealed class ValInRow : Requirement
{
    public int row;
    public char val;

    public static string MakeKey(int row, char val)
        => $"val in row {row} {val}";

    public ValInRow(int row, char val)
        : base(MakeKey(row, val))
    {
        this.row = row;
        this.val = val;
    }
}

sealed class ValInCol : Requirement
{
    public int col;
    public char val;

    public static string Makekey(int col, char val)
        => $"val in col {col} {val}";

    public ValInCol(int col, char val)
        : base(Makekey(col, val))
    {
        this.col = col;
        this.val = val;
    }
}

sealed class ValInBox : Requirement
{
    public int box;
    public char val;

    public static string MakeKey(int box, char val)
        => $"val in box {box} {val}";

    public ValInBox(int box, char val)
        : base(MakeKey(box, val))
    {
        this.box = box;
        this.val = val;
    }
}
```

---

# Problem-Specific Actions

```csharp
sealed class PlaceValue : AlgoXAction
{
    public int row, col;
    public char val;

    public static string MakeKey(int row, int col, char val)
        => $"place value {row} {col} {val}";

    public PlaceValue(int row, int col, char val)
        : base(MakeKey(row, col, val))
    {
        this.row = row;
        this.col = col;
        this.val = val;
    }
}
```

---

# Example - 9x9 Sudoku

```csharp
class SudokuSolver : AlgorithmXSolver
{
    List<char[]> grid;

    public SudokuSolver(List<char[]> grid, string values)
    {
        // Build the requirements - for instance:

        // The cell at (0, 0) must be covered:
        AddRequirement(new CellCovered(0, 0));

        // There must be a '3' in the first row, the first col and the first box:
        AddRequirement(new ValInRow(0, '3'));
        AddRequirement(new ValInCol(0, '3'));
        AddRequirement(new ValInBox(0, '3'));

        // Build the actions and attach the covered requirements.

        // Consider the single action of putting a '6' at location (2, 2):
        var action = AddAction(new PlaceValue(2, 2, '6'));

        AttachRequirement(action, CellCovered.KakeKey(2, 2));
        AttachRequirement(action, ValInRow.KakeKey(2, '6'));
        AttachRequirement(action, ValInCol.KakeKey(2, '6'));
        AttachRequirement(action, ValInBox.KakeKey(0, '6'));
    }


    protected override void ProcessSolution()
    {
        foreach (var action in Solution.Cast<PlaceValue>())
        {
            // Use the attributes of the action to build the solution:
            //      action.row
            //      action.col
            //      action.val
        }
    }

};

static class Solution
{
    static void Main()
    {
        // read input

        var solver = new SudokuSolver(grid, ALL_VALUES);
        solver.Solve();

        foreach (var row in grid)
            Console.WriteLine(new string(row));
    }
}
```

---

# Mutual Exclusivity

MERequirement Definition:

```csharp
sealed class LoudInstrument : MERequirement
{
    public static string MakeKey(string day, int hour) 
        => $"loud instrument {day} {hour}";

    public LoudInstrument(string day, int hour_1, int hour_2)
        : base(MakeKey(day, hour_1), MakeKey(day, hour_2))
    {}
}
```

Registration:

```csharp
    AddMERequirement(new LoudInstrument("F", 8, 9));
    AddMERequirement(new LoudInstrument("F", 9, 10));
    AddMERequirement(new LoudInstrument("F", 10, 11));
```

Usage:

```csharp
    if (Constants.LOUD_INSTRUMENTS.Contains(student.Instrument))
        AttachMERequirements(action, LoudInstrument.MakeKey("F", 8));
```

---

# Multiplicity

Add `ToRemember`:

```csharp
sealed class PlaceStudent : AlgoXAction
{
    // ( ... other attributes ... )
    public string ToRemember { get; }

    public static string MakeKey()
        => /* unique string key for the action */;

    public PlaceStudent()
        : base(MakeKey())
        // initialize other attributes ...
    {
        // Build a string that identifies what should be remembered about this action.
        ToRemember = $"{student.Name} {day} {hour}";
    }
};
```

Override `ProcessRowSelection`:

```csharp
    protected override void ProcessRowSelection(AlgoXAction action)
    {
        var psAction = (PlaceStudent)action;
        Remember(psAction.ToRemember);
    }
```

---

# Debug Print Helpers

- `PrintRequirements(int n = int.MaxValue)`
- `PrintOptionalRequirements(int n = int.MaxValue)`
- `PrintMERequirements(int n = int.MaxValue)`
- `PrintActions(int n = int.MaxValue, bool includeCoveredRequirements = false)`

---

# The Solver Code

```csharp
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

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

// -------------------------------------------------------------
//
//  DLXCell is one cell in the Algorithm X matrix. This implementation was mostly
//  copied from @RoboStac's solution to Constrained Latin Squares on www.codingame.com.
//
//  https://www.codingame.com/training/medium/constrained-latin-squares
//
// -------------------------------------------------------------
class DLXCell
{
    public DLXCell prev_x, next_x;
    public DLXCell prev_y, next_y;

    public DLXCell col_header;
    public DLXCell row_header;

    public Requirement requirement;       // column headers only
    public AlgoXAction action;            // row headers only

    // Size quickly identifies how many rows are in any particular column.
    public int size = 0;

    public DLXCell()
    {
        prev_x = next_x = this;
        prev_y = next_y = this;
    }

    public void remove_x()
    {
        prev_x.next_x = next_x;
        next_x.prev_x = prev_x;
    }

    public void restore_x()
    {
        prev_x.next_x = this;
        next_x.prev_x = this;
    }

    public void remove_y()
    {
        prev_y.next_y = next_y;
        next_y.prev_y = prev_y;
    }

    public void restore_y()
    {
        prev_y.next_y = this;
        next_y.prev_y = this;
    }

    public void attach_horiz(DLXCell other)
    {
        DLXCell left = prev_x;
        other.prev_x = left;
        left.next_x = other;
        other.next_x = this;
        prev_x = other;
    }

    public void attach_vert(DLXCell other)
    {
        DLXCell up = prev_y;
        other.prev_y = up;
        up.next_y = other;
        other.next_y = this;
        prev_y = other;
    }

    public void remove_column()
    {
        remove_x();
        for (DLXCell r = next_y; r != this; r = r.next_y)
            r.remove_row();
    }

    public void restore_column()
    {
        for (DLXCell r = prev_y; r != this; r = r.prev_y)
            r.restore_row();
        restore_x();
    }

    public void remove_row()
    {
        for (DLXCell n = next_x; n != this; n = n.next_x)
        {
            n.col_header.size--;
            n.remove_y();
        }
    }

    public void restore_row()
    {
        for (DLXCell n = prev_x; n != this; n = n.prev_x)
        {
            n.col_header.size++;
            n.restore_y();
        }
    }

    public void select()
    {
        for (DLXCell n = this; ; n = n.next_x)
        {
            n.remove_y();
            n.col_header.remove_column();
            if (n.next_x == this) break;
        }
    }

    public void unselect()
    {
        for (DLXCell n = prev_x; ; n = n.prev_x)
        {
            n.col_header.restore_column();
            n.restore_y();
            if (n == this) break;
        }
    }
}

// -------------------------------------------------------------
// Requirement & MERequirement Base Classes
// -------------------------------------------------------------
class Requirement
{
    public string Key { get; }
    public bool IsOptional { get; set; } = false;

    public Requirement(string k)
    {
        Key = k;
    }
}

class MERequirement : Requirement
{
    public string a, b;

    public static string MakeMEKey(string x, string y)
    {
        return (x.CompareTo(y) < 0)
            ? x + " -me- " + y
            : y + " -me- " + x;
    }

    public MERequirement(string aa, string bb)
        : base(MakeMEKey(aa, bb))
    {
        if (aa.CompareTo(bb) < 0)
        {
            a = aa;
            b = bb;
        }
        else
        {
            a = bb;
            b = aa;
        }
        IsOptional = true;
    }
}

// -------------------------------------------------------------
// Action Base Class
// -------------------------------------------------------------
class AlgoXAction
{
    public string Key { get; }
    public List<Requirement> CoveredRequirements = new();

    public AlgoXAction(string k)
    {
        Key = k;
    }
}

// -------------------------------------------------------------
// AlgorithmXSolver Base Class with DLX engine
// -------------------------------------------------------------
class AlgorithmXSolver
{
    protected Stopwatch ConstructTime { get; } = Stopwatch.StartNew();

    // Requirement/Action containers
    protected List<Requirement> Requirements { get; } = new();
    protected List<Requirement> OptionalRequirements { get; } = new();
    protected List<MERequirement> MERequirements { get; } = new();
    protected List<AlgoXAction> AlgoXActions { get; } = new();

    // Lookup tables
    protected Dictionary<string, Requirement> RequirementsLookup { get; } = new();
    protected Dictionary<string, MERequirement> MELookup { get; } = new();
    protected Dictionary<string, List<MERequirement>> MELists { get; } = new();

    // DLX structures
    protected DLXCell MatrixRoot { get; } = new();
    protected Dictionary<string, DLXCell> ColHeaders { get; } = new();
    protected Dictionary<string, DLXCell> RowHeaders { get; } = new();
    protected List<DLXCell> DLXCells { get; } = new();

    // Current solution
    protected List<AlgoXAction> Solution { get; } = new();

    // When StopSearch is true, the search method knows a solution has been found and
    // the depth-first search is quickly unwound and the search method is exited.
    protected bool StopSearch { get; set; } = false;

    // For the basic Algorithm X Solver, all solutions are always valid. However, a subclass
    // can add functionality to check solutions as they are being built to steer away from
    // invalid solutions. The basic Algorithm X Solver never modifies this attribute.
    protected bool SolutionIsValid { get; set; } = true;

    // A history can be added to a subclass to allow Algorithm X to handle "multiplicity".
    // In the basic Solver, nothing is ever put into the history. A subclass can override
    // the ProcessRowSelection() method to add history in cases of multiplicity. 
    protected List<HashSet<string>> History { get; } = new() { new HashSet<string>() };

    public long SolutionCount { get; protected set; } = 0;

    // ------------------------------------------------------------------
    // Requirement/Action helpers
    // ------------------------------------------------------------------
    public void AddRequirement(Requirement requirement)
    {
        RequirementsLookup[requirement.Key] = requirement;
        Requirements.Add(requirement);
    }

    public void AddOptionalRequirement(Requirement requirement)
    {
        RequirementsLookup[requirement.Key] = requirement;
        requirement.IsOptional = true;
        OptionalRequirements.Add(requirement);
    }

    public void AddMERequirement(MERequirement meRequirement)
    {
        string key = meRequirement.Key;

        // Check for duplicate MERequirement
        if (MELookup.ContainsKey(key))
            return;

        MERequirements.Add(meRequirement);
        MELookup[key] = meRequirement;

        if (!MELists.ContainsKey(meRequirement.a))
            MELists[meRequirement.a] = new List<MERequirement>();
        if (!MELists.ContainsKey(meRequirement.b))
            MELists[meRequirement.b] = new List<MERequirement>();

        MELists[meRequirement.a].Add(meRequirement);
        MELists[meRequirement.b].Add(meRequirement);
    }

    public AlgoXAction AddAction(AlgoXAction action)
    {
        AlgoXActions.Add(action);
        return action;
    }

    public void AttachRequirement(AlgoXAction action, string key)
    {
        if (!RequirementsLookup.TryGetValue(key, out var requirement))
            throw new Exception("Requirement not found: " + key);

        action.CoveredRequirements.Add(requirement);
    }

    public void AttachMERequirements(AlgoXAction action, string key)
    {
        if (MELists.TryGetValue(key, out var list))
        {
            foreach (var me in list)
                action.CoveredRequirements.Add(me);
        }
    }

    // ------------------------------------------------------------------
    //  DLX matrix builder (called automatically in solve)
    // ------------------------------------------------------------------
    protected void BuildMatrix()
    {
        if (ColHeaders.Count != 0)
            throw new Exception("BuildMatrix called twice");

        // Merge all requirements into one list: required → optional → me.
        // Required requirements must precede optional requirements in header order.
        // Search stops scanning columns when first optional requirement is encountered.
        var allRequirements = new List<Requirement>();
        allRequirements.AddRange(Requirements);
        allRequirements.AddRange(OptionalRequirements);
        allRequirements.AddRange(MERequirements);

        // Create column headers
        foreach (var r in allRequirements)
        {
            var node = new DLXCell();
            node.requirement = r;
            ColHeaders[r.Key] = node;
        }

        // Horizontally link columns to root
        MatrixRoot.size = int.MaxValue;
        foreach (var r in allRequirements)
            MatrixRoot.attach_horiz(ColHeaders[r.Key]);

        // Create a row in the matrix for every action.
        foreach (var action in AlgoXActions)
        {
            var rowNode = new DLXCell();
            rowNode.action = action;
            RowHeaders[action.Key] = rowNode;

            DLXCell prev = null;
            foreach (var r in action.CoveredRequirements)
            {
                var col = ColHeaders[r.Key];
                var cell = new DLXCell
                {
                    col_header = col,
                    row_header = rowNode
                };

                col.attach_vert(cell);
                col.size++;

                if (prev != null)
                    prev.attach_horiz(cell);

                prev = cell;
                DLXCells.Add(cell);
            }
        }
    }

    public void Solve(bool findAllSolutions = false, bool showTiming = false)
    {
        if (showTiming)
            Console.Error.WriteLine("[Timing] Build Requirements & Actions: " +
                ConstructTime.ElapsedMilliseconds + " ms");

        var sw = Stopwatch.StartNew();
        BuildMatrix();
        if (showTiming)
            Console.Error.WriteLine("[Timing] DLX Matrix Build: " +
                sw.ElapsedMilliseconds + " ms");

        sw.Restart();
        Search(findAllSolutions);
        if (showTiming)
            Console.Error.WriteLine("[Timing] Search: " +
                sw.ElapsedMilliseconds + " ms\n");
    }

    protected void Search(bool findAllSolutions)
    {
        if (StopSearch) return;

        // Algorithm X: Choose a Column
        //
        // Choose the column (requirement) with the best value for "sort criteria". For
        // the basic implementation of sort criteria, Algorithm X always chooses the column
        // covered by the fewest number of actions. Optional requirements are not eligible 
        // for this step.
        DLXCell bestCol = MatrixRoot;
        int bestValue = int.MaxValue;

        for (DLXCell node = MatrixRoot.next_x; node != MatrixRoot; node = node.next_x)
        {
            // Optional requirements stop the search for the best column.
            if (node.requirement.IsOptional)
                break;

            // Get the sort criteria for this requirement (column).
            int v = RequirementSortCriteria(node);
            if (v < bestValue)
            {
                bestValue = v;
                bestCol = node;
            }
        }

        if (bestCol == MatrixRoot)
        {
            ProcessSolution();
            if (SolutionIsValid)
            {
                SolutionCount++;
                if (!findAllSolutions)
                    StopSearch = true;
            }
            return;
        }

        // Algorithm X: Choose a Row
        //
        // The next step is to loop through all possible actions. To prepare for this,
        // a new level of history is created. The history for this new level starts out
        // as a complete copy of the most recent history.
        History.Add(new HashSet<string>(History[^1]));

        // Loop through all possible actions in the order they were provided when identified.
        for (DLXCell node = bestCol.next_y; node != bestCol; node = node.next_y)
        {
            if (StopSearch) break;

            Select(node);
            if (SolutionIsValid)
                Search(findAllSolutions);
            Deselect(node);

            // All backtracking results in going back to a solution that is valid.
            SolutionIsValid = true;
        }

        History.RemoveAt(History.Count - 1);
    }

    // Algorithm X: Shrink Matrix Due to Row Selection
    //
    // The select method updates the matrix when a row is selected as part of a solution.
    // Other rows that satisfy overlapping requirements need to be deleted and in the end,
    // all columns satisfied by the selected row get removed from the matrix.
    protected void Select(DLXCell node)
    {
        node.select();
        Solution.Add(node.row_header.action);
        ProcessRowSelection(node.row_header.action);
    }

    // Algorithm X: Rebuild Matrix Due to Row Deselection
    //
    // The Select() method selects a row as part of the solution being explored. Eventually that
    // exploration ends and it is time to move on to the next row (action). Before moving on,
    // the matrix and the partial solution need to be restored to their prior states.
    protected void Deselect(DLXCell node)
    {
        node.unselect();
        Solution.RemoveAt(Solution.Count - 1);
        ProcessRowDeselection(node.row_header.action);
    }

    // In cases of multiplicity, this method can be used to ask Algorithm X to remember that
    // it has already tried certain things. For instance, if Emma wants two music lessons per
    // week, trying to put her first lesson on Monday at 8am is no different than trying to put
    // her second lesson on Monday at 8am. See the Algorithm X Playground for more details, 
    // specifically Mrs. Knuth - Part III.
    protected void Remember(string itemToRemember)
    {
        var currentLevel = History[^1];
        if (currentLevel.Contains(itemToRemember))
            SolutionIsValid = false;
        else
            currentLevel.Add(itemToRemember);
    }

    // In some cases it may be beneficial to have Algorithm X try covering certain requirements
    // before others as it looks for paths through the matrix. The default is to sort the requirements
    // by how many actions cover each requirement, but in some cases there might be several 
    // requirements covered by the same number of actions. By overriding this method, the
    // Algorithm X Solver can be directed to break ties a certain way or consider another way
    // of prioritizing the requirements.
    protected virtual int RequirementSortCriteria(DLXCell colHeader)
    {
        return colHeader.size;
    }

    // The following method can be overridden by a subclass to add logic to perform more detailed solution
    // checking if invalid paths are possible through the matrix. Some problems have requirements that
    // cannot be captured in the basic requirements. For instance, a solution might only be valid if it 
    // fits certain parameters that can only be checked at intermediate steps. In a case like that, this 
    // method can be overridden to add the functionality necessary to check the solution.
    //
    // If the subclass logic results in an invalid solution, the 'SolutionIsValid' attribute should be set
    // to false instructing Algorithm X to stop progressing down this path in the matrix.
    protected virtual void ProcessRowSelection(AlgoXAction action) { }

    // This method can be overridden by a subclass to add logic to perform more detailed solution
    // checking if invalid paths are possible through the matrix. This method goes hand-in-hand with the
    // ProcessRowSelection() method above to "undo" what was done above.
    protected virtual void ProcessRowDeselection(AlgoXAction action) { }

    // This method MUST be overridden to process a solution when it is found. If many possible solutions exist,
    // this method can be overridden to instruct Algorithm X to do something every time a solution is found.
    // For instance, Algorithm X might be looking for the best solution or maybe each solution must be
    // validated in some way. In either case, the SolutionIsValid attribute can be set to false
    // if the current solution should not be considered valid and should not be generated.
    protected virtual void ProcessSolution() { }

    // ------------------------------------------------------------------
    // Debug printing helpers
    // ------------------------------------------------------------------
    public void PrintRequirements(int n = int.MaxValue)
    {
        Console.Error.WriteLine($"Required Requirements ({Requirements.Count}):");
        int count = 0;
        foreach (var r in Requirements)
        {
            if (count++ >= n) break;
            Console.Error.WriteLine($"    {r.Key}");
        }
        Console.Error.WriteLine();
    }

    public void PrintOptionalRequirements(int n = int.MaxValue)
    {
        Console.Error.WriteLine($"Optional Requirements ({OptionalRequirements.Count}):");
        int count = 0;
        foreach (var r in OptionalRequirements)
        {
            if (count++ >= n) break;
            Console.Error.WriteLine($"    {r.Key}");
        }
        Console.Error.WriteLine();
    }

    public void PrintMERequirements(int n = int.MaxValue)
    {
        Console.Error.WriteLine($"ME Requirements ({MERequirements.Count}):");
        int count = 0;
        foreach (var r in MERequirements)
        {
            if (count++ >= n) break;
            Console.Error.WriteLine($"    {r.Key}");
        }
        Console.Error.WriteLine();
    }

    public void PrintActions(int n = int.MaxValue, bool includeCoveredRequirements = false)
    {
        Console.Error.WriteLine($"Actions ({AlgoXActions.Count}):");
        int count = 0;
        foreach (var a in AlgoXActions)
        {
            if (count++ >= n) break;
            Console.Error.WriteLine($"    {a.Key}");

            if (includeCoveredRequirements && a.CoveredRequirements.Count > 0)
            {
                foreach (var r in a.CoveredRequirements)
                {
                    Console.Error.WriteLine($"        {r.Key}");
                }
            }
        }
        Console.Error.WriteLine();
    }
}
```

<BR>