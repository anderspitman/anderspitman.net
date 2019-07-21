
marked.setOptions({
  highlight: function(code, lang) {
    const highlighted = hljs.highlightAuto(code).value;
    return highlighted;
  },
});


const MAX_ENTRY_HEIGHT = 300;

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
    console.log(marked);
    dom.innerHTML = marked(entry.content);
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
