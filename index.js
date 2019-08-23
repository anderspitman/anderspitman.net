//import { ClientBuilder } from '/client/dist/bundle.esm.js';
//import { ClientBuilder } from config.libHostAddress + '/client/dist/bundle.esm.js';

import { Main } from './components.js';

(async () => {
  const { ClientBuilder } = await import(config.libHostAddress + '/client/dist/bundle.esm.js');

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

  const entries = [];

  for (const name of sortedNames) {

    const entry = {
      name,
      rootDir,
    };

    let result = await fetch(rootDir + '/' + name + '/metadata.json');
    entry.metadata = await result.json();

    result = await fetch(rootDir + '/' + name + '/' + entry.metadata.contentFilename);
    entry.content = await result.text();

    entries.push(entry);
  }

  //console.log(entries);




  const main = Main(entries);
  const root = document.getElementById('root');
  root.appendChild(main);

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
