import { hat } from '../src/hat';

const root = document.getElementById('root');

const className = 'className';
const textContent = 'textContent';
const commentContent = 'commentContent';

function tmpl({ className, textContent, something, commentContent }) {
  return hat`
    <div class='hat__className--start hat__className--${className} hat__className--end'>
      Text content: ${textContent}
      <div>Kirill</div>
      <div id='testdiv' someThing=${something}>Exciting</div>
      <!-- Some comment content: ${commentContent} -->
    </div>
  `;
}

tmpl({
  className: 'className',
  textContent: 'textContent',
  commentContent: 'commentContent',
  something: 'great!'
}).render(document.body);

/*
setTimeout(() => {
  tmpl({
    className: 'className1',
    textContent: 'textContent2',
    commentContent: 'commentContent3',
    something: () => 'test'
  }).render(document.body);
}, 2000);
*/