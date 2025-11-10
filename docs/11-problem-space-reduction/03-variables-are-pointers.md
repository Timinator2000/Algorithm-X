# Python Variables

Understanding how variables work in Python is a learning experience every Python programmer goes through. With a bare minimal understanding of C and C++ pointers, I was thoroughly confused the first time I created a function in Python with a `list` as an argument. I thought a copy of the `list` would be made and my original `list` would stay intact. Not the case!

Once you understand that all variables in Python are pointers to objects, your Python life becomes much more clear. If this is a new concept to you, do not fear that we might be travelling down a path of C pointers and pointers to pointers, etc. As most things are in Python, it is much easier than you probably expect.

On the website [Python Morsels](https://www.pythonmorsels.com/variables-are-pointers/), Trey Hunner does a great job explaining how variables work in Python.

<BR>

<div class="youtube-video">
  <iframe
    src="https://www.youtube-nocookie.com/embed/g-iNz91YyGw"
    title="YouTube video player"
    allowfullscreen>
  </iframe>
</div>

<BR>

For even more detail, check out this write-up on [LaunchSchool.com](https://launchschool.com/books/python/read/variables_pointers).

---

# Why Is This Important?

In the next section, I will suggest making every cell in your Sudoku grid an object. Each grouping of cells (rows, columns and boxes) then becomes a list of 9 pointers to the cell objects that make up that group. Let's take a closer look.

<BR>