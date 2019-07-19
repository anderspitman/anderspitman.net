const Main = (entries) => {
  const dom = document.createElement('div');

  dom.classList.add('main');

  dom.appendChild(Header());
  dom.appendChild(Feed(entries));

  return dom;
};

const Feed = (entries) => {

  const dom = document.createElement('div');
  dom.classList.add('feed');

  const list = document.createElement('div');
  list.classList.add('entry-list');

  entries.forEach((e) => {
    const entry = document.createElement('div');
    entry.classList.add('entry-list__entry');
    entry.appendChild(Entry(e));
    list.appendChild(entry);
  });
  dom.appendChild(list);

  return dom;
};


const Entry = (entry) => {
  const dom = document.createElement('div');
  dom.classList.add('entry');

  if (entry.metadata.format === 'html') {
    const path = entry.rootDir + '/' + entry.name;
    dom.innerHTML = entry.content.replace("src='", `src='${path}/`);
  }
  else {
    throw new Error("invalid format");
  }
  
  return dom;
};

const Header = () => {
  const h1 = document.createElement('h1');
  h1.innerHTML = "Feeds";
  return h1;
};


export {
  Main,
  Feed,
};
