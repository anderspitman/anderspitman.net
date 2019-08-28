const Tutorials = (tutList) => {
  const dom = document.createElement('div');

  const ul = document.createElement('ul');
  dom.appendChild(ul);

  for (const tutPromise of tutList) {

    tutPromise.then((tut) => {

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('href', tut.path);
      a.innerHTML = tut.metadata.date + " | <strong>" + tut.metadata.title + "</strong>";

      a.addEventListener('click', (e) => {
        e.preventDefault();
        dom.dispatchEvent(new CustomEvent('entry-fullscreen', {
          bubbles: true,
          detail: {
            entryMeta: tut,
          },
        }));
      });

      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  return dom;
};

export {
  Tutorials,
};
