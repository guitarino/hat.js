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

export function getCommonParent(before, after) {
  const parent = before.parentNode;

  const siblings = [ ...parent.childNodes ];
  const indexBefore = siblings.indexOf(before);
  const indexAfter = siblings.indexOf(after);

  if (!(~indexBefore && ~indexAfter && indexBefore < indexAfter)) {
    throw new Error('cannot render; both nodes should be under the same parent first before second');
  }

  return {
    parent: parent,
    siblings: siblings,
    indexBefore: indexBefore,
    indexAfter: indexAfter
  };
}

export function removeFromParent(parentInfo, including = false) {
  parentInfo.siblings.slice(
    parentInfo.indexBefore + (including ? 0 : 1),
    parentInfo.indexAfter + (including ? 1 : 0)
  ).forEach((child) => {
    parentInfo.parent.removeChild(
      child
    )
  })
}

export function removeBetween(before, after, including) {
  const parentInfo = getCommonParent(before, after);
  removeFromParent(parentInfo, including);
}