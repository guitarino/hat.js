import { hat } from '../src/hat';

const root = document.getElementById('root');

function random(max) {
  return Math.round(Math.random() * max);
}

function rootTemplate({ input }) {
  return hat`
    <input id='input' type='text' value=${input} />
    <div class='value'>${
      !input ? hat`
        <span style='color: red; font-weight: bold;'>
          Please, start typing to see the result
        </span>
      ` : hat`
        <div style='color: rgb(${random(255)}, ${random(255)}, ${random(255)});'>
          ${input}
        </div>
      `
    }</div>
  `;
}

rootTemplate({ input: '' }).render(root);
const input = document.getElementById('input');
input.addEventListener('input', () => {
  rootTemplate({ input: input.value }).render(root);
});