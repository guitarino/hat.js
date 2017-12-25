import {
  iterateDeepChildren,
  insertAfter,
  getCommonParent
} from './utilities/dom';
import { createTemplate } from './template';
import { Symbol } from './utilities/symbol';
import { WeakMap } from './utilities/weakmap';

const SnipDelimiter = '<!&_snipdel' + Math.random() + '>';
const SnippetsProperty = Symbol();
const SlotsProperty = Symbol();

const TemplateMaps = {};
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
    const snipText = getSnipText(snippets);
    
    let TemplateMap = TemplateMaps[snipText];

    if (!TemplateMap) {
      TemplateMap = {};
      TemplateMaps[snipText] = TemplateMap;
      console.log(TemplateMaps);
    }

    if (!TemplateMap[parentTagName]) {
      TemplateMap[parentTagName] = createTemplate(snippets, parentTagName);
      console.log('Create template', parentTagName, TemplateMap[parentTagName]);
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
    const parent = getCommonParent(element1, element2).parent;

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
      let counter = 0;
      iterateDeepChildren(clone, (node, i) => {
        console.log('b' + counter++, node.outerHTML || node.textContent);
        if (~paths.indexOf(i)) {
          pathNodes[i] = node;
        }
      });
      console.log(pathNodes);

      PathNodes.set(element1, pathNodes);

      while (clone.lastChild) {
        insertAfter(element1, clone.lastChild);
      }
    }

    template.getControls().forEach((control) => {
      control.update(pathNodes, this[SlotsProperty]);
    });
  }
}

export function clearHatDOM(element1, element2) {
  const isHatDOM = (
    NodeTemplate.delete(element1) &&
    NodeTemplate.delete(element2) &&
    PathNodes.delete(element1)
  );

  if (isHatDOM) {
    const parent = getCommonParent(element1, element2).parent;

    while (element1.nextSibling !== element2) {
      parent.removeChild(element1.nextSibling);
    }
  }

  return isHatDOM;
}

function getSnipText(snippets) {
  let result = '';
  for (var i=0; i<snippets.length-1; i++) {
    result += snippets[i] + SnipDelimiter + i;
  }
  result += snippets[snippets.length-1];
  return result;
}