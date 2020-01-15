While trying to find a way to redirect NoScript users to the
[text version of my site][0], I discovered [HTML redirects][1]. How did I not
know about these before?! Basically, it's a way to tell the browser to
navigate to a different URL, without HTTP codes or JavaScript. To use it on my
site, I just put the following in the head of my index.html:

```html
<noscript>
  <meta http-equiv="refresh" content="0; URL='https://anderspitman.net/txt/feed'" />
</noscript>
```

[0]: https://anderspitman.net/txt/feed

[1]: https://www.w3docs.com/snippets/html/how-to-redirect-a-web-page-in-html.html
