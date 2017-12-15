const doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const div = doc.createElement('div');

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

export function createDomFromHtml(html) {
  div.innerHTML = html;
  const fragParent = document.createElement('div');
  while (div.firstChild) {
    fragParent.appendChild(div.firstChild);
  }
  return fragParent;
}

export function insertAfter(element, newElement) {
  element.parentNode.insertBefore(newElement, element.nextSibling);
}