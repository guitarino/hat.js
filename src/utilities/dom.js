export function getNextElement(currentElement) {
  const firstChoice = (
    currentElement.firstChild ||
    currentElement.nextSibling
  );

  if (firstChoice) {
    return firstChoice;
  }

  let parent, nextSibling;
  while ((parent = currentElement.parentNode) && !(nextSibling = parent.nextSibling)) {
    currentElement = parent;
  }

  return parent && nextSibling;
}

export function iterateDeepChildren(parent, fun) {
  let i = 0;
  let currentElement = parent;
  while (
    (currentElement = getNextElement(currentElement)) &&
    currentElement !== parent
  ) {
    fun(currentElement, i++);
  }
}

export function createDomFromHtml(html, parent) {
  const parentElement = document.createElement(parent);
  parentElement.innerHTML = html;
  return parentElement;
}

export function insertAfter(element, newElement) {
  element.parentNode.insertBefore(newElement, element.nextSibling);
}