import { Main } from './components.js';


(async () => {

  const main = Main();
  const root = document.getElementById('root');
  root.appendChild(main);

  const response = await fetch('/');
  const text = await response.text();
  console.log(text);

})();
