export function handleCommentTextUpdate(pathNode, pattern, slots) {
  pathNode.textContent = pattern.reduce((text, snippet, i) => {
    return text + ((i%2==1) ? slots[snippet] : snippet)
  }, '');
}