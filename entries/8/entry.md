# Introduction

This post will cover how to get a simple static Rust executable running
inside a barebones Docker container. This allows you to compile static Rust
binaries for a single platform (Docker, or more specifically Linux x86), and
run them on any operating system which can run Docker. Although Rust already
compiles to 
[a lot of platforms](https://forge.rust-lang.org/platform-support.html)
, I think this method could still be useful in some cases.

There are already other great
[blog posts](https://blog.semicolonsoftware.de/building-minimal-docker-containers-for-rust-applications/)
and
[examples](https://gist.github.com/ihrwein/1f11efc568601055f2c78eb471a41d99)
on this topic. This can be seen as a micro-tutorial
to get the most basic version working. I highly recommend checking out the
other resources to get something actually useful up and running.

Full source code for this post is available
[on GitHub](https://github.com/anderspitman/rust_docker_barebones).
As you can see, there's not much to it.

# Prerequisites

* [rustup](https://rustup.rs/),
  [Rust, and cargo](https://www.rust-lang.org/en-US/install.html).
  Note that the best way to install Rust and cargo is using
  rustup, so you just need to download that and follow the
  instructions and it will
  download and install the other two for you.
* [musl libc](https://www.musl-libc.org/)
  on your system with the musl-gcc command is on your PATH. musl is a
  lightweight libc implementation that works well for static linking. It is
  supported by Rust.
* [Docker installation](https://docs.docker.com/install/)



# Rust stuff

First create a new Rust executable project:

```bash
cargo new --bin rust_docker_barebones
```

Navigate to that directory.

We're going to build our executable in release mode, and tell
it to use musl to output a static binary that doesn't depend
on any dynamically linked libraries.

First we need to install the musl target for Rust:

```bash
rustup target install x86_64-unknown-linux-musl
```

Then we can build it:

```bash
cargo build --release --target=x86_64-unknown-linux-musl
```

That's it for Rust.


# Docker stuff

Create the following Dockerfile in the Rust project directory:

```
FROM scratch

COPY target/x86_64-unknown-linux-musl/release/rust_docker_barebones /rust_docker_barebones

ENTRYPOINT ["/rust_docker_barebones"]
```

This starts with the most stripped-down Docker image, called the scratch image.
Maybe you've used the excellent tiny
[Alpine image](https://hub.docker.com/_/alpine/)?
This is even
more minimal than that. Basically the only thing the scratch image can do
is run a Linux x86 executable file. The Dockerfile copies our Rust release
binary into the image at the location `/rust_docker_barebones`. Finally it sets
that location as the default executable to call when the Docker container is
launched.

Now build the Docker image:

```bash
docker build -t rust_docker_barebones .
```

And finally try running it:

```bash
docker run rust_docker_barebones
```

You should see the default Rust "Hello, World!" output.

And that's it!


# Next steps

There's a lot you can do to improve this. Here's a couple ideas:

## Optimize Docker image size

The resulting Docker image is >4.5MiB in size. This is mostly due to the Rust
executable. Optimizing this is beyond the scope of this post, but one simple
step is to run the `strip` program on the binary to remove debug symbols. A 
quick test on my system yielded a 539k image size. To go deeper, I'd start with
[this post](https://lifthrasiir.github.io/rustlog/why-is-a-rust-executable-large.html).

## Make a full app

If you want to deploy something actually useful, check out
[this post](https://blog.semicolonsoftware.de/building-minimal-docker-containers-for-rust-applications/)
which goes into the details of getting a web service working. You could use
that information along with a
[previous post of mine](https://anderspitman.net/2018/04/04/static-react-rust-webapp/)
to deploy "pseudo-desktop" applications across all operating systems capable
of running Docker and a web browser, without needing to compile for each OS.
You just need to target Docker and the browser.
