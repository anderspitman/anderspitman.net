const MAX_ENTRY_HEIGHT = 300;

marked.setOptions({
  highlight: function(code, lang) {
    const highlighted = hljs.highlightAuto(code);
    //console.log(highlighted);
    return `<div class='code-block'>${highlighted.value}</div>`;
  },
});


const Navbar = () => {
  const dom = document.createElement('nav');
  dom.classList.add('semi-transparent');

  //const homeButton = document.createElement('a');
  //homeButton.href = config.rootPath;
  //homeButton.textContent = "Home";
  //homeButton.addEventListener('click', (e) => {
  //  e.preventDefault();
  //  dom.dispatchEvent(new CustomEvent('home', {
  //    bubbles: true,
  //  }));
  //});
  //dom.appendChild(homeButton);

  const feedButton = document.createElement('a');
  feedButton.classList.add('nav-btn');
  feedButton.href = config.rootPath + 'feed/';
  feedButton.textContent = "Feed";
  feedButton.addEventListener('click', (e) => {
    e.preventDefault();
    dom.dispatchEvent(new CustomEvent('feed', {
      bubbles: true,
    }));
  });
  dom.appendChild(feedButton);

  const tutorialsButton = document.createElement('a');
  tutorialsButton.classList.add('nav-btn');
  tutorialsButton.href = config.rootPath + 'tutorials/';
  tutorialsButton.textContent = "Tutorials";
  tutorialsButton.addEventListener('click', (e) => {
    e.preventDefault();
    dom.dispatchEvent(new CustomEvent('tutorials', {
      bubbles: true,
    }));
  });
  dom.appendChild(tutorialsButton);

  const aboutButton = document.createElement('a');
  aboutButton.classList.add('nav-btn');
  aboutButton.href = config.rootPath + 'about/';
  aboutButton.textContent = "About";
  aboutButton.addEventListener('click', (e) => {
    e.preventDefault();
    dom.dispatchEvent(new CustomEvent('about', {
      bubbles: true,
    }));
  });
  dom.appendChild(aboutButton);

  return dom;
};


const Feed = (entries) => {

  const dom = document.createElement('div');
  dom.classList.add('feed');

  const list = document.createElement('div');
  list.classList.add('entry-list');

  entries.forEach((e, index) => {
    const entry = document.createElement('div');
    entry.classList.add('entry-list__entry');
    entry.appendChild(ListEntry(e));
    list.appendChild(entry);

    entry.addEventListener('fullscreen', () => {
      dom.dispatchEvent(new CustomEvent('entry-fullscreen', {
        bubbles: true,
        detail: {
          index,
        },
      }));
    });
  });
  dom.appendChild(list);

  return dom;
};


const ListEntry = (entry) => {
  const dom = document.createElement('div');
  dom.classList.add('list-entry');
  dom.classList.add('semi-transparent');

  const entryControls = document.createElement('div');
  entryControls.classList.add('list-entry__controls');
  dom.appendChild(entryControls);

  let path = config.rootPath + entry.metadata.entryId + '/';

  if (entry.metadata.urlName) {
    path += entry.metadata.urlName + '/';
  }

  const entryUrl = path;
  entryControls.innerHTML = `
    <span>${entry.name}</span>
    <a href='${entryUrl}' target='_blank' id='open-in-tab-btn' class='list-entry__control-btn'>Open in Tab</a>
    <a href='${entryUrl}' id='fullscreen-btn' class='list-entry__control-btn'>Fullscreen</a>
  `;
  entryControls.querySelector('#fullscreen-btn')
    .addEventListener('click', (e) => {

      e.preventDefault();

      dom.dispatchEvent(new CustomEvent('fullscreen', {
        bubbles: true,
        //detail: {
        //  checked: e.target.checked,
        //},
      }));
    });

  dom.appendChild(Entry(entry));

  return dom;
};


const Entry = (entry) => {

  //const start = performance.now();

  const dom = document.createElement('div');
  dom.classList.add('entry');
  dom.classList.add('semi-transparent');

  const entryHeader = document.createElement('div');
  entryHeader.classList.add('entry__header');
  dom.appendChild(entryHeader);

  const entryContent = document.createElement('div');
  entryContent.classList.add('entry__content');
  dom.appendChild(entryContent);

  if (entry.metadata.format === 'html') {

    const iframe = document.createElement('iframe');
    iframe.classList.add('entry__iframe');
    dom.appendChild(iframe);

    const path = entry.rootDir + '/' + entry.name + '/' + entry.metadata.contentFilename;
    iframe.src = path;

    iframe.onload = () => {
      const doc = iframe.contentWindow.document;
      //const link = doc.createElement('link');
      //link.setAttribute('rel', "stylesheet");
      //link.setAttribute('href', "/feeds/theme.css");

      //const last = doc.head.childNodes[0];
      //doc.head.insertBefore(link, last);

      // The extra pixels are to avoid the scroll bars
      const iframeHeight = (doc.body.scrollHeight + (doc.body.scrollHeight * 0.01));
      if (iframeHeight <= MAX_ENTRY_HEIGHT) {
        iframe.style.height = iframeHeight + 'px';
      }
      else {
        iframe.style.height = MAX_ENTRY_HEIGHT + 'px';
      }
    };
  }
  else if (entry.metadata.format === 'github-flavored-markdown') {
    entryHeader.innerHTML = `<h1>${entry.metadata.name}</h1>`;
    entryContent.innerHTML = marked(entry.content);
  }
  else {
    throw new Error("invalid format");
  }

  //const time = performance.now() - start;
  
  return dom;
};

const FeedHeader = () => {
  const h1 = document.createElement('h1');
  h1.innerHTML = "Feed";
  return h1;
};

function removeAllChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
}


export {
  Navbar, FeedHeader, Feed, Entry,
};