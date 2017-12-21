import { handleAttrBagUpdate } from './attrBag.handlers';

const PathProperty = Symbol();
const SlotArgProperty = Symbol();

export function addAttrBagControl(path, node, controls, separatorRegExp) {
  for (var j=0; j<node.attributes.length; j++) {
    const attr = node.attributes[j];
    if (attr.name) {
      const result = separatorRegExp.exec(attr.name);
      if (result) {
        const slotArg = result[1];
        node.removeAttribute(attr.name);
        controls.push(new AttrBagControl(
          path,
          slotArg
        ));
      }
    }
  }
}

export class AttrBagControl {
  constructor(path, slotArg) {
    this[PathProperty] = path;
    this[SlotArgProperty] = slotArg;
  }

  getPaths() {
    return [
      this[PathProperty]
    ]
  }

  update(pathNodes, slots) {
    const pathNode = pathNodes[this[PathProperty]];
    const nextAttributeBag = slots[this[SlotArgProperty]];
    handleAttrBagUpdate(pathNode, nextAttributeBag);
  }
}