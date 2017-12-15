export function handleAttrTextUpdate(pathNode, attrName, pattern, slots) {
  if (pathNode.hasOwnProperty(attrName)) {
    pathNode[attrName] = null;
  }
  const attrVal = pattern.reduce((text, snippet, i) => {
    return text + ((i%2==1) ? slots[snippet] : snippet)
  }, '');
  pathNode.setAttribute(attrName, attrVal);
}

export function handleAttrBooleanUpdate(pathNode, attrName, middle) {
  if (pathNode.hasOwnProperty(attrName)) {
    pathNode[attrName] = null;
  }
  if (middle) {
    pathNode.setAttribute(attrName, '');
  }
  else {
    pathNode.removeAttribute(attrName);
  }
}

export function handleAttrObjectUpdate(pathNode, attrName, object) {
  pathNode[attrName] = object;
  pathNode.removeAttribute(attrName);
}