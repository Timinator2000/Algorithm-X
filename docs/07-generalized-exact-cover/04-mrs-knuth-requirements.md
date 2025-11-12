# Puzzle Overview - Mrs. Knuth is Back!

How about the good news first? Most of the input and all of the output has not changed for Mrs. Knuth – Part II. Let’s see what changes she has requested…

__Puzzle:__ [Mrs. Knuth – Part II](https://www.codingame.com/training/medium/mrs--knuth---part-ii)

>Mrs. Knuth's schedule needs to be more flexible than she first thought. She isn't able to always teach the same number of hours on her teaching days. She also doesn't always have enough students to completely fill her `teacherAvailability`. You'll need to adjust your algorithm to handle her `teacherAvailability` possibly containing different numbers of hours for each day she teaches and you'll need to be able to handle hours in her `teacherAvailability` for which there ends up being no student scheduled.

Mrs. Knuth might have more hours of availability than students. In Part I, it was __required__ that each slot in Mrs. Knuth’s availability get filled. It appears now that some slots might not get filled. Of course, she cannot teach two students at the same time, so if a slot is filled, it can only be filled with one student. Hmmm….sounds like an optional requirement.

>You might be impressed with Mrs. Knuth's newfound flexibility, but don't get too relaxed. She still requires that no instrument be taught more than one hour on any one day.

It is important to note that Mrs. Knuth might not teach the same number of hours on each day and because of that, it is not guaranteed that she will teach all the same instruments on each day. Still, we must make sure she does not teach a single instrument more than one time per day, but it is also possible certain instruments will not be taught on certain days.

>On top of that, she has struggled with `loudInstrument`s, specifically the __Trumpet__, the __Drums__ and the __Trombone__. In the interest of her long-term hearing, she has asked that you make sure no two `loudInstrument`s are ever scheduled back-to-back. (A lesson at 11am and a lesson at 1pm are not considered back-to-back since there is an hour lunch break between the two.)

No two loud instruments are ever to be scheduled back-to-back, meaning, if a trumpet is scheduled on Friday at 10, we must not schedule a trombone on Friday at 11. Definitely sounds like mutual exclusivity, doesn’t it?

>For the most part, the kids in school are good kids, but some kids get a bit rowdy when they are with certain friends. To avoid disruptions to her schedule, Mrs. Knuth has given you a list of `troublesomePair`s. It's important the individuals in these pairs never be scheduled back-to-back. There must be at least an hour of time between the two individuals to ensure they don't get each other wound up and start causing trouble.

Here we see another classic example of mutual exclusivity. If Emma and Anna are a troublesome pair, we need to make sure they are not scheduled back-to-back.

>Despite Mrs. Knuth's wacky requests, all students must get a spot on her schedule.

It definitely seems like each student being scheduled remains a requirement.

---

# Example Test Case

Let's take a look at the example test case:

```text
M Tu W Th F 8 9 10 11 1
3
Drew Trombone M Tu W Th F 10 11 1
Ella Flute M Tu W Th F 10 1
Lola Drums M Tu W Th F 11 1
1
Drew Ella
```

Mrs. Knuth is available on Fridays at 8, 9, 10, 11 and 1. Three students need to be scheduled. Drew (trombone) is available on Friday at 10, 11 and 1, Ella (flute) is available on Friday at 10 and 1, and Lola (drums) is available on Friday at 11 and 1. We know all students __must__ be scheduled, so these are standard, must-be-covered-exactly-one-time requirements.

```
Requirements:
    ('student scheduled', 'Drew')
    ('student scheduled', 'Ella')
    ('student scheduled', 'Lola')
```

What about filling the teacher availability slots? We already know some slots might remain empty and we know that is definitely the case here since there are 3 students and 5 teacher slots. Even though slots don’t need to be filled, any slot that is filled can only be filled once. This perfectly fits the definition of an optional requirement.

```
Optional Requirements:
    ('slot filled', 'F', 8)
    ('slot filled', 'F', 9)
    ('slot filled', 'F', 10)
    ('slot filled', 'F', 11)
    ('slot filled', 'F', 1)
```

You may have noticed that none of the students are available on Friday before 10, so you could reduce the problem space and eliminate the top two optional requirements. However, I don’t recommend doing that currently. I’ll talk about problem space reduction later in the playground. For now, stick to the process as there is a more-than-reasonable chance that later test cases will be more complex and might not be conducive to the same reductions.

Let’s think ahead a bit about the `instrument on day` requirements. In this simple example, there are three instruments and there is only one day, but we know from the problem statement that Mrs. Knuth might not teach the same number of hours on every day. During any one day of teaching, an instrument might not be taught or it might be taught one time. It cannot be taught more than one time on the same day. We will add these requirements to our list of optional requirements.

```
Optional Requirements:
    ('slot filled', 'F', 8)
    ('slot filled', 'F', 9)
    ('slot filled', 'F', 10)
    ('slot filled', 'F', 11)
    ('slot filled', 'F', 1)
    ('instrument on day', 'F', 'Trombone')
    ('instrument on day', 'F', 'Drums')
    ('instrument on day', 'F', 'Flute')
```

---

# Troublesome Pairs

What about Drew and Ella being a troublesome pair? We need to look at the availability of Drew and and the availability of Ella and identify where we could have a situation we need to avoid. Based on their availability, the only way we could create a problem is by scheduling Ella on Friday at 10 and Drew on Friday at 11. We need to create an optional requirement that can make sure this never happens. It is important this new requirement have two components, similar to the `(A, C)` used in the previous mutual exclusivity example. We will use a tuple of two tuples. One of the tuples applies to Ella and the other applies to Drew.

```text
Optional Requirements to Handle Mutual Exclusivity of Troublesome Pairs:
    (('Ella', 'F', 10), ('Drew', 'F', 11))
```

---

# Loud Instruments

The last detail we need to handle is making sure no two loud instruments are scheduled back-to-back. Because this is a very simple test case, it will be tempting to look at the students and see where two loud instruments might conflict, like what we did above with Ella and Drew. Do your best to avoid that temptation! As the test cases get harder, this will be more challenging and it just is not necessary. Instead, only focus on Mrs. Knuth’s availability and add an optional requirement for every pair of back-to-back time slots:

```text
Optional Requirements to Handle Mutual Exclusivity of Back-to-Back Loud Instruments:
    (('loud instrument', 'F', 8), ('loud instrument', 'F', 9))
    (('loud instrument', 'F', 9), ('loud instrument', 'F', 10))
    (('loud instrument', 'F', 10), ('loud instrument', 'F', 11))
```

The first requirement states, I can put a loud instrument in the Friday at 8 timeslot __or__ I can put a loud instrument in the Friday at 9 timeslot, but I cannot do both. I can't do both because actions in our scheduling domain all involve placing one student with that student's instrument on some day at some time. Since the requirement may only be covered once, either the first action could happen or the second action could happen, not both.

---

# The Full List of Requirements

Putting all the requirements in one place results in the following:

```text
Requirements:
    ('student scheduled', 'Drew')
    ('student scheduled', 'Ella')
    ('student scheduled', 'Lola')

Optional Requirements:
    ('slot filled', 'F', 8)
    ('slot filled', 'F', 9)
    ('slot filled', 'F', 10)
    ('slot filled', 'F', 11)
    ('slot filled', 'F', 1)
    ('instrument on day', 'F', 'Trombone')
    ('instrument on day', 'F', 'Drums')
    ('instrument on day', 'F', 'Flute')
    (('Ella', 'F', 10), ('Drew', 'F', 11))
    (('loud instrument', 'F', 8), ('loud instrument', 'F', 9))
    (('loud instrument', 'F', 9), ('loud instrument', 'F', 10))
    (('loud instrument', 'F', 10), ('loud instrument', 'F', 11))
```

That is a bunch more requirements than we needed to model Mrs. Knuth - Part I. There is a lot more going on now with more slots than students and the mutual exclusivity that affects troublesome pairs and back-to-back loud instruments. Each of the 3 requirements __must__ be covered exactly once. The 12 optional requirements __may or may not__ be covered, but if they are, they can only be covered one time.

Before we finish our model for Mrs. Knuth - Part II, let's see if we can quantify, just a bit, how much more power is given to Algorithm X by identifying these optional requirements.

<BR>