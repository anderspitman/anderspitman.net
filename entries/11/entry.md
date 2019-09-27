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
car down the road, attending a concert, or playing football 
are all experiences, and all have dependencies. Ever tried to play football
without a ball? Whoever invented the rules of football was free to
design the experience however they wanted, but ultimately the experience always
depends on some sort of a ball being available at "runtime".

Note that some dependencies are optional. It's ideal to wear special shoes
when playing football, but it can be done with normal shoes or even barefoot,
with the experience being diminished to varying degrees.

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

# Examples of Dependencies

Here's a list of common dependencies.

## Hardware

The hardware your software runs on is a dependency. In general, you
as a developer have little to no control what hardware your users run your
software on. A user may be perfectly happy running your app on the latest
flagship Android phone, but then they lose their phone and have to downgrade
to a budget model for a few months, and suddenly your app is unusable for them.

Note that developers who make software for Apple products have a huge advantage
here. The number of devices they need to develop for is vastly smaller than
developers for Windows, Linux, and especially Android.

Hardware is particularly a challenge with web development, where the same
software stack is used to develop for every imaginable type of hardware. Not
only that, but this stack is running a dynamic, interpreted language with many
layers of security and abstraction. One of the most exciting things about
WebAssembly is the potential to normalize web app performance across a wider
range of hardware[1].

In cases where you can control the hardware, it's amazing the levels of
consistency and reliability you can achieve. Last year I developed some forearm
pain in both arms from typing too much, so I made some Arduino-based [foot
pedals](https://github.com/anderspitman/ergo-pedals) so I didn't have to strain
so much to hit combo keys. I have a pair at home and work, that have both been
working non-stop for a year. No failures, no glitches, no reboots.

## Operating systems

If your app is too tightly coupled to a specific version of an operating
system, when the user updates their computer your app might quit working. This
is a much bigger problem on systems like Linux, which isn't used much for
end-user apps anyway. From what I've heard, Windows has an excellent
backwards-compatibility history. Mobile OSes seem to be somewhere in the
middle.

One example I've seen is where an OS adopts a specific design paradigm (such
as Material Design for Android), and there becomes pressure to overhaul your
app so the UI is consistent.

## Programming Language Compilers/Runtimes

The functionality, performance, and distribution of your app are deeply tied to
your choice of programming language. Fortunately, these are some of the most
stable dependencies around.

An obvious exception is new or quickly evolving languages. Rust syntax looks
very different post-1.0 than it did in the beginning, and even today the async
story is rapidly changing.

One situation I wouldn't want to be in is having written an app in the latest
compiles-to-JavaScript language, then have the language go extinct 2 years
later. This is less of a problem if you only need codebase to live for 2 years,
but I'm not sure how common that is (or at least should be).


## Build Tools

Bundlers, transpilers, minifiers, uglifiers, etc.

They're called "dev dependencies" for a reason. Have you ever done a fresh,
`npm init` followed by `npm install webpack webpack-cli` then taken a peek in
`node_modules`?

Speaking of npm, I think it belongs here as well. Yes, npm is a dependency.
Especially if the experience you're providing is a library that is only
installable by using it.  It's perfectly possible to write a node service or
browser application without having a package.json at all. As a matter of fact,
that's the case with this website, and my personal website, both of which are
single-page apps.



## The Internet

The internet can be a huge dependency, and if interfaced with poorly, a huge
liability. The quality of different connections (and even a single connection
over time) varies wildly, and is affected by outages, congestion, solar flares,
[Georgian women with
shovels](https://www.theguardian.com/world/2011/apr/06/georgian-woman-cuts-web-access),
and whatever the cloud decided to have for breakfast on a given morning.

If your app relies on an internet connection at runtime, almost by definition
you a shipping a software experience which is constantly changing. Just because
people have become accustomed to dealing with slow internet connections doesn't
mean it's ok for us to abuse the internet as a dependency. There are many
techniques for improving the user experience, the most basic of which is
communicating what exactly is going on.

Time-to-first-byte is often touted as one of the most important attributes of
web software. Maybe that's true. I'm inclined to question it, and I think it
depends on whether you're talking about a content website, or a web app. If 
it's an app, and I have a choice between waiting 5 seconds for it to download
all the code and enough data for page changes to be instantaneous, vs an
instant first page followed by variable page loads later, content jumping
around and things stream in, etc, I'll take the 5 seconds every time.
Especially if it gives me a loading bar.

It's all about expectations. For year, gamers have been waiting on huge
downloads before they can even run the game. Because once the download is done,
the performance is great.

Note that fast first load and instant page navigations are not mutually
exclusive.

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
disappears (which happens often), your experience is now broken.

You could always link out to the Internet Archive, but then you're centralizing
all your link dependencies. I think the long-term solution to this problem
could be something like IPFS, where websites pin versions of everything they
link to. But that has its own problems, like if you link out to an insecure
version of a web app. This would basically be the web's version of static
linking.

## Frameworks/Libraries

These ones are obvious. They're what I usually think of first when people talk
about dependencies. If you're using a large framework that does a lot of heavy
lifting for you app, you're at the mercy of that framework (and its likely many
sub-dependencies) for your experience to remain consistent.  The less you
understand what that framework is doing under the hood, the more vulnerable you
are.

That doesn't mean frameworks are bad. A new developer with an exciting idea
might be able to crank out a prototype using a framework where they would
otherwise get bogged down with platform details.

However, in general I advocate learning the platform over time, not necessarily
to avoid using frameworks, but to reduce the vulnerability that comes from
dependance on them. If your framework just can't do what you need it to
(or as performantly as you need it to), ideally you should be able to throw
it out and implement a bespoke replacement.

Just a few days ago, the inventor of NPM made a change in minipass, which broke
node-pre-gyp (I still don't know how exactly it depends on minipass, since it's
not a direct dependency...), which broke bcrypt, which broke our Docker build,
and [a lot of other people's
stuff](https://github.com/mapbox/node-pre-gyp/issues/477).

Note that although pinning versions of the libraries you're using would have
solved this particular problem for us, and is a good idea in general, it is
not a silver bullet. `package-lock.json` can save you from your app breaking
overnight, but in general there are going to be security updates and other
issues.

A few months ago we had a dependency that was no longer being maintained.  It
had gotten so old that it required an ancient version of node to work properly.
Eventually it started preventing us from keeping our other dependencies up to
date, because they depended on modern JavaScript features. Languages and
runtimes are relatively stable, but they DO change.

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

There are many different metrics we can use to gauge the risk of adding a
certain dependency, or to compare different dependencies with each other. One
criteria is how much control do you have over the dependency itself? A small,
in-house library provided by the team down the hall is much lower risk than
an off-the-shelf closed source framework. In general, the less work a
dependency is doing for you, and the more generic it is (ie easy to replace
with an alternative), the safer it is to use it.

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
others. Rarely do popular APIs provide their source code, and even if they did,
usually it's the data behind it that's actually valuable. You're giving a 3rd
party complete control over the functionality of your app, with a high
liklihood of it changing. However, sometimes there is no choice. If you want to
develop a Facebook app, you have to use their API.

Platform dependencies are the level where you're almost certainly wasting your
time trying to build it yourself (which doesn't mean that's never a good
choice).

## Data Dependencies

Data dependencies include things like public datasets, well-known lookup
tables, and sometimes even algorithms. One nice thing about these is that they
are often strongly related to something in the physical world, which lends them
a certain gravity that helps prevent them changing over time. For example, the
[CORDIC](https://en.wikipedia.org/wiki/CORDIC) algorithm/lookup tables have
been around essentially unchanged for many years, and will be useful in this
form for many more, because they are closely tied to a) math and b) fundamental
hardware architecture that is almost univerally used in our current computing
systems.

When re-writing [my personal website](https://anderspitman.net) recently, I
tried to avoid dependencies as much as possible. The site does have 2 though: a
markdown-to-html converter and a syntax highlighter. The syntax highlighter is
a great example of a data dependency. The core logic is unlikely to change from
language to language, and might be something I would consider writing myself.
However, it's not worth my time duplicating the effort already put into
creating grammars for all the supported languages.

Given their ubiquity and stable nature, I don't worry too much about using
data dependencies.
 
Note that public datasets that are trapped behind an API aren't pure data
dependencies, unless you can download the entire dataset.

## Logic Dependencies

Logic dependencies are the least desirable (and most avoidable) type. Logic
here refers to basic programming logic, ie if/then, loops, etc. Frameworks and
most libraries (except thin wrappers around datasets) are in this
category. These dependencies include basically any unit of functionality which
you could write yourself and avoid the dependency. However, there's a
tradeoff here. The more complicated the job being done by the dependency, the
more you should consider whether it's worth doing it yourself.

My rule of thumb is that if I'm not familiar with the inner workings of a
dependency, to spend a bit of time trying to implement it myself. Maybe
an hour or two. Maybe a day or two.  Sometimes I give up and decide to use the
dependency. Sometimes I realize I only need a tiny piece of the functionality
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
Generally, I try to avoid dependencies, and when I do need them, I try to only
use them in places where they could be swapped out for a similar option. The
syntax highlighter mentioned earlier is a great example of this.  Doing this is
easier if you make a wrapper that only exposes the features you need.

I hope I've given you one or two new ideas to consider the next time you're
faced with the choice of whether to take on a dependency.


[1] Let's be honest, web developers will probably find a way to waste it.
