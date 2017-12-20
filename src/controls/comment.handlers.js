export function handleCommentTextUpdate(pathNode, pattern, slots) {
  const textContent = pattern.reduce((text, snippet, i) => {
    return text + ((i%2==1) ? slots[snippet] : snippet)
  }, '');
  if (pathNode.textContent !== textContent) {
    pathNode.textContent = textContent;
  }
}