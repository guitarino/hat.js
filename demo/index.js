import { hat } from '../src/hat';

const root = document.getElementById('root');

function rootTemplate({ input }) {
  return hat`
    <input id='input' type='text' value=${input} />
    <div class='value'>${
      !input ? hat`
        <span style='color: red; font-weight: bold;'>
          Please, start typing to see the result
        </span>
      ` : input
    }</div>
  `;
}

rootTemplate({ input: '' }).render(root);
const input = document.getElementById('input');
input.addEventListener('input', () => {
  rootTemplate({ input: input.value }).render(root);
});