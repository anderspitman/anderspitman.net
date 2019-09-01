//import { ClientBuilder } from '/client/dist/bundle.esm.js';
//import { ClientBuilder } from config.remooseRoot + '/client/dist/bundle.esm.js';

import { Navbar, FeedHeader, Feed, Entry } from './components/core.js';
import { Tutorials } from './components/tutorials.js';
import { About } from './components/about.js';
//import { Rainer } from './lib/redpill/index.js';


(async () => {
  //const { ClientBuilder } = await import(config.remooseRoot + '/client/dist/bundle.esm.js');

  const state = {
    entries: {},
    promiseEntries: [],
  };

  const key = document.cookie.split('=')[1];

  //const rootDir = config.remooseRoot + '/entries';
  const rootDir = '/entries';

  const result = await fetch(rootDir);
  const tree = await result.json();

  //console.log(tree);

  // this is used to achieve a "natural sort". see
  // https://stackoverflow.com/a/38641281/943814
  const naturalSorter = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  });

  // sort in reverse-chronological order (the key is the entry id, which
  // increases monotonically).
  const sortedNames = Object.keys(tree.children)
    .sort(naturalSorter.compare)
    .reverse();

  const sortedEntries = sortedNames
    .map(name => tree.children[name]);


  const entryNameOffset = config.rootPath.split('/').length - 1;

  const dom = document.createElement('div');
  dom.classList.add('main');

  const navbar = Navbar();
  navbar.addEventListener('feed', () => {
    window.history.pushState({}, "", config.rootPath + 'feed/');
    navigate();
  });
  navbar.addEventListener('tutorials', () => {
    window.history.pushState({}, "", config.rootPath + 'tutorials/');
    navigate();
  });
  navbar.addEventListener('about', () => {
    window.history.pushState({}, "", config.rootPath + 'about/');
    navigate();
  });
  dom.appendChild(navbar);

  async function navigate() {

    const oldContent = dom.querySelector('.content');
    if (oldContent) {
      dom.removeChild(oldContent);
    }

    const content = document.createElement('div');
    content.classList.add('content');
    dom.appendChild(content);

    if (window.location.pathname === config.rootPath) {
      window.history.pushState({}, "", config.rootPath + 'feed/');
      navigate();
    }
    else if (window.location.pathname === config.rootPath + 'feed/' ||
             window.location.pathname === '/tutorials/') {

      fetchMissingEntries();

      const fullscreenListener = (e) => {

        const entryMeta = e.detail.entryMeta;
        let path = config.rootPath + (entryMeta.metadata.entryId + '/');

        if (entryMeta.metadata.urlName) {
          path += entryMeta.metadata.urlName + '/';
        }

        window.history.pushState({}, "", path);
        navigate();
      };

      content.addEventListener('entry-fullscreen', fullscreenListener);

      if (window.location.pathname === config.rootPath + 'feed/') {

        content.appendChild(Feed(state.promiseEntries));
      }
      else if (window.location.pathname === '/tutorials/') {

        const tutorials = sortedEntries
          .filter(e => e.tags && e.tags.indexOf('tutorial') > -1);

        const tutorialPromises = [];
        for (let i = 0; i < sortedEntries.length; i++) {
          const entryMeta = sortedEntries[i];

          if (entryMeta.tags && entryMeta.tags.indexOf('tutorial') > -1) {
            tutorialPromises.push(state.promiseEntries[i]);
          }
        }

        content.appendChild(Tutorials(tutorialPromises));
      }
    }
    else if (window.location.pathname === '/about/') {
      content.appendChild(About());
    }
    else {

      const parts = window.location.pathname.split('/'); 

      const entryId = parseInt(parts[entryNameOffset], 10);

      let index;
      let entryName;
      let entryMeta;

      for (let i = 0; i < sortedEntries.length; i++) {

        const entry = sortedEntries[i];

        if (entry.metadata.entryId === entryId) {
          index = i;
          entryName = sortedNames[i];
          entryMeta = entry;
        }
      }

      fetchEntry(entryName, entryMeta, index);
      const entry = await state.promiseEntries[index];

      content.appendChild(Entry(entry));
    }

    window.scrollTo(0, 0);
  }

  window.addEventListener('popstate', (e) => {
    navigate();
  });

  navigate();


  const root = document.getElementById('root');
  root.appendChild(dom);


  async function fetchEntry(name, entryMeta, index) {
    const metadata = entryMeta.metadata;
    const entryId = metadata.entryId;

    if (state.promiseEntries[index] === undefined) {

      const tags = entryMeta.tags;

      let path = config.rootPath + (sortedEntries.length - index) + '/';

      if (metadata.urlName) {
        path += metadata.urlName + '/';
      }

      const entry = {
        rootDir,
        path,
        entryId,
        metadata,
        tags,
        index,
      };

      // retrieved and rendered first.
      const contentPromise = fetch(rootDir + '/' + name + '/' + entry.metadata.contentFilename)
        .then(result => result.text());

      const entryPromise = contentPromise
        .then(content => {
          entry.content = content;
          return entry;
        });

      entry.contentPromise = contentPromise;
      state.promiseEntries[index] = entryPromise;
    }
  }

  function fetchMissingEntries() {

    for (let i = 0; i < sortedNames.length; i++) {
      const name = sortedNames[i];
      const entryMeta = sortedEntries[i];
      fetchEntry(name, entryMeta, i);
    }
  }

  //// render background visualization
  //const theme = {
  //  fontFamily: 'Courier New',
  //  fontSize: 18,
  //  fontWeight: 'bold',
  //  fontColor: '#26a750',
  //  backgroundColor: 'rgba(20, 20, 20, 1.0)',
  //};

  //const rainEl = document.getElementById('rain-container');
  //const dim = document.body.getBoundingClientRect();
  //console.log(dim);
  //rainEl.style.width = dim.width + 'px';
  ////rainEl.style.height = dim.height + 'px';
  //rainEl.style.height = 2048 + 'px';

  //if (dim.width < 650) {
  //  theme.fontSize = 10;
  //}

  //const rainer = new Rainer({
  //  sourceType: 'github',
  //  githubUsername: 'anderspitman',
  //  domElementId: 'rain-container',
  //  theme,
  //});


  //const client = await new ClientBuilder()
  //  .authKey(key)
  //  .port(9001)
  //  .secure(false)
  //  .build();

  //const metaStream = await client.getMetaStream('/');

  //metaStream.onData((data) => {
  //  console.log(data);
  //});

  //metaStream.request(100);

})();
