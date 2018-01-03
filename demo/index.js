import { hat } from '../src/hat';

const root = document.getElementById('root');

function random(max) {
  return Math.round(Math.random() * max);
}

function rootTemplate({ input, attrs }) {
  return hat`
    <input id='input' type='text' value=${input} />
    <div class='value'>${
      !input ? hat`
        <span style='color: red; font-weight: bold;'>
          Please, start typing to see the result
        </span>
      ` : hat`
        <div id='result' ${attrs}>
          ${input}
        </div>
      `
    }</div>
  `;
}

function styleTemplate({ attrs }) {
  return hat`
    <style id='root-style'>
      #static {
        ${ attrs && attrs.style }
      }
    </style>
  `
}

rootTemplate({ input: '' }).render(root);
styleTemplate({}).renderOnceUnder(document.head);
const input = document.getElementById('input');
input.addEventListener('input', () => {
  const inputStart = document.getElementById('input');
  const number = Math.random();
  const attrs = {
    style: `color: rgb(${random(255)}, ${random(255)}, ${random(255)});`
  };
  if (number > 0.5) {
    attrs.number = number;
    attrs.obj = { is: 'hello' };
  }
  rootTemplate({ input: input.value, attrs }).render(root);
  styleTemplate({ attrs }).renderOnceUnder(document.head);
  const inputEnd = document.getElementById('input');

  if (inputStart !== inputEnd) {
    console.log('something wrong');
  }
});