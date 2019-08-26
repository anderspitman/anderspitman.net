//import { ClientBuilder } from '/client/dist/bundle.esm.js';
//import { ClientBuilder } from config.libHostAddress + '/client/dist/bundle.esm.js';

import { Navbar, About, FeedHeader, Feed, Entry } from './components.js';

(async () => {
  const { ClientBuilder } = await import(config.libHostAddress + '/client/dist/bundle.esm.js');

  const state = {
    entries: {},
  };

  const key = document.cookie.split('=')[1];

  const rootDir = config.libHostAddress + '/entries';

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
    else if (window.location.pathname === config.rootPath + 'feed/') {

      for (const name of sortedNames) {

        const metadata = tree.children[name].metadata;
        const entryId = metadata.entryId;

        if (state.entries[entryId] === undefined) {

          const entry = {
            name,
            rootDir,
          };

          entry.metadata = metadata;

          const result = await fetch(rootDir + '/' + name + '/' + entry.metadata.contentFilename);
          entry.content = await result.text();

          state.entries[entryId] = entry;
        }
      }

      content.appendChild(FeedHeader());
      const entryList = Object.keys(state.entries)
        .sort()
        .reverse()
        .map(entryId => state.entries[entryId]);

      content.appendChild(Feed(entryList));

      const listener = (e) => {
        //window.history.pushState({}, "", entries[e.detail.index].name);
        
        // set url based off index, in chronological order
        // TODO: make sure entryList is still valid when this callback is invoked
        window.history.pushState({}, "", config.rootPath + (entryList.length - e.detail.index) + '/');
        navigate();
      };

      content.addEventListener('entry-fullscreen', listener);
    }
    else if (window.location.pathname === '/about/') {
      content.appendChild(About());
    }
    else {

      const parts = window.location.pathname.split('/'); 

      const entryId = parseInt(parts[entryNameOffset], 10);

      if (state.entries[entryId] === undefined) {
        const entry = {
          name,
          rootDir,
        };

        let entryName = null;
        let metadata = null;
        for (const key in tree.children) {
          const entry = tree.children[key];
          if (entry.metadata.entryId === entryId) {
            entryName = key;
            metadata = entry.metadata;
          }
        }

        entry.metadata = metadata;
        const result = await fetch(rootDir + '/' + entryName + '/' + entry.metadata.contentFilename);
        entry.content = await result.text();

        state.entries[entryId] = entry;
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
