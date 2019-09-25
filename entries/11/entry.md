# Introduction

We love talking about "fatigue" in the JavaScript community. You know what I've
been getting a bit fatigued by lately? This:

<img class='image' src='https://anderspitman.net/public/github_security_warning.png'></img>

I've been thinking a lot about dependencies. This is a bit of a brain dump.

I'll start by giving my working definition of what a dependency is, then I'll
go through a list of common dependencies. Finally, I'll present a simple model
I've started using for classifying dependencies.

# What is a dependency?

For the purposes of this article, I will define a dependency as
**any component of an experience which is outside your direct control
as the developer of that experience.**

Note that this definition doesn't say anything about software. Software
experiences (ie apps, websites, games, etc) are only one type. Driving your
car down the road, listening to a concert, or playing football 
are all experiences, and all have dependencies. Ever tried to play football
without a ball? Whoever invented the rules of football was free to
design the experience however they wanted, but ultimately the experience always
depends on some sort of a ball being available at "runtime".

For the remainder of this article, I'm going to focus on dependencies of
software experiences.

The more time users spend with a piece of software, the more they get used to a
specific experience. In general, we want to avoid changing an experience unless
we have a very good reason to do so (ie adding a feature that we are confident
will significantly improve the experience).

**The central thesis of this article is that
dependencies create openings for the experiences we develop to change without
our deliberately wanting them to, and so we should be thoughtful and careful
about the dependencies we take on.**

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

Here's a list of common dependencies.

## Hardware

The hardware your software runs on is a dependency. A big one. First of all
it's almost certainly 100% external; you have little to no control over it.
However, hardware platforms also tend to be quite reliable and unlikely to
change your software experience unexpectedly, or if it does change, it's likely
to be in a good way (ie running faster). And more importantly, you can't
avoid hardware dependencies so there's no point fretting about it.

## Operating systems

If your app is too tightly coupled to a specific version of an operating
system, when the user updates their computer your app might quit working. This
is a much bigger problem on systems like Linux, which isn't used much for
end-user apps anyway. From what I've heard, Windows has an excellent
backwards-compatibility history. Mobile OSes seem to be somewhere in the
middle.

## Programming Language Compilers/Runtimes

The functionality, performance, and distribution of your app are deeply tied to
your choice of programming language. A statically compiled binary is easy to
deploy and likely to work for a very long time on a given operating system, but
could be subject to security vulnerabilities. On the flip side, if you make a
Python app that depends on specific libraries to work, your app could work for
a certain user one day, then be broken after a system update changes a library
version in one of Python's library directories.

If your language's compiler ships a significant performance update, your app
could get much faster overnight. Conversely, if there's a serious regression
or a change to how a certain undefined behavior is handled, your app could
break or (if you're lucky enough to catch it in testing) be forced to stay on
an old compiler version until the problem is resolved.

## Web Browsers

These days, browsers are essentially in the same category as operating systems.
If Chrome, Firefox, or Safari decided one day to make a major change, your app
could instantly break for thousands of users. Fortunately, web browsers
generally have an exceptionally good backwards compatibility story. Our current
browsers will gladly run JS from 10 years ago, and I expect the JS I'm
writing today to still work 10 years from now. That's impressive.

## Web Links

Links are a central component of the web. However, they also make any given
web experience incredibly brittle. Any web page you make is dependent on
every link on that page. If you link to an external page, and that page
disappears (which happens often), your experience is now broken. This is
why StackOverflow requests that submitters include an original quote from any
linked pages. As always, there are tradeoffs here. A web page with no links
isn't much of a web page, but relying too heavily on them can be a problem
too.

You could always link out to the Internet Archive, but then you're centralizing
all your link dependencies. I think the long-term solution to this problem
could be something like IPFS, where websites pin versions of everything they
link to. But that has its own problems, like if you link out to an insecure
version of a web app. This would basically be the web's version of static
linking.

## Frameworks/Libraries

These ones are obvious. They're what I usually think of first when people talk
about dependencies. If you're using a large framework that
does a lot of heavy lifting for you app, you're at the mercy of that framework
(and its likely many dependencies) for your experience to remain consistent.
The less you understand what that framework is doing under the hood, the more
vulnerable you are.

That doesn't mean frameworks are bad. A new developer
with an exciting idea might be able to crank out a prototype using a
framework where they would otherwise get bogged down with platform details.

However, in general I advocate learning the platform over time, not necessarily
to avoid using frameworks, but to reduce the vulnerability that comes from
dependance on them. If your framework just can't do what you need it to
(or as performantly as you need it to), ideally you should be able to throw
it out and implement a bespoke replacement.

## Datasets

If your app/experience relies on a specific dataset, that's a dependencies.
One example would be an interactive data visualization. If you collected and
control the data yourself, this likely isn't a problem. However, if the data
comes from a 3rd source that is constantly changing, you're dependant on that
source, or risk the data becoming stale. Even if the data doesn't change, you
may be dependant on a 3rd party not changing their usage policies.

## APIs

Closely related to datasets is APIs, which are often used to access datasets
such as Twitter. Over time, companies have consistently locked their APIs 
down more and more to prevent 3rd party developers from making alternative
interfaces. This makes sense from a business point of view; you can't show
ads on an app you don't control. If you're going to rely on an API to develop
your app, make sure you understand the business incentives of all parties
involved, and what that likely means for the long-term viability of your app.


# A Mental Model for Categorizing Dependencies

As I was thinking about this, I started breaking dependencies down into several
distinct categories. This is how I think of them:

1. Platform Dependencies
2. Data Dependencies
3. Logic Dependencies

## Platform Dependencies

Platform dependencies are the most fundamental type. These include hardware,
operating systems, web browsers, programming language compilers/runtimes, and
APIs.  Pretty much every software project is going to have platform
dependencies. APIs are unique here because they are much more risky than the
others. You're giving a 3rd party complete control over the functionality of
your app, with a high liklihood of it changing. However, sometimes there is no
choice. If you want to develop a Facebook app, you have to use their API.

Platform dependencies are the level where you're almost certainly wasting your
time trying to build it yourself (which doesn't mean that's never a good
choice).

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

Logic dependencies are the least desirable (and most avoidable) type. Logic
here refers to basic programming logic, ie if/then, loops, etc. These
dependencies include basically any unit of functionality which you could simply
write yourself and avoid the dependency. However, there's a tradeoff here. The
more complicated the job being done by the dependency, the more you should
consider whether it's worth doing it yourself.

My rule of thumb is to spend a bit of time trying to implement it myself. Maybe
an hour or two. Maybe a day or two.  Sometimes I give up and decide to take on
a dependency. Sometimes I realize I only need a tiny piece of the functionality
and implementing it myself is the right answer.  Either way, I learn a lot and
can make a faster decision the next time. Plus if I do take on a dependency, I
likely have a much better idea what it's doing for me after going through this
process.

Client-side routing is one thing I recently realized is simpler
than I thought (for the features I need, at least) and don't always need a
library for.

Something that I doubt I'd ever try to write from scratch is a WYSIWYG HTML
editor. It's a very complex task, and there are already high quality, pluggable
solutions out there.


# Conclusion

Dependencies are a necessary part of developing useful software experiences.
However, there is always a cost associated with taking on a dependency.
Generally, I try to avoid dependencies, and when I do need them,
I try to only use them in places where they could be swapped out for a similar
option. The syntax highlighter mentioned earlier is a great example of this.
Doing this is easier if you make a wrapper that only exposes the features you
need.

I hope I've given you one or two new ideas to consider the next time you're
faced with the choice of whether to take on a dependency.
