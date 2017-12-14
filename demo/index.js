import { hat } from '../src/hat';

const className = 'className';
const textContent = 'textContent';
const commentContent = 'commentContent';

console.log(hat`
  <div class='hat__className--start hat__className--${className} hat__className--end'>
    Text content: ${textContent}
    <!-- Some comment content: ${commentContent} -->
  </div>
`);