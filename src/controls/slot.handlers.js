import { HatDOM, clearHatDOM } from '../hat-dom';

export function handleSlot(before, after, value) {
  if (value instanceof HatDOM) {
    renderHat(before, after, value);
  }
  else {
    if (value === null || value === false) {
      renderTextNode(before, after, '');
    }
    else {
      renderTextNode(before, after, ''+value);
    }
  }
}

export function renderTextNode(before, after, textContent) {
  clearHatDOM(before, after);
  if (before.nextSibling !== after) {
    if (before.nextSibling.textContent !== textContent) {
      before.nextSibling.textContent = textContent;
    }
  }
  else {
    before.parentNode.insertBefore(
      document.createTextNode(textContent),
      before.nextSibling
    )
  }
}

export function renderHat(before, after, hat) {
  hat.renderBetween(before, after);
}