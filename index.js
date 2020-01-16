//import { ClientBuilder } from '/client/dist/bundle.esm.js';
//import { ClientBuilder } from config.remooseRoot + '/client/dist/bundle.esm.js';

import { Navbar, FeedHeader, Feed, Entry } from './components/core.js';
import { Tutorials } from './components/tutorials.js';
import { About } from './components/about.js';
import { RedpillView } from './components/redpill.js';
//import { Rainer } from './lib/redpill/index.js';

const config = {
  remooseRoot: 'http://localhost:9001',
  rootPath: '/req/anderspitman.net/',
};


(async () => {
  //const { ClientBuilder } = await import(config.remooseRoot + '/client/dist/bundle.esm.js');

  const state = {
    entries: {},
    promiseEntries: [],
  };

  const key = document.cookie.split('=')[1];

  //const rootDir = config.remooseRoot + '/entries';
  const rootDir = config.rootPath + 'entries';

  const result = await fetch(rootDir + '/remfs.json');
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
    //.filter(name => tree.children[name].metadata.publish !== false)
    .sort(naturalSorter.compare)
    .reverse();

  const sortedEntries = sortedNames
    .map(name => tree.children[name]);

  const entryNameOffset = config.rootPath.split('/').length - 1;

  const dom = document.createElement('div');
  dom.classList.add('main');


  const navbar = Navbar(config);
  navbar.addEventListener('feed', () => {
    goTo(config.rootPath + 'feed/');
  });
  navbar.addEventListener('tutorials', () => {
    goTo(config.rootPath + 'tutorials/');
  });
  navbar.addEventListener('about', () => {
    goTo(config.rootPath + 'about/');
  });
  dom.appendChild(navbar);

  async function navigate(atStart) {

    const oldContent = dom.querySelector('.content');
    if (oldContent) {
      dom.removeChild(oldContent);
    }

    const content = document.createElement('div');
    content.classList.add('content');
    dom.appendChild(content);

    if (window.location.pathname === config.rootPath) {
      if (!atStart) {
        goTo(config.rootPath + 'feed/');
      }
    }
    else if (window.location.pathname === config.rootPath + 'feed/' ||
             window.location.pathname === config.rootPath + 'tutorials/') {

      fetchMissingEntries();

      const fullscreenListener = (e) => {

        const entryMeta = e.detail.entryMeta;
        let path = config.rootPath + (entryMeta.metadata.entryId + '/');

        if (entryMeta.metadata.urlName) {
          path += entryMeta.metadata.urlName + '/';
        }

        goTo(path);
      };

      content.addEventListener('entry-fullscreen', fullscreenListener);

      if (window.location.pathname === config.rootPath + 'feed/') {

        content.appendChild(Feed(config, state.promiseEntries));
      }
      else if (window.location.pathname === config.rootPath + 'tutorials/') {

        const tutorials = sortedEntries
          .filter(e => e.ext.tags && e.ext.tags.indexOf('tutorial') > -1);

        const tutorialPromises = [];
        for (let i = 0; i < sortedEntries.length; i++) {
          const entryMeta = sortedEntries[i];

          if (entryMeta.ext.tags && entryMeta.ext.tags.indexOf('tutorial') > -1) {
            tutorialPromises.push(state.promiseEntries[i]);
          }
        }

        content.appendChild(Tutorials(tutorialPromises));
      }
    }
    else if (window.location.pathname === config.rootPath + 'about/') {
      content.appendChild(About());
    }
    else if (window.location.pathname === config.rootPath + 'projects/redpill/') {
      content.appendChild(RedpillView(content));
    }
    else {

      const parts = window.location.pathname.split('/'); 

      const entryId = parseInt(parts[entryNameOffset], 10);

      let index;
      let entryName;
      let entryMeta;

      for (let i = 0; i < sortedEntries.length; i++) {

        const entry = sortedEntries[i];

        if (entry.ext.entryId === entryId) {
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
    // atStart indicates we're at the page we started on.
    const atStart = e.state === null;
    navigate(atStart);
  });

  analytics();
  navigate();


  const root = document.getElementById('root');
  root.appendChild(dom);


  async function fetchEntry(name, entryMeta, index) {
    const metadata = entryMeta.ext;

    if (state.promiseEntries[index] === undefined) {

      const tags = entryMeta.tags;

      let path = config.rootPath + (sortedEntries.length - index) + '/';

      if (metadata.urlName) {
        path += metadata.urlName + '/';
      }

      const entry = {
        name,
        tags,
        rootDir,
        metadata,
      };

      // retrieved and rendered first.
      const fetchUri = rootDir + '/' + name + '/' + entry.metadata.contentFilename;
      const contentPromise = fetch(fetchUri)
        .then(result => result.text());

      const entryPromise = contentPromise
        .then(content => {
          entry.content = content;
          return entry;
        });

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

  function goTo(path) {
    window.history.pushState({}, "", path);
    analytics(path);
    navigate();
  }

  function analytics(path) {
    ga('set', 'page', path);
    ga('send', 'pageview');
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
