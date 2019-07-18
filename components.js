const Main = () => {
  const dom = document.createElement('div');

  dom.classList.add('main');
  dom.appendChild(Header());

  return dom;
};


const Header = () => {
  const h1 = document.createElement('h1');
  h1.innerHTML = "Hi there";
  return h1;
};


export { Main };
