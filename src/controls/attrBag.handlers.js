import {
  handleAttrBooleanUpdate,
  handleAttrObjectUpdate,
  handleAttrTextUpdate
} from './attr.handlers';

const CurrentAttributeBags = new WeakMap();

export function handleAttrBagUpdate(pathNode, nextAttributeBag) {
  const currentAttributeBag = CurrentAttributeBags.get(pathNode) || {};
  const attributeBag = {};

  for (var attrName in currentAttributeBag) {
    if ((
      currentAttributeBag.hasOwnProperty(attrName)
    ) && (
      !nextAttributeBag.hasOwnProperty(attrName)
    )) {
      handleAttrBooleanUpdate(pathNode, attrName, null);
    }
  }

  for (var attrName in nextAttributeBag) {
    if (nextAttributeBag.hasOwnProperty(attrName)) {
      // If an attribute is hardcoded, it cannot be overwritten
      // by an attribute bag
      if (!(
        pathNode.hasAttribute(attrName)
      ) || (
        currentAttributeBag.hasOwnProperty(attrName)
      )) {
        const attrVal = nextAttributeBag[attrName];
        attributeBag[attrName] = attrVal;
        if (
          typeof attrVal === 'function' ||
          typeof attrVal === 'object' &&
          attrVal !== null
        ) {
          handleAttrObjectUpdate(pathNode, attrName, attrVal);
        }
        else if (
          typeof attrVal === 'boolean' ||
          attrVal == null
        ) {
          handleAttrBooleanUpdate(pathNode, attrName, attrVal);
        }
        else {
          handleAttrTextUpdate(pathNode, attrName, ['','0',''], [''+attrVal]);
        }
      }
    }
  }

  CurrentAttributeBags.set(pathNode, attributeBag);
}