It took me a sadly long time to realize my new website wasn't working at all
on iOS safari (likely not desktop either). That's one of the pitfalls with
making it a single page app. I still think the tradeoffs are worth it though.

Anyway, I needed a way to debug it, since Safari Web Inspector relies on having
a Mac, and I'm on linux. Turns out this isn't a new problem, and the folks at
google have an excellent debugging tool that was easy for me to set up:

[ios-webkit-debug-proxy](https://github.com/google/ios-webkit-debug-proxy).

Once I got the console working it became pretty obvious that the global config
I had defined wasn't being seen inside my ES modules. Neither Firefox or Chrome
have this behavior. Not sure what the standard says, but I was able to fix it
by passing the config in to my components, which is a better practice anyway.
