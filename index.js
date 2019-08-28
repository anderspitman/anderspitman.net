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
  };

  const key = document.cookie.split('=')[1];

  //const rootDir = config.remooseRoot + '/entries';
  const rootDir = '/entries';

  const result = await fetch(rootDir);
  const tree = await result.json();

  console.log(tree);

  // sort in reverse-chronological order
  let sortedNames = Object.keys(tree.children)
    .sort()
    .reverse();

  console.log(sortedNames);


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

      await fetchMissingEntries();

      //content.appendChild(FeedHeader());

      const entryList = Object.keys(state.entries)
        .sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        })
        .reverse()
        .map(entryId => state.entries[entryId]);

      const listener = (e) => {
        //window.history.pushState({}, "", entries[e.detail.index].name);
        
        // set url based off index, in chronological order
        // TODO: make sure entryList is still valid when this callback is invoked
        const index = e.detail.index;
        let path = config.rootPath + (entryList.length - index) + '/';

        if (entryList[index].metadata.urlName) {
          path += entryList[index].metadata.urlName + '/';
        }

        window.history.pushState({}, "", path);
        navigate();
      };

      content.addEventListener('entry-fullscreen', listener);

      if (window.location.pathname === config.rootPath + 'feed/') {

        content.appendChild(Feed(entryList));
      }
      else if (window.location.pathname === '/tutorials/') {

        const tutorials = entryList
          .filter(e => e.tags && e.tags.indexOf('tutorial') > -1);

        console.log(tutorials);

        content.appendChild(Tutorials(tutorials));
      }
    }
    else if (window.location.pathname === '/about/') {
      content.appendChild(About());
    }
    else {

      const parts = window.location.pathname.split('/'); 

      const entryId = parseInt(parts[entryNameOffset], 10);
      const index = sortedNames.length - entryId;

      if (state.entries[entryId] === undefined) {

        let entryName;
        for (const key in tree.children) {
          const entry = tree.children[key];
          if (entry.metadata.entryId === entryId) {
            entryName = key;
          }
        }

        await fetchEntry(entryName, index);
      }

      content.appendChild(Entry(state.entries[entryId]));
    }

    window.scrollTo(0, 0);
  }

  window.addEventListener('popstate', (e) => {
    navigate();
  });

  navigate();


  const root = document.getElementById('root');
  root.appendChild(dom);


  async function fetchEntry(name, index) {
    const metadata = tree.children[name].metadata;
    const entryId = metadata.entryId;

    if (state.entries[entryId] === undefined) {

      const tags = tree.children[name].tags;

      let path = config.rootPath + (sortedNames.length - index) + '/';

      if (metadata.urlName) {
        path += metadata.urlName + '/';
      }

      const entry = {
        name,
        rootDir,
        path,
        entryId,
        metadata,
        tags,
        index,
      };

      const result = await fetch(rootDir + '/' + name + '/' + entry.metadata.contentFilename);
      entry.content = await result.text();

      state.entries[entryId] = entry;
    }
  }

  async function fetchMissingEntries() {

    //for (const name of sortedNames) {
    for (let i = 0; i < sortedNames.length; i++) {
      const name = sortedNames[i];
      await fetchEntry(name, i);
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
