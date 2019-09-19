# Introduction

We love talking about "fatigue" in the JavaScript community. You know what I've
been getting a bit fatigued by lately? This:

<img class='image' src='https://anderspitman.net/public/github_security_warning.png'></img>

I've been thinking a lot about dependencies recently. This is a bit of a brain
dump.

I'll start by giving my working definition of what a dependency is, then I'll
go through a list of things we might not typically think of as dependencies,
but maybe should. Finally, I'll present a simple model I've started using for
classifying dependencies.

# What is a dependency?

A dependency is any part of a system required to provide a specific experience.

Okay, so what is an "experience"? This is a bit harder to pin down. You can
think of it as accomplishing a specific job (spreadsheets), or providing a fun
simulation (game), or calculating a result (algorithm). The more time users
spend with a piece of software, the more they get used to a specific
experience. In general, we want to avoid changing an experience unless we have
a very good reason to do so. The central thesis of this article is that
dependencies create openings for the experiences we develop to change without
our consciously wanting them to, and so we should be thoughtful and careful
about the dependencies we take on.

It's important to consider that there is a "spectrum of externality" of
dependencies. On one end is internal dependencies, on the other is external.
The more internal a dependency is, the more control your team has over it.
Here are a few examples, in increasing externality:

1. Code that exists in the same module as the experience you're developing. You
   have maximum control over this code.

2. Company code that the current module calls is slightly more external, but
   still likely under your direct control, or that of your team.

3. Non-company open source code is much more external than any internal code.
   There is a high risk of such dependencies changing your experiences
   unintentionally, but the fact that you can modify the source gives you an
   escape hatch if you need it.

4. Non-company closed-source code is maximally external. As such it brings the
   highest risk when adding it to your project.


# Examples of Dependencies

Here's a list of common dependencies. You may never have thought of some of
them in this light before.

## Hardware

The hardware your software runs on is a dependency. A big one. First of all
it's almost certainly 100% external; you have little to no control over it.
However, hardware platforms also tend to be quite reliable and unlikely to
change your software experience unexpectedly. And more importantly, you can't
avoid hardware dependencies so there's no point fretting about it.

## Operating systems

## Web Browsers

As developers we often complain about browser compatibility with newer
JavaScript features. However, that same plodding adoption of new features also
gives us very stable platforms to work with. Our current browsers will gladly
run JS from 10 years ago, and I expect the JS we're writing today to still work
10 years from now. That's impressive.

## Programming Language Compilers/Runtimes

## Web Links

Links are a central component of the web. However, they also make any given
web "experience" incredibly brittle. Any web page you make is dependent on
every link on that page. If you link to an external page, and that page
disappears (which happens all the time), your experience is now broken. This is
why StackOverflow requests that submitters include an original quote from any
linked pages. As always, there are tradeoffs here. A web page with no links
isn't much of a web page, but relying too heavily on them can be a problem
too.

## Frameworks/Libraries

These ones are obvious. They're what we usually think of as dependencies.

## Datasets


# A Mental Model for Categorizing Dependencies

As I was thinking about this, I realized there are several distinct categories
of dependencies. This is how I think of them:

1. Platform Dependencies
2. Data Dependencies
3. Logic Dependencies

## Platform Dependencies

Platform dependencies are the most fundamental type. These include hardware,
operating systems, and programming language compilers/runtimes. Pretty much
every software project is going to have platform dependencies. This is the
level where you're almost certainly wasting your time trying to build it
yourself (which doesn't mean that's never the right choice).

## Data Dependencies

Data dependencies include things like public datasets, well-known lookup tables
(ie [CORDIC](https://en.wikipedia.org/wiki/CORDIC)), algorithms, etc. When
re-writing [my personal website](https://anderspitman.net) recently, I tried to
avoid dependencies as much as possible. The site does have 2 though: a
markdown-to-html converter and a syntax highlighter. The syntax highlighter is
a great example of a data dependency. The core logic is unlikely to change from
language to language, and might be something I would consider writing myself.
However, it's not worth my time duplicating the effort already put into
creating grammars for all the supported languages.

## Logic Dependencies

Logic dependencies are the least desirable type. These include basically any
unit of functionality which you could simply write yourself and avoid the
dependency. However, there's a tradeoff here. The more complicated the job
being done by the dependency, the more you should consider whether it's worth
doing it yourself. My rule of thumb is to spend a bit of time trying to
implement it myself. Maybe an hour or two. Maybe a day or two. Sometimes I
give up and decide to take on a dependency. Sometimes I realize I only need a
tiny piece of the functionality and implementing it myself is the right answer.
Either way, I learn a lot and can make a faster decision the next time.
Client-side routing is one thing I recently realized it simpler than I thought
(for the features I need, at least) and don't always need a library for.


# Conclusion
