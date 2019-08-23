const MAX_ENTRY_HEIGHT = 300;
const rootPath = '/feeds/';

marked.setOptions({
  highlight: function(code, lang) {
    const highlighted = hljs.highlightAuto(code);
    //console.log(highlighted);
    return `<div class='code-block'>${highlighted.value}</div>`;
  },
});

const Main = (entries) => {

  const dom = document.createElement('div');
  dom.classList.add('main');

  const navbar = Navbar();
  navbar.addEventListener('home', () => {
    window.history.pushState({}, "", rootPath);
    render();
  });
  dom.appendChild(navbar);

  function render() {

    const oldContent = dom.querySelector('.content');
    if (oldContent) {
      dom.removeChild(oldContent);
    }

    const content = document.createElement('div');
    content.classList.add('content');
    dom.appendChild(content);

    if (window.location.pathname === rootPath) {
      content.appendChild(FeedHeader());
      content.appendChild(Feed(entries));

      const listener = (e) => {
        //window.history.pushState({}, "", entries[e.detail.index].name);
        
        // set url based off index, in chronological order
        window.history.pushState({}, "", entries.length - e.detail.index);
        render();
      };

      content.addEventListener('entry-fullscreen', listener);
    }
    else {
      const parts = window.location.pathname.split('/'); 
      //const entryName = parts[2];
      //const entry = entries.filter(entry => entry.name === entryName)[0];
      const entryIndex = entries.length - parts[2];
      const entry = entries[entryIndex];
      content.appendChild(Entry(entry));
    }

    window.scrollTo(0, 0);
  }

  window.addEventListener('popstate', (e) => {
    render();
  });

  render();

  return dom;
};


const Navbar = () => {
  const dom = document.createElement('nav');

  const homeButton = document.createElement('a');
  homeButton.href = '/feeds/';
  homeButton.textContent = "Home";
  homeButton.addEventListener('click', (e) => {
    e.preventDefault();
    dom.dispatchEvent(new CustomEvent('home', {
      bubbles: true,
    }));
  });
  dom.appendChild(homeButton);

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

  const entryControls = document.createElement('div');
  entryControls.classList.add('list-entry__controls');
  dom.appendChild(entryControls);
  entryControls.innerHTML = `
    <span>${entry.name}</span>
    <button id='open-in-tab-btn' class='list-entry__control-btn'>Open in Tab</button>
    <button id='fullscreen-btn' class='list-entry__control-btn'>Fullscreen</button>
  `;
  entryControls.querySelector('#fullscreen-btn')
    .addEventListener('click', () => {
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
  Main,
  Feed,
};
