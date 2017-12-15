import {
  createSeparator,
  createIdSeparator,
  createIdSeparatorRegExp
} from './utilities/namespace';
import {
  iterateDeepChildren,
  createDomFromHtml
} from './utilities/dom';
import { addSlotControl } from './controls/slot';
import { addCommentControl } from './controls/comment';
import { addAttrControl } from './controls/attr';

const DomProperty = Symbol();
const ControlsProperty = Symbol();

export class Template {
  constructor(dom, controls) {
    this[DomProperty] = dom;
    this[ControlsProperty] = controls;
  }

  getClone() {
    return this[DomProperty].cloneNode(true);
  }

  getControls() {
    return this[ControlsProperty];
  }
}

const Separator = createSeparator();
const SeparatorIdRegExp = createIdSeparatorRegExp(Separator);

export function createTemplate(snippets) {
  const slotLength = snippets.length - 1;
  
  let htmlContent = '';

  for (var i=0; i<slotLength; i++) {
    htmlContent += snippets[i] + createIdSeparator(Separator, i);
  }
  
  htmlContent += snippets[snippets.length - 1];

  const dom = createDomFromHtml(htmlContent);
  const controls = [];

  iterateDeepChildren(dom, (node, i) => {
    if (node.nodeType === Node.TEXT_NODE) {
      addSlotControl(i, node, controls, SeparatorIdRegExp);
    }
    else if (node.nodeType === Node.COMMENT_NODE) {
      addCommentControl(i, node, controls, SeparatorIdRegExp);
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
      addAttrControl(i, node, controls, SeparatorIdRegExp);
    }
  });

  return new Template(
    dom,
    controls
  );
}