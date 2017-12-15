import {
  iterateDeepChildren,
  insertAfter
} from './utilities/dom';

const TemplateProperty = Symbol();
const SlotsProperty = Symbol();

const NodeTemplate = new WeakMap();
const PathNodes = new WeakMap();

export class HatDOM {
  constructor(template, slots) {
    this[TemplateProperty] = template;
    this[SlotsProperty] = slots;
  }

  render(parent) {
    const template = this[TemplateProperty];
    let element1 = parent.firstChild;
    let element2 = parent.lastChild;
    if ((
      !element1 || NodeTemplate.get(element1) !== template
    ) || (
      !element2 || NodeTemplate.get(element2) !== template
    )) {
      element1 = document.createTextNode('');
      element2 = document.createTextNode('');
      parent.insertBefore(element1, parent.firstChild);
      parent.appendChild(element2);
    }
    return this.renderBetween(element1, element2);
  }

  renderBetween(element1, element2) {
    const template = this[TemplateProperty];
    const parent = element1.parentNode;

    const siblings = [ ...parent.childNodes ];
    const index1 = siblings.indexOf(element1);
    const index2 = siblings.indexOf(element2);

    if (!(~index1 && ~index2 && index1 < index2)) {
      throw new Error('cannot render; both nodes should be under the same parent first before second');
    }

    let pathNodes = PathNodes.get(element1);

    if ((
      NodeTemplate.get(element1) !== template
    ) || (
      NodeTemplate.get(element2) !== template
    ) || (
      !pathNodes
    )) {
      NodeTemplate.set(element1, template);
      NodeTemplate.set(element2, template);

      while (element1.nextSibling !== element2) {
        parent.removeChild(element1.nextSibling);
      }

      const clone = template.getClone();
      const paths = [];
      template.getControls().forEach((control) => {
        control.getPaths().forEach((path) => {
          if (!~paths.indexOf(path)) {
            paths.push(path);
          }
        })
      });

      pathNodes = {};
      iterateDeepChildren(clone, (node, i) => {
        if (~paths.indexOf(i)) {
          pathNodes[i] = node;
        }
      });

      PathNodes.set(element1, pathNodes);
      console.log('@pathNodes', pathNodes);

      while (clone.lastChild) {
        insertAfter(element1, clone.lastChild);
      }
    }

    template.getControls().forEach((control) => {
      control.update(pathNodes, this[SlotsProperty]);
    });
  }
}