const Tutorials = (tutList) => {
  const dom = document.createElement('div');

  const ul = document.createElement('ul');

  for (const tut of tutList) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', tut.path);
    a.innerHTML = tut.name + " | <strong>" + tut.metadata.title + "</strong>";

    a.addEventListener('click', (e) => {
      e.preventDefault();
      dom.dispatchEvent(new CustomEvent('entry-fullscreen', {
        bubbles: true,
        detail: {
          index: tut.index,
        },
      }));
    });

    li.appendChild(a);
    ul.appendChild(li);
  }
  dom.appendChild(ul);

  return dom;
};

export {
  Tutorials,
};
