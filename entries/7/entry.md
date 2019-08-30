**Update 2019-05-22**: There is now a Russian translation of this post
[here](http://softdroid.net/sozdanie-svyazannogo-odnofaylovogo-prilozheniya). Thanks Vlad!

This tutorial will cover the basics of creating a minimal React app which can
be deployed as a statically-linked Rust binary. What this accomplishes is
having all of your code, including HTML, JavaScript, CSS, and Rust, packaged
into a single file that will run on pretty much any 64-bit Linux system,
regardless of the kernel version or installed libraries.

Complete source is available on [GitHub](https://github.com/anderspitman/react_rust_webapp).

# Why?

* **Simpler deployment:** Having a static binary means you just have to copy the
  file to your servers and run it.
* **Cross-platform native GUI apps:** One of the biggest challenges in creating
  a cross-platform GUI app is working with a GUI library that targets all the
  platforms you're interested in. The approach here lets you leverage the
  user's browser for this purpose. This is somewhat similar to what
  [Electron](https://electronjs.org/) accomplishes, but your backend is in
  Rust rather than JavaScript, and the user navigates to the app from their
  browser. There are certainly tradeoffs here, but it can work well for some
  apps. I was first introduced to this approach by [syncthing](https://syncthing.net/),
  which is written in go but does a similar thing.
* Because I've been obsessed with static linking for as long as I can
  remember and I'm not really sure why.

# Prerequisites

* Linux build environment
* [Rust with cargo](https://www.rust-lang.org/en-US/install.html)
* [node with npm](https://nodejs.org/en/)

# Initialize the project directory

We're going to let cargo manage the project directory for us. Run the following
commands:

```bash
cargo new --bin react_rust_webapp
cd react_rust_webapp
```

# Create the React app

First install React, Babel, and Webpack:

```bash
mkdir ui
cd ui
npm init -y
npm install --save react react-dom
npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react webpack webpack-cli
```

Then create the source files:

```bash
mkdir dist
touch dist/index.html
mkdir src
touch src/index.js
```

Put the following content in `dist/index.html`:

```html
<!doctype html>
<html>
  <head>
    <title>Static React and Rust</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

And set `src/index.js` to the following:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hi there</h1>,
  document.getElementById('root')
);
```

We will also need a `.babelrc` file:

```json
{
  "presets": [
    "react",
    "env",
  ],
}
```

And a `webpack.config.js` file:

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  }
};
```

You should now be able to test that the frontend stuff is working. Run:

```bash
npx webpack --mode development
```

This will generate `dist/bundle.js`. If you start a web server in the `dist`
directory you should be able to successfully serve the example content.

Now for the Rust part.

# Setting up the Rust backend

Move up to the `react_rust_webapp` directory:

```bash
cd ..
```

First thing we need to do is install a web framework. I found [Rouille](https://github.com/tomaka/rouille)
to be great for this simple example. I also really love [Rocket](https://github.com/SergioBenitez/Rocket).

Add rouille to your Cargo.toml dependencies:

```toml
[package]
name = "react_rust_webapp"
version = "0.1.0"

[dependencies]
rouille = "2.1.0"
```

Now modify `src/main.rs` to have the following content:

```rust
#[macro_use]
extern crate rouille;

use rouille::Response;

fn main() {
    let index = include_str!("../ui/dist/index.html");
    let bundle = include_str!("../ui/dist/bundle.js");
    rouille::start_server("0.0.0.0:5000", move |request| {

        let response = router!(request,
            (GET) ["/"] => {
                Response::html(index)
            },
            (GET) ["/bundle.js"] => {
                Response::text(bundle)
            },
            _ => {
                Response::empty_404()
            }
        );

        response
    });
}
```

What is this doing?

At compile time, `include_str!` reads the indicated file and inserts the
contents as a static string into the compiled binary. This string is then
available as a normal variable.

The rouille code just sets up two HTTP endpoints, "/" and "/bundle.js".
Instead of returning the files from the filesystem as we'd typically do with
a web app, we're returning the contents of the statics strings from the binary.

To learn more about using Rouille to do more advanced stuff refer to their
docs.

# Running it

Alright, now if all went well we should be able to run it. Make sure
`ui/dist/bundle.js` has already been generated as instructed above. Then run:

```bash
cargo run
```

It should start a server on port 5000. If you navigate to http://localhost:5000
in your browser you should see "Hi there".

# Static linking

This part can be skipped if you don't need 100% static linking. Rust statically
links most libraries by default anyway, except for things like libc.

If you do want to proceed, you'll first need to install [musl libc](https://www.musl-libc.org/)
on your system and ensure the musl-gcc command is on your PATH.

Then, rerun cargo as follows:

```bash
cargo run --target=x86_64-unknown-linux-musl
```

# Production build

For smaller binaries, build `bundle.js` as follows (from with `ui/`):

```bash
npx webpack --mode production
```

And run cargo as follows:

```bash
cargo build --release --target=x86_64-unknown-linux-musl
```

You should end up with a statically linked binary in
`react_rust_webapp/target/x86_64-unknown-linux-musl/release/`

# Conclusion

This is just the basics. There's a lot more you could do with this, including:

* Use `build.rs` to automatically build the React app when you compile Rust.
* Take the port number from the command line
* Serialized (probably JSON) requests and responses
* Run webpack as an npm script command
* Target other OSes. I haven't tried yet, but this should be mostly transferable
  to MacOS and Windows, thanks to the awesomeness that is Rust/Cargo and the
  universal availability of web browsers.
