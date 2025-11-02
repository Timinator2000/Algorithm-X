# Initial Solution - Basic Algorithm X

1. For every number on the grid, identify all possible island configurations (groups of cells) that cover that number.

2. Identify all pairs of configuration placements for 2 different islands that are mutually exclusive.

| Test Case | actions | `me_requirements` | Solutions Checked | ❌ 2x2 | ❌ Continuous Water | Time (ms) |
|:---------:|:---------:|:-----------------:|:-----------------:|:-------:|:-------------------:|:------:|
| Test 1 | 53 | 334 | 20 | 19 | 19 | 10 |
| Test 2 | 190 | 503 | 183 | 155 | 172 | 45 |
| Test 3 | 185 | 3,291 | 5 | 3 | 4 | 230 |
| Test 4 | 2,047 | 848,621 | ? | ? | ? | Timeout |
| Test 9 | 1,685 | 53,103 | ? | ? | ? | Timeout |
| Test 10 | 5,576 | 1,032,414 | ? | ? | ? | Timeout |
| Test 11 | 1,497 | 59,519 | ? | ? | ? | Timeout |


# Initial Logic

1. For any two diagonally adjacent cells that are both numbers, their 2 shared neibors must be water.

2. Any unknown cell that has NS neighbors or EW neighbors that are both numbers must be water.

3. any unknown cell that has 4 orthogonal water neighbors is also water.

4. All orthogonal neighbors of a 1 msut be water.

| Test Case | actions | `me_requirements` | Solutions Checked | ❌ 2x2 | ❌ Continuous Water | Time (ms) |
|:---------:|:---------:|:-----------------:|:-----------------:|:-------:|:-------------------:|:------:|
| Test 1 | 20 |  20 | 20 | 19 | 19 | 5 |
| Test 2 | 127 | 364 | 183 | 155 | 172 | 50 |
| Test 3 | 139 | 1,177 | 5 | 3 | 2 | 100 |
| Test 4 | 990 | 154,341 | ? | ? | ? | Timeout |
| Test 6 | 780 | 44,028 | ? | ? | ? | Timeout |
| Test 8 | 406 | 2,410 | ? | ? | ? | Timeout |
| Test 9 | 2,820 | 110,041 | ? | ? | ? | Timeout |
| Test 10 | 803 | 8,617 | ? | ? | ? | Timeout |
| Test 11 | 614 | 11,794 | ? | ? | ? | Timeout |


# Continuous Body

Until now, all the problem-space reduction was done *before* each island identified all posssible configurations. Now you can head into your normal problem-space redution look

Normal reduction loop:

* reduce cells

* reduce

* cell group only has 1 matching neighbor and zero unknown neighbors, then add the one matching neighbor to the group.

| Test Case | actions | `me_requirements` | Solutions Checked | ❌ 2x2 | ❌ Continuous Water | Time (ms) |
|:---------:|:---------:|:-----------------:|:-----------------:|:-------:|:-------------------:|:------:|
| Test 1 | 0 |  0 | 0 | 0 | 0 | 3 |
| Test 2 | 109 | 335 | 115 | 92 | 104 | 35 |
| Test 3 | 138 | 1,177 | 5 | 3 | 4 | 95 |
| Test 4 | 659 | 76,063 | ? | ? | ? | Timeout |
| Test 5 | 1,979 | 115,442 | ? | ? | ? | Timeout |
| Test 6 | 350 | 14,303 | ? | ? | ? | Timeout |
| Test 7 | 27 | 25 | 46 | 45 | 44 | 54 |
| Test 8 | 401 | 2,405 | ? | ? | ? | Timeout |
| Test 9 | 2,449 | 71,775 | ? | ? | ? | Timeout |
| Test 10 | 591 | 6,763 | ? | ? | ? | Timeout |
| Test 11 | 501 | 10,073 | ? | ? | ? | Timeout |


# Significant Problem-Space Reduction