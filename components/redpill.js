import { Rainer } from '../deps/redpill/index.js';


const RedpillView = (parent) => {
  const dom = document.createElement('div');
  dom.innerHTML = `
    <main>
      <p>
        <code>redpill</code> is a JavaScript visualization inspired by the
        <a href="https://en.wikipedia.org/wiki/Matrix_digital_rain">
          Matrix digital rain.
        </a>
      </p>
      <p>
        What makes this implementation unique is that it grabs lines of code from
        your latest public GitHub contributions and uses them as the code rain.
      </p>
      <p>
        Interactive embedded demo is below (might take a bit to start up since it
        has to download some snippets from GitHub). Full screen demo
        <a href="https://anderspitman.net/apps/redpill">here.</a>
        I've found it really fun to watch, especially since you can recognize
        little pieces of code you wrote recently. For example, while developing
        this project, most of the code shown was from redpill itself, which seems
        like a fitting sort of recursive property given the source of inspiration.
      </p>
      <p>
        It's designed to be easy to add to any web page. Basically just give it
        the id of a div. Details on installation can be found in the code repo
        <a href="https://github.com/anderspitman/redpill">here</a>.
      </p>
    
      <p>
        Note that if you load it too many times from the same IP GitHub's rate
        limiting will kick in. One way to increase your limit is to make
        your requests with a username and password. This is what I did during
        development. Actually at one point I accidentally pushed my GitHub
        credentials to the public repo! The way I noticed was that I saw my
        username in the Matrix rain. I thought that was pretty funny. And don't get
        any ideas about checking the git history. I already changed the password
        and force-pushed ;)
      </p>
    
      <h1>Future Plans</h1>
      <ul>
        <li>
          Allow explicitly providing a file URL, rather than GitHub username. This
          would make it easier for example to give it a file containing DNA
          sequences or the text of your favorite book.
        </li>
        <li>
          Spruce up the graphics to make it match the original movie much more
          closely. Possibly switch to WebGL (currently uses canvas).
        </li>
        <li>
          Syntax highlighting.
        </li>
        <li>
          Handle GitHub's rate limiting gracefully.
        </li>
      </ul>
      <div class="rain-header" style="font-size: 20px;
        font-weight: bold;
        position: absolute;
        color: white;
        background-color: rgba(0, 0, 0, 0.6);
        left: 50%;
        transform: translateX(-50%);
        margin-top: 40px;">
        <div>Enter a GitHub username</div>
        <input class="username" type="text" value="anderspitman" />
        <input class="submit" type="button" value="Restart" ></input>
      </div>
      <div class='rain-container' style="height: 400px;"></div>
    </main>
  `;

  const usernameInput = dom.querySelector('.username')
  const submitInput = dom.querySelector('.submit')

  const theme = {
    fontFamily: 'Courier New',
    fontSize: 14,
    fontWeight: 'bold',
    fontColor: '#26a750',
    backgroundColor: 'black',
  }


  let rainer;

  submitInput.addEventListener('click', () => {
    const username = usernameInput.value;
    const root = dom.querySelector('.rain-container');
    const oldElem = root.firstChild;
    root.removeChild(oldElem);
    go(username);
  })


  function go(username) {
    rainer = new Rainer({
      sourceType: 'github',
      githubUsername: username,
      domElement: dom.querySelector('.rain-container'),
      theme,
    })
  }

  // TODO: there's probably a cleaner way to do this. Maybe change redpill to
  // resize automatically.
  //
  // Wait until parent has appended this element to the dom before rendering,
  // otherwise the size will be 0.
  const observer = new MutationObserver(function(mutations) {
    if (parent.contains(dom)) {
      go(usernameInput.value);
      observer.disconnect();
    }
  });
  observer.observe(parent, {
    childList: true,
  });

  return dom;
};

export { RedpillView };
