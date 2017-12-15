const PathProperty = Symbol();
const PatternProperty = Symbol();

export function addCommentControl(path, node, controls, separatorRegExp) {
  const split = node.textContent.split(separatorRegExp);
  if (split.length > 1) {
    controls.push(new CommentControl(
      path,
      split
    ));
  }
}

export class CommentControl {
  constructor(path, pattern) {
    this[PathProperty] = path;
    this[PatternProperty] = pattern;
  }

  getPaths() {
    return [
      this[PathProperty]
    ]
  }

  update(pathNodes, slots) {
    const pattern = this[PatternProperty];
    const comment = pathNodes[this[PathProperty]];
    comment.textContent = pattern.map((txtSnippet, i) => {
      return (i%2===1) ? slots[txtSnippet] : txtSnippet;
    }).join('');
  }
}