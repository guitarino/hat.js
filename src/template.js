import {
  createSeparator,
  createIdSeparator,
  createIdSeparatorRegExp
} from './utilities/namespace';
import {
  nodeDeepClone,
  iterateDeepChildren,
  createDomFromHtml
} from './utilities/dom';
import { addSlotControl } from './controls/slot';
import { addCommentControl } from './controls/comment';
import { addAttrControl } from './controls/attr';
import { addAttrBagControl } from './controls/attrBag';
import { Symbol } from './utilities/symbol';

const DomProperty = Symbol();
const ControlsProperty = Symbol();

export class Template {
  constructor(dom, controls) {
    this[DomProperty] = dom;
    this[ControlsProperty] = controls;
  }

  getClone() {
    return nodeDeepClone(this[DomProperty]);
  }

  getControls() {
    return this[ControlsProperty];
  }
}

const Separator = createSeparator();
const SeparatorIdRegExp = createIdSeparatorRegExp(Separator);

export function createTemplate(snippets, parentTagName) {
  const slotLength = snippets.length - 1;
  
  let htmlContent = '';

  for (var i=0; i<slotLength; i++) {
    htmlContent += snippets[i] + createIdSeparator(Separator, i);
  }
  
  htmlContent += snippets[snippets.length - 1];

  const dom = createDomFromHtml(htmlContent, parentTagName);
  const controls = [];
  let counter = 0;

  iterateDeepChildren(dom, (node, i) => {
    console.log('a' + counter++, node.outerHTML || node.textContent);
    if (node.nodeType === Node.TEXT_NODE || (
      node.nodeType === Node.COMMENT_NODE &&
      node.treatAsTextNode
    )) {
      addSlotControl(i, node, controls, SeparatorIdRegExp);
    }
    else if (node.nodeType === Node.COMMENT_NODE) {
      addCommentControl(i, node, controls, SeparatorIdRegExp);
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
      addAttrBagControl(i, node, controls, SeparatorIdRegExp);
      addAttrControl(i, node, controls, SeparatorIdRegExp);
    }
  });

  return new Template(
    dom,
    controls
  );
}