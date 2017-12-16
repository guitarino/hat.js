const BeforePathProperty = Symbol();
const AfterPathProperty = Symbol();
const SlotArgProperty = Symbol();

const SlotControlIgnore = new WeakMap();
const SlotControlObjects = new WeakMap();

export function addSlotControl(path, node, controls, separatorRegExp) {
  if (SlotControlIgnore.has(node)) {
    SlotControlIgnore.delete(node);
  }

  else if (SlotControlObjects.has(node)) {
    const slotObject = SlotControlObjects.get(node);
    SlotControlObjects.delete(node);

    if (slotObject.before === node) {
      slotObject.before = path;
    }

    else if (slotObject.after === node) {
      slotObject.after = path;
      controls.push(new SlotControl(
        slotObject.before,
        slotObject.after,
        slotObject.slotArg
      ));
    }
  }

  else {
    const parent = node.parentNode;
    const split = node.textContent.split(separatorRegExp);
    node.textContent = split[0];

    for (var j=1; j<split.length; j++) {
      if (j%2==1) {
        let before = document.createTextNode('');
        let after = document.createTextNode('');

        const slotObject = {
          before: before,
          after: after,
          slotArg: split[j]
        };

        SlotControlObjects.set(before, slotObject);
        SlotControlObjects.set(after, slotObject);

        parent.insertBefore(after, node.nextSibling);
        parent.insertBefore(before, after);
      }

      else {
        let newNode = document.createTextNode(split[j]);
        SlotControlIgnore.set(newNode, true);

        parent.insertBefore(newNode, node.nextSibling);
      }
    }
  }
}

export class SlotControl {
  constructor(beforePath, afterPath, slotArg) {
    this[BeforePathProperty] = beforePath;
    this[AfterPathProperty] = afterPath;
    this[SlotArgProperty] = slotArg;
  }

  getPaths() {
    return [
      this[BeforePathProperty],
      this[AfterPathProperty]
    ]
  }

  update(pathNodes, slots) {
    const before = pathNodes[this[BeforePathProperty]];
    const after = pathNodes[this[AfterPathProperty]];
  }
}