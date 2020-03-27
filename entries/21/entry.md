Perhaps the most concerning thing about the SARS-CoV-2 virus is that you can be
simultaneously asymptomatic and contagious, for days. In a perfect world, we
could all just stay away from each other indefinitely until we have some sort
of a solution. Real-world constraints won't allow that.

Since some amount of human interaction is unavoidable, we need to look for
other tools to help control the spread. In a world of perfect data, as soon as
a person tested positive for COVID-19, we would be able to immediately inform
everyone they've been in contact with recently, and everyone those people have
been in contact with, and so on until we've alerted everyone within the max
potential contagious period who hasn't already been warned by a shorter path
through the social graph.

For better or worse, we don't have access to this perfect data. However,
Facebook might be our best approximation. They have 2.5 billion active monthly
users, and their apps default to tracking user location for targeting ads.

What I'm wondering is why doesn't FB add a big blue "I have tested positive for
COVID-19" button to everyone's account, and then use their social graph and
location data to implement an algorithm like what I described above?

Maybe this would be too much computational overhead at FB's scale. I'm not
familiar with their query infrastructure. But that leads me to my second point.

# How this would look with an open, decentralized social network

Imagine a social network devoted to nothing but slowing the spread of COVID-19
cases. All it would need to do for a given user is

1. Track their location
2. Allow them to connect with friends in a bi-directional manner the same way
   FB does
3. Have the one single button for them to report they've tested positive
4. Automatically warn all their 1st-degree connections (possibly including a
   dump of location data during the max contagious period).
5. Include algorithms for processing alerts received from your friends and
   determining the likelihood you've been exposed, and passing that information
   on to your other friends.

This social network would run on a simple, open protocol. Ideally it would be
federated with multiple providers which offer easy signup. It could even be
implemented as a thin wrapper on top of email, though I think even that adds
more complexity than is necessary.

In terms of scale, I personally have ~1600 Facebook friends. My guess from
years of observing how many friends my friends have, is that most people have
<1000, and a rather few have >2000. So in most cases you'd be looking at a
given instance sending maybe 2500 requests to alert all their friends'
instances they've been infected. Receiving shouldn't be a problem, since it's
unlikely all your friends get sick at the same moment.

Of course I'm probably missing something obvious, but maybe not. All this has
me wondering if there might be a legitimate opportunity for a new social
network to arise. We know Facebook-the-app is awful. It's tainted by the
incentives from which it arose. I believe most of us could design a superior
user-centric UX for the core functionality inside a month. However, due to
network effects, Facebook-the-network is basically indomitable.

But all eyes are on COVID-19. People are cooped up in their houses wishing they
could take some sort of action to make things better. Maybe they could.
