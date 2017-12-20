import { KeyedSlot, withKey } from '../keyedSlot';
import {
  getCommonParent,
  insertAfter,
  removeBetween
} from '../utilities/dom';
import { handleSlot } from './slot.handlers';

const GeneraltedKeyPrefix = 'HatGeneratedKey';

const BeforePathProperty = Symbol();
const AfterPathProperty = Symbol();
const SlotArgProperty = Symbol();

const SlotControlIgnore = new WeakMap();
const SlotControlObjects = new WeakMap();
const KeyedSlots = new WeakMap();

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
    const parent = getCommonParent(before, after).parent;
    const input = slots[this[SlotArgProperty]];

    const takenKeys = [];
    let lastKey = 0;

    // Firstly, make sure that every slot is an array
    // Secondly, make sure that every element has its own key
    const keySlots = (Array.isArray(input) ? input : [ input ])
      .map((renderSlot) => {
        let keySlot = renderSlot;
        
        if (!(
          renderSlot instanceof KeyedSlot
        ) || (
          ~takenKeys.indexOf(keySlot.key)
        )) {
          let generatedKey;

          // This will make sure the generated keys aren't duplicated
          do {
            generatedKey = GeneraltedKeyPrefix + lastKey;
            lastKey++;
          }
          while (~takenKeys.indexOf(generatedKey));

          // This will actually created keyed slot
          keySlot = withKey(
            generatedKey,
            (
              renderSlot instanceof KeyedSlot ?
              keySlot.renderSlot :
              renderSlot
            )
          );
        }
        else {
          keySlot = withKey(
            keySlot.key,
            keySlot.renderSlot
          );
        }

        return keySlot;
      })
    ;
    
    // Storing the key slots on the before node
    const pastKeySlots = KeyedSlots.get(before) || [];
    const pastKeySlotsUsedKeys = [];

    let start = before;
    keySlots.forEach((keySlot, i) => {
      let pastSlot, j, beforeSlot, afterSlot, parentInfo;
      
      // Collecting info about whether there was the same key in the past
      for (j=0; j<pastKeySlots.length; j++) {
        if (pastKeySlots[j].key === keySlot.key) {
          pastSlot = pastKeySlots[j];
          beforeSlot = pastSlot.beforeSlot;
          afterSlot = pastSlot.afterSlot;
          parentInfo = getCommonParent(beforeSlot, afterSlot);
          pastKeySlotsUsedKeys.push(j);
          break;
        }
      }

      // If there was a key and if their position is different, move
      if (pastSlot) {
        if (i !== j) {
          parentInfo.siblings.slice(
            parentInfo.indexBefore,
            parentInfo.indexAfter + 1
          ).reverse().forEach((child) => {
            insertAfter(start, child);
          })
        }
      }

      // Otherwise, if no past slots existed, create before and after nodes
      else {
        beforeSlot = document.createTextNode('');
        afterSlot = document.createTextNode('');
        insertAfter(start, beforeSlot);
        insertAfter(beforeSlot, afterSlot);
      }

      // We'll need those for future updates
      keySlot.beforeSlot = beforeSlot;
      keySlot.afterSlot = afterSlot;

      // This will render hat, text node, etc.
      handleSlot(beforeSlot, afterSlot, keySlot.renderSlot);

      // We'll begin appending elements to the end
      start = afterSlot;
    });

    // Removing those key slots that weren't used
    if (pastKeySlotsUsedKeys.length < pastKeySlots.length) {
      pastKeySlots.forEach((keySlot, j) => {
        if (!~pastKeySlotsUsedKeys.indexOf(j)) {
          removeBetween(
            keySlot.beforeSlot,
            keySlot.afterSlot,
            true
          )
        }
      });
    }

    KeyedSlots.set(before, keySlots);
  }
}