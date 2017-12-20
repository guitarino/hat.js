import { hat, withKey } from '../src/hat';

const root = document.getElementById('root');

const className = 'className';
const textContent = 'textContent';
const commentContent = 'commentContent';

function tmpl({ className, textContent, something, commentContent }) {
  return hat`
    <div class='hat__className--start hat__className--${className} hat__className--end'>
      Text content: ${textContent}
      Same text content: ${textContent}
      <div>Kirill</div>
      <div id='testdiv' something=${something}>Exciting</div>
      <!-- Some comment content: ${commentContent} -->
    </div>
  `;
}

tmpl({
  className: 'className',
  textContent: hat`<span style='color: green'>${[
    withKey(0, 'test0'),
    withKey(1, 'test1'),
    withKey(2, 'test2'),
  ]}</span>`,
  commentContent: 'commentContent',
  something: 'great!'
}).render(document.body);

setTimeout(() => {
  tmpl({
    className: 'className',
    textContent: hat`<span style='color: red'>test</span>`,
    commentContent: 'commentContent',
    something: { object: 'great!' }
  }).render(document.body);
}, 2000);