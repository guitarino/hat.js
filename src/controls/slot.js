const PathProperty = Symbol();
const ArgProperty = Symbol();

const IsFollowedBySlot = new WeakMap();
const IsPrecededBySlot = new WeakMap();
const Arg = new WeakMap();

export function addSlotControl(path, node, controls, separatorRegExp) {
  if (IsFollowedBySlot.has(node)) {
    controls.push(new SlotControl(
      path,
      Arg.get(node)
    ));
    IsFollowedBySlot.delete(node);
    Arg.delete(node);
  }
  else if (IsPrecededBySlot.has(node)) {
    IsFollowedBySlot.delete(node);
  }
  else {
    const split = node.textContent.split(separatorRegExp);
    node.textContent = split[0];
    for (var j=1; j<split.length; j++) {
      let newNode;
      if (j%2==0) {
        newNode = document.createTextNode(split[j]);
        IsPrecededBySlot.set(newNode, true);
      }
      else {
        newNode = document.createTextNode('');
        IsFollowedBySlot.set(newNode, true);
        Arg.set(newNode, split[j]);
      }
      node.parentNode.insertBefore(
        newNode,
        node.nextSibling
      );
    }
  }
}

export class SlotControl {
  constructor(path, arg) {
    this[PathProperty] = path;
    this[ArgProperty] = arg;
  }
}