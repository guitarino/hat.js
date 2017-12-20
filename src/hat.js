import { HatDOM } from './hat-dom';
import { withKey } from './keyedSlot';

export function hat(snippets, ...slots) {
  return new HatDOM(
    snippets,
    slots
  );
}

export { withKey };