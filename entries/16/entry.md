I want to tell you about something I was unable to accomplish, after more than
30 minutes of concerted effort.

I have video file hosted using a web server. The file is H.264 main-profile
encoded at a reasonable bitrate (<5Mbps), uses AAC audio, and is packaged in an
MP4 container. The web server supports HTTP range requests.  In other words,
the video is basically in the least common denominator format for
compatibility. It streams great in all major web browers, VLC, and everything
in between.

In my living room, I have a Roku "smart" TV. It has tons of apps, full internet
connectivity, and is more than capable of both connecting to and playing the
video file described above. But I failed to get this to happen, after much
googling and trying multiple apps (both on the Roku TV and my Android phone).

The way this type of thing is usually accomplished in 2020 is to open the
video on your phone, then tap a "cast" icon and tell it to send the video to
your TV. What happens behind the scenes is the phone uses some protocol
(Chromecast being the most common I'm aware of) to send the URL to the TV, and
the TV then plays it directly, while still letting you play/pause, seek, change
volume, etc from the phone. When this works, it's like magic. The YouTube app
works particularly well. However, there doesn't seem to be any widely
implemented standard for playing plain URLs, only walled gardens like the
YouTube app.

This whole thing was made much more frustrating by the fact that I *knew* the
TV had all the requisite capabilities to do what I was attempting. The YouTube
app is proof of that. There just wasn't any obvious way to find the correct app
combination.

Here's the way this should work.

The Roku app for Android allows you to use your phone as a keyboard for the TV,
rather than the awful physical remote UX for input. This is a great feature
which I appreciate.

I should be able to copy a URL from my phone (possibly obtained
from scanning a QR code), paste it into the Roku Android app, and the Roku
should attempt to play the file at the URL. This is clunky, awkward, and not
particularly easy. But it is simple, obvious, and intuitive.

Here is my plea: when you build hardware/software, please make it support the
primitive, simple case.  By all means, implement the slick Chromecast-style
flows. It's great when it works. But there needs to be a fallback for when it
doesn't work, or when the user wants to try something slightly different. HTTP
is the lingua franca of the internet. When you build stuff, please make it work
with simple URLs.
