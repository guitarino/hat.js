import {
  handleAttrObjectUpdate,
  handleAttrTextUpdate,
  handleAttrBooleanUpdate
} from './attr.handlers';

const PathProperty = Symbol();
const AttrNameProperty = Symbol();
const PatternProperty = Symbol();

export function addAttrControl(path, node, controls, separatorRegExp) {
  for (var j=0; j<node.attributes.length; j++) {
    const attr = node.attributes[j];
    if (attr.value) {
      const split = attr.value.split(separatorRegExp);
      if (split.length > 1) {
        node.removeAttribute(attr.name);
        controls.push(new AttrValueControl(
          path,
          attr.name,
          split
        ));
      }
    }
  }
}

export class AttrValueControl {
  constructor(path, attrName, pattern) {
    this[PathProperty] = path;
    this[AttrNameProperty] = attrName;
    this[PatternProperty] = pattern;
  }

  getPaths() {
    return [
      this[PathProperty]
    ]
  }

  update(pathNodes, slots) {
    const path = this[PathProperty];
    const attrName = this[AttrNameProperty];
    const pattern = this[PatternProperty];
    const pathNode = pathNodes[path];

    if ((
      pattern.length === 3
    ) && (
      !pattern[0]
    ) && (
      !pattern[2]
    )) {
      const middle = slots[pattern[1]];
      if (
        typeof middle === 'function' ||
        typeof middle === 'object' &&
        middle !== null
      ) {
        handleAttrObjectUpdate(pathNode, attrName, middle);
        return;
      }
      else if (
        typeof middle === 'boolean' ||
        middle == null
      ) {
        handleAttrBooleanUpdate(pathNode, attrName, middle);
        return;
      }
    }
    handleAttrTextUpdate(pathNode, attrName, pattern, slots);
  }
}