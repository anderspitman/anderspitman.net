# Introduction

There are lots of great static site generators out there. If you just want to
get a blog or simple site up and running with minimal fuss, you can't go wrong
with something like Hugo or Gatsby. However, SSGs can be very simple pieces of
software, and I highly recommend writing your own to get more customization
over your site, as an exercise, or even just for fun.

I recently decided to rewrite this website from scratch. I had previously been
using [Hugo](https://gohugo.io/), which is an excellent
[static site generator](https://www.staticgen.com/), and worked great for my
needs. However, I wanted complete control, down to the tiniest detail. This is
partially for the purposes of learning, but also because I'd like to add some
custom features to my site eventually, like maybe doing some extreme load time
optimizations, etc.

Anyway, I knew from the get-go there was a good chance I'd end up writing some
sort of a SSG.

Spoilers: The final result of this exercise, **[Anders'|Another] Static Site
Generator (assg)**, can be found
[on GitHub](https://github.com/anderspitman/assg).

# Step One: Raw HTML

I decided to start completely barebones, with nothing but raw HTML, and add
the minimal amount of functionality to get a working landing page and blog,
with an eye towards eventually adding other pages such as links to projects,
resume, and so forth.

I first wrote the landing page with nothing but a paragraph and a nav section
with 2 links: one
to the landing page itself ("Home"), and one to a not-yet-implemented "Blog"
page. It was really refreshing to write HTML directly, without going through
layers of JS framework. It's been a while, and was pretty nostalgic.


# Reusing HTML

It didn't take long before I needed more functionality. When I went to
implement the Blog page, I obviously wanted to reuse the nav section at the top
of my landing page. I knew templates were probably a good direction to go for
this.  But what templating system to use? I spent some timing comparing
different options. My primary constraint was that I wanted to write my SSG in
[Rust](https://www.rust-lang.org/en-US/), both to continue learning the
language, and because I think it's awesome. That ruled out many of the
template systems, which are written for JavaScript and Ruby.

After reading up on templating systems a bit, I decided to go with
[Mustache](https://mustache.github.io/), because it's simple, old, and
supported across a wide variety of languages. Remember, I'm not looking for
anything fancy, just basic HTML reuse/imports.

And, true to form, there's already a Rust library for parsing Mustache
templates: [rust-mustache](https://github.com/nickel-org/rust-mustache).
Using the library is pretty dead simple. You just give it a string of the
template (read from a file in this case), and it renders it to HTML which you
can then write to an output file. It even handles partials, which are a way
for a template to include another template. This is actually exactly the
functionality I needed. I want to render `index.mustache` and
`blog/index.mustache`, and have them both include `header.mustache` which has
the nav section. This worked great and required very little work on my part.

`index.mustache` now looks basically like this:

```html
{{> header}}
<main>
  <p>
    ...boring words...
  </p>
</main>
{{> footer}}
```

The `{{> header}}` part is the syntax for including a partial named
`header.mustache`. It can also handle relative paths like
`{{> ../partials/header}}`.


# Generating a List of Blog Posts

Ok, so at this point we are able to reuse little snippets of HTML, but all of
the pages still need to be written manually. What I wanted was to be able to
drop a bunch of Markdown files into a directory, and have the SSG automatically
generate a page with a list of links to each of the posts.

The first stage of this is really simple. We just need to read the list of
files in the indicated directory, and pass that list to the `blog/index.mustache`
template. Mustache has the ability to repeat sections of HTML based on an
array of input. In this case the array is the list of blog posts.

I had to make an important design decision here. Blog posts typically have a
bit of metadata. This includes title, keywords, date/time, etc. Most SSGs I've
seen include this information in a YAML section at the top of the file, which
is known as [front matter](https://jekyllrb.com/docs/frontmatter/). This works
pretty well. However, I wanted my posts to be pure Markdown
([CommonMark](http://commonmark.org/), to be specific). Front matter is not
part of the CommonMark spec. It also isn't guaranteed to render on places like
GitHub, for example. Because of this, I decided to make each post a directory,
rather than a file. The directories include a `metadata.toml` file and a
`post.md` file. This worked great.

The `metadata.toml` file for the post you're reading looks something like
this:

```toml
title = "Make You a Static Site Generator"
format = "markdown"
date = "2018-06-26"
```

Eventually, I'll support raw HTML in addition to Markdown. I started with
Markdown because I already had a few posts written from my old site.

`blog/index.mustache` ended up looking like this:

```html
{{> ../header}}
<main>
  <h1>Posts</h1>
  <ul>
    {{#posts}}
    <li>
      <a href={{url}}>{{date}} | <strong>{{title}}</strong></a>
    </li>
    {{/posts}}
  </ul>
</main>
{{> ../footer}}
```

The `{{#posts}}` and `{{/posts}}` are the Mustache syntax for rendering a list
of elements from the array named `posts`, which is passed in when you render
the template.

As you can see, the date and title get passed through, and a link is generated
for each post. The URL for each link is generated and passed in as well.


# Rendering Markdown

So now we've generated an HTML page which lists all our blog posts. Now we
need to actually generate a page for each post, starting with the `post.md`
Markdown file and ending up with a static HTML page.

Here's where the implementation started to get more interesting (ie
challenging). There are a few different Markdown rendering libraries available
for Rust. I chose to use
[pulldown-cmark](https://github.com/google/pulldown-cmark), which seems to be
the most popular (it's used by [Gutenberg](https://github.com/Keats/gutenberg),
a popular SSG written in Rust). Once again, using this library was pretty easy.
Just give it a string of Markdown, and it renders a sensible HTML string for
you. The problem I ran into was that the built-in syntax highlighting was very
minimal. Rather than try some of the other Markdown renderers to see if they
were any better, I decided it would be fun to try and handle the highlighting
more manually, using the [syntect](https://github.com/trishume/syntect) library
(once again, this is a popular choice, and it used by Gutenberg).

Fortunately, `pulldown-cmark` is well designed for this sort of customization.
Basically, when parsing a Markdown file, it gives you a stream of events
which represent the beginning, end, and content of each type of CommonMark
element encountered. You can either let it handle each type of event the
default way, or override specific types of events to customize the behavior.
This is exactly how Gutenberg works, and I found
[their source](https://github.com/Keats/gutenberg/blob/e662f734381a773dd4124f51444e7a61fc58c1a2/components/rendering/src/markdown.rs)
very helpful
for solving my simpler problem. In my case,
I wanted to override how it handles `CodeBlock` events, to use syntect instead
of the built-in highlighting. 

My (quite hacky) code ended up looking something like this:

```rust
let parser = Parser::new(&markdown_text).map(|event| {

    match event {
        Event::Start(Tag::CodeBlock(language)) => {
            in_code_block = true;
            syntax_name = lang_map.get(&language.to_string())
                .expect(&format!("{:?} not in language map", language));
            Event::Html(Owned("<div class='code'>".to_string()))
        },
        Event::End(Tag::CodeBlock(_)) => {
            in_code_block = false;

            let syntax = ss.find_syntax_by_name(
                syntax_name.as_str()).unwrap();

            let mut html = highlighted_snippet_for_string(
                &code.to_string(), syntax, theme);

            html.push_str("</div>");

            code = String::new();
            Event::Html(Owned(html))
        },
        Event::Text(text) => {

            if in_code_block {
                code += &text.to_string();
                Event::Text(Owned("".to_string()))
            }
            else {
                Event::Text(text)
            }
        }
        _ => event
    }
});

```
