import { hat } from '../src/hat';

const root = document.getElementById('root');

const className = 'className';
const textContent = 'textContent';
const commentContent = 'commentContent';

const tmpl = hat`
  <div class='hat__className--start hat__className--${className} hat__className--end'>
    Text content: ${textContent}
    <!-- Some comment content: ${commentContent} -->
  </div>
`;

tmpl.render(document.body);