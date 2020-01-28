Google Analytics ("GA") is free and easy to use. The reason it's free is
because Google is using you to get to your users. Every time someone visits
your site without a blocker, Google fingerprints their browser and tracks them
across sites they visit. This information is used to send that person targeted
ads and manipulate them into buy crap they don't need.

So how do we get the convenience and benefits of analytics that GA provides,
without selling out our users? Fortunately, there are a lot of small projects
and companies that are popping up to address this.


# The Criteria

When I started looking for an alternative, these were my main criteria:

1. Needed to be very easy to get started. GA is sign up for an account then
   copy/paste a small script.

2. Offered as a hosted service. I've tried self hosting in the past, but devops
   just doesn't interest me as a hobby. I'm fine doing it for a few things, but
   not every service I need.

3. No vendor lock-in. Preferably this means open source, but exporting all my
   data easily to a common format would also work.

4. Respect user privacy and agency.


# The Contenders

Based on my quick research, here are the projects that caught my eye:

1. [GoAccess][0]. Uses server-side logs. Open source. This would work for a lot
   of my projects, and eventually I'd like to use it, but I don't want to deal
   with the hassle of figuring that all out right now. See Appendix A.

2. [GoatCounter][1]. Dead simple GA alternative. Source code is available for
   self-hosting. Free for personal use. This is what I went with.

3. [SimpleAnalytics][2]. Nice GA alternative. Expensive (19USD/mo). Source is not
   available.

4. [Matomo][3]. Old guard GA alternative. Open source. Lots of features. Hosted is
   expensive (19USD/mo starting tier). Looks complicated. PHP.


# The Choice

In the end, [GoatCounter][1] looked the most promising, so I tried it first. I
immediately fell in love. It took 5 minutes to set up my account (didn't even
have to create a password), and copy the script into my site. The UI is very
simple and intuitive. It shows me the information I care about, without all the
noise. It's so refreshing. Been using it for a week with no issues. My plan is
to remove GA from this site, after the next time I have a high-traffic post,
so I can compare them under load.

If you use GoatCounter, please consider signing up for one of the paid
options, or at least sending a few $ their way. The internet needs more
services like this. I'm not affiliated with GoatCounter in any way; just a
happy customer.


# Caveats

None of the GA alternatives I've seen have all the features GA offers.
Personally, I realized that I only ever look at the basics anyway. I want to
know how many people are visiting my site, where they are coming from, which
pages they are visiting, and some basic device information.

You can go down a deep rabbit hole of analyzing how users navigate your site,
where they click, where they drop off, etc, etc. But in my opinion, many of
these paths lead to you manipulating your users into using your site the way
you want them to. If you have good content, people will read your site. If you
have a good product that solves a real problem, people will buy it. Sure, you
should follow good design principles to make your site usable, but no amount of
design can fix a site that doesn't offer any value.


# Addendum

It's funny how sometimes we use things in subtly different ways because of a
large jump in performance. Here's what I mean. I've never once tried checking
my GA numbers from my phone browser. I never really thought about that, I just
didn't do it. But with GoatCounter I noticed that I had started using my
phone to check my daily pageviews. After a bit of thinking, I realized that
I simply have 0 faith that the GA site would provide a good experience in a
mobile browser, based on it's desktop performance and the performance of other
Google products. I imagine it would be slow and painful. My subconscious had
ruled it out before I ever even considered it. GoatCounter gives the exact
opposite impression. It screams simplicity and performance, just begging
to be used on an entry-level smartphone.


# Appendix A - Server logs vs SaaS analytics

When choosing server- vs client-side analytics, here are the things I think
about:

1. Not all static-site services (GitHub Pages, Netlify, etc) offer access to
   the server logs, and if they do sometimes it costs money. Client-side gets
   around this.

2. Server-side is nice because you don't need JavaScript.

3. Client-side is nice because you can get more information, such as screen
   size.

4. If you're using a CDN (like CloudFlare), using server-side will dramatically
   throw off your numbers, because not all requests are hitting your servers.


[0]: https://goaccess.io/

[1]: https://www.goatcounter.com/

[2]: https://simpleanalytics.com/

[3]: https://matomo.org/
