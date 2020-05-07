At work we use node+Webpack+Vue+Vuetify. In any isolated in-my-text-editor
programming moment, this is more often than not a fantastic, almost magical
experience.  It's so easy to find and compose different powerful components and
libraries. I truly feel like a wizard.  But more and more, it seems that it's
the in-between moments that are starting to define my relationship with these
tools.

Our GitHub repos are constantly barraged with Dependabot warnings and pull
requests concerning security vulnerabilities deep in our dependency tree. One
of our apps is stuck on node 10 because the Webpack/Vue build process is
failing for some reason we haven't had time to diagnose. Running `npm outdated`
on any of our projects never makes you feel good. And when the framework abstractions
themselves start to leak, it can be down-right disheartening<a id='note0ref' href='#note0'><sup>0</sup></a>.

We try to keep things updated, but our subconscious minds have learned that
this is almost always a painful process, so we avoid it even when we know we
shouldn't.

Here's my take. I think reactive UI is the big idea. Any reasonably
well-designed framework with a virtual DOM or equivalent (ie Svelte, Flutter),
which enables an immediate-mode mental model for building UIs, gets you 80% of
the way there. But I get the feeling that React and Vue are competing for that
last 20%, and the result is a lot of breaking changes with diminishing returns
in value to developers.

Even my personal favorite vdom framework for side projects, [Mithril][0],
bumped to version 2 a while back which caused breaking changes for my code. I
remember what the breaking change was, but I can't remember any of the features
added.  I consider Mithril 1 to be a fantastic, 90% UI solution, in a nice
small package.

Don't get me wrong, I still think Webpack, React, Vue, and Mithril are great
and getting better, and I appreciate all the hard work that is going into them.
This is important work. That's not my point.

Here's what I'm looking for. Somewhere out there, someone has built a very
boring UI framework. A framework designed for stability. A framework with 5-10
year long-term support for each breaking change. This framework was probably
developed internally at a large company. This framework is probably rather
opinionated. This framework probably has a low number of high quality, stable
external dependencies.

I'm going to find this framework, and I'm going to
admire it from a distance, because my team is all-in on Vue at this point and I
don't think there's any going back.

# Footnotes

<a id='note0' href='#note0ref'><sup>0</sup></a>
For any of you who may not have had the experiences that teach you when it's
necessary to use Object.freeze on portions of your Vue state, if you do at some
point, know that you're not alone and feel free to reach out to me for
emotional support.

[0]: https://mithril.js.org/
