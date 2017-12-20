import { HatDOM } from './hat-dom';

export function hat(snippets, ...slots) {
  return new HatDOM(
    snippets,
    slots
  );
}