TL;DR - This site is now browsable from the command line using cURL. Give it
a try:

```bash
curl https://anderspitman.net/txt/17
```

[Yesterday][0], I wrote a quick rant essentially whining about how I couldn't
figure out how to get my Roku smart TV to play a video I was hosting. I ended
the post with the following:

> When you build hardware/software, please make it support the primitive,
> simple case ... HTTP is the lingua franca of the internet. When you build
> stuff, please make it work with simple URLs. 

There was some good [discussion][1] about the woes of smart TVs, and some great
suggestions for alternative solutions, but a large number of comments were
focused on the fact that my blog is rendered in JavaScript. Here are a few of
my favorite exerpts:

---
> Please make your stuff work with reader view.
---

> Please make your stuff work without JavaScript. This is a simple text-only
> web page (in courier new ffs) and it refuses to load with JavaScript
> disabled. There is no valid reason for this. 
---

>> Here is my plea: when you build hardware/software, please make it support
>> the primitive, simple case.

> Says a webpage that is just a couple empty divs w/o JS, and, with JS, is 4
> hyperlinks, a few paragraphs of text, and absolutley nothing (aside from
> google-analytics) that ever needed any JS in the first place, let alone 5 or
> 6 files' worth of it. But, I think that conflict really speaks to the
> funamental issue, here: Thinking about the primitive, simple case is often,
> from the creator's perspective, more work than it's worth. 
---

> I mean, if you're going to wax lyrical about how what your making should
> support that basics, you should at least first make sure you're doing the
> same thing.
---

> I mean, it loads fast for me.
---

> I consider that stage of fuckwittedness either absolutely deliberate (which
> it appears to be in this case based on the authors defence of their
> practices), or utter incompetence.
---

> And when it does load, it's white Courier on black, as if specifically
> designed for poor usability and accessibility.
---

> Quote "HTTP is the lingua franca of the internet. When you build stuff,
> please make it work with simple URLs." Says the one who can't have a simple
> HTTP only site and I had to enable JS on NoScript in order to read his rant. 
---

> 8 hours in and Spitman's site is still a black page, even with JS enabled.
---

> Instead, you push that compute off on your readers; actively harming the
> environment in the process. Yes, in this day and age I feel it's quite
> justifiable to point that out. You could render it once and be done with it,
> but instead you chose to have it be rendered (inefficiently) tens or hundreds
> of thousands of times, consuming orders of magnitude more energy and
> generating heat, all to "avoid a dependency". This should be, in this day and
> age, morally reprehensible.
---

At the end of the day, my site did *not* support the simple case, making me at
best a hypocrite, at worst a planet destroying megalomaniac.

Well, that ends now.

The thing is, I totally agree with these folks. It makes me sad how complicated
these insane virtual machines we call web browsers have become.  In part
because of this complexity, browser competition is [dying][2].

To quote myself from a comment yesterday:

> In my perfect world, the JS-app functionality of browsers would be broken off
> into a separate "app player" application that users would download, and
> browsers would be stripped down to basic HTML and a subset of CSS
> (essentially fonts, colors, and flexbox). In that world I would definitely
> have an HTML-only version of my blog.

But the more I thought about it, I don't think even HTML/CSS is truly
supporting the simple, primitive case. At the end of the day, most of my
content is text. And text requires only Unicode (and often just ASCII). So, in
that spirit, as of today my content is totally accessible using nothing but
cURL, or any other HTTP client.

This post can be accessed here:

```bash
curl https://anderspitman.net/txt/17
```

To see a feed of my posts, go here:

```bash
curl https://anderspitman.net/txt/feed
```

There's a navigation section at the top of each page with links and cURL
commands to the other sections. I've found it pretty easy to navigate, both
using copy/paste from the CLI, and quickly modifying the URLs in the browser,
and using the back/forward buttons.

I know this whole thing might come off as sarcastic, or passive aggressive, and
I totally admit that was part of my motivation at first. But the more I worked
on this, the more I liked it. It made me think a lot more about accessibility,
and what would happen to a lot of content on the web if we didn't have our JS
VMs for some reason.

This also gave me a greater appreciation for Markdown, and other human-readable
text formats. When I first re-wrote my site a few months ago, I struggled to
choose between Markdown and plain HTML. Markdown seemed like a dependency to
me. But now I realized HTML has a much bigger dependency: a web browser. In the
simple case, you don't need a Markdown renderer to read this post.

This is still an early experiment. I've thought about how I could implement
things like forward/back. I'd love to hear if anyone else has ideas for how
to improve the experience.

Specifically, I have one open question: while working on this, I realized just
how ugly inline links (especially long ones) can be in unrendered Markdown. For
this post, I put them at the bottom in reference section style. But I'm
wondering how this is for accessibility. What do visually impaired folks
prefer?


[0]: https://anderspitman.net/16/#please-work-with-urls/

[1]: https://news.ycombinator.com/item?id=22038065 

[2]: https://www.theverge.com/2018/12/6/18128648/microsoft-edge-chrome-chromium-browser-changes
