This is getting out of hand. First, I wrote an unrelated post, and Hacker News
got a little upset with me about my blog requiring JavaScript. I ultimately
agreed with them. To redeem myself, I updated my site to not just serve static
HTML, but to be entirely browsable with nothing but cURL. Full background and
details in [this post](/17/#curlable).

However, I kept going down the rabbit hole, wondering how simple serving blog
content can realistically be. Here's how far I've gotten. If you have
[netcat][0] installed, you can browse my site by running this command:

```bash
nc txt.anderspitman.net 3838 <<< /txt/feed
```

There are further instructions at the top of that "page" describing how to
navigate.

It uses an extremely simple protcol. You can use any TCP client. Just open a
TCP connection to txt.anderspitman.net on port 3838, write a path in plaintext,
and it will return the contents if found. I call it the newb protocol.

If you don't have netcat, it's simple to write a newb client in your favorite
language. Here's one in node:

```javascript
#!/usr/bin/env node

const net = require('net');

const client = new net.Socket();
client.connect(3838, 'txt.anderspitman.net', function() {
	client.write('/txt/feed');
});

client.setEncoding('utf8');

client.on('data', (data) => {
  console.log(data);
});
```

And Python:

```python
#!/usr/bin/env python3

import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect(('txt.anderspitman.net', 3838))
    s.sendall(b'/txt/feed')

    chunks = []
    while True:
        chunk = s.recv(1024)
        if not chunk: break
        chunks.append(chunk.decode())
    print(''.join(chunks))
```

Those can both easily be adapted to take the path from the command line. And
the host address too if anyone else decides to implement the newb protocol ;)
Speaking of which, the server code is [here][1].

[0]: https://en.wikipedia.org/wiki/Netcat

[1]: https://github.com/anderspitman/newb-server-go 
