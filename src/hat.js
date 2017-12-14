import { createTemplate } from './template';
import { HatDOM } from './hat-dom';

const templates = new WeakMap();

export function hat(key, ...slots) {
  if (!templates.has(key)) {
    templates.set(key, createTemplate(key));
  }

  return new HatDOM(
    templates.get(key),
    slots
  );
}