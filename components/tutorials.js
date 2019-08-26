const Tutorials = (tutList) => {
  const dom = document.createElement('div');

  dom.innerHTML = `
    <h1>Tuts</h1>
  `;

  const ul = document.createElement('ul');

  for (const tut of tutList) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.setAttribute('href', tut.path);
    a.textContent = tut.name + " | " + tut.metadata.name;

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
