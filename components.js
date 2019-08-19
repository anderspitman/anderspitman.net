
marked.setOptions({
  highlight: function(code, lang) {
    const highlighted = hljs.highlightAuto(code);
    //console.log(highlighted);
    return `<div class='code-block'>${highlighted.value}</div>`;
  },
});


const MAX_ENTRY_HEIGHT = 300;

const Main = (entries) => {
  const dom = document.createElement('div');

  dom.classList.add('main');

  dom.appendChild(Header());
  dom.appendChild(Feed(entries));

  dom.addEventListener('entry-fullscreen', (e) => {
    while (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
    dom.appendChild(Entry(entries[e.detail.index]));
  });

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
    entry.appendChild(Entry(e));
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


const Entry = (entry) => {
  const dom = document.createElement('div');
  dom.classList.add('entry');

  const entryControls = document.createElement('div');
  entryControls.classList.add('entry__controls');
  dom.appendChild(entryControls);
  entryControls.innerHTML = `
    <button id='fullscreen-btn'>Fullscreen</button>
    <button id='open-in-tab-btn'>Open in Tab</button>
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
