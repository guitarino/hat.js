export function handleAttrTextUpdate(pathNode, attrName, pattern, slots) {
  if ((
    pathNode.hasOwnProperty(attrName)
  ) && (
    pathNode[attrName] !== null
  )) {
    pathNode[attrName] = null;
  }
  
  const attrVal = pattern.reduce((text, snippet, i) => {
    return text + ((i%2==1) ? slots[snippet] : snippet)
  }, '');
  
  const currentAttribute = pathNode.getAttribute(attrName);

  if (currentAttribute !== attrVal) {
    pathNode.setAttribute(attrName, attrVal);
  }
}

export function handleAttrBooleanUpdate(pathNode, attrName, middle) {
  if ((
    pathNode.hasOwnProperty(attrName)
  ) && (
    pathNode[attrName] !== null
  )) {
    pathNode[attrName] = null;
  }

  const currentAttribute = pathNode.getAttribute(attrName);
  if (middle) {
    if (currentAttribute !== '') {
      pathNode.setAttribute(attrName, '');
    }
  }
  else {
    if (currentAttribute !== null) {
      pathNode.removeAttribute(attrName);
    }
  }
}

export function handleAttrObjectUpdate(pathNode, attrName, object) {
  if (pathNode[attrName] !== object) {
    pathNode[attrName] = object;
  }
  if (currentAttribute !== null) {
    pathNode.removeAttribute(attrName);
  }
}