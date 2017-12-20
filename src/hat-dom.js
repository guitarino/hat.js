import {
  iterateDeepChildren,
  insertAfter
} from './utilities/dom';

import { createTemplate } from './template';

const SnippetsProperty = Symbol();
const SlotsProperty = Symbol();

const TemplateMaps = new WeakMap();
const NodeTemplate = new WeakMap();
const PathNodes = new WeakMap();

export class HatDOM {
  constructor(snippets, slots) {
    this[SnippetsProperty] = snippets;
    this[SlotsProperty] = slots;
  }

  getTemplate(parent) {
    const parentTagName = (
      parent &&
      parent.tagName &&
      parent.tagName.toLowerCase() ||
      'div' // default to a div
    );

    const snippets = this[SnippetsProperty];
    
    let TemplateMap = TemplateMaps.get(snippets);

    if (!TemplateMap) {
      TemplateMap = {};
      TemplateMaps.set(snippets, TemplateMap);
    }

    if (!TemplateMap[parentTagName]) {
      TemplateMap[parentTagName] = createTemplate(snippets, parentTagName);
    }

    return TemplateMap[parentTagName];
  }

  render(parent) {
    const template = this.getTemplate(parent);
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
    const parent = element1.parentNode;

    const siblings = [ ...parent.childNodes ];
    const index1 = siblings.indexOf(element1);
    const index2 = siblings.indexOf(element2);

    if (!(~index1 && ~index2 && index1 < index2)) {
      throw new Error('cannot render; both nodes should be under the same parent first before second');
    }
    
    const template = this.getTemplate(parent);

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