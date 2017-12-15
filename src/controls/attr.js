const PathProperty = Symbol();
const AttrNameProperty = Symbol();
const PatternProperty = Symbol();

export function addAttrControl(path, node, controls, separatorRegExp) {
  for (var j=0; j<node.attributes.length; j++) {
    const attr = node.attributes[j];
    if (attr.value) {
      const split = attr.value.split(separatorRegExp);
      if (split.length > 1) {
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
}