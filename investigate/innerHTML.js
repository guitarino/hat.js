const html_tags = [
  'my-tag', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article',
  'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound',
  'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas',
  'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command',
  'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
  'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed',
  'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form',
  'frame', 'frameset', 'h1', 'head', 'header', 'hgroup', 'hr', 'html',
  'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd',
  'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map',
  'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol',
  'nav', 'nextid', 'nobr', 'noembed', 'noframes', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
  'picture', 'plaintext', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc',
  'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow',
  'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong',
  'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td',
  'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title',
  'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'
];

var pass = [];

var result = document.getElementById('result');
var table = document.getElementById('table');

var str = '';
var counter = 0;

var best_parent;
var best_parent_competitors = [];
var best_parent_score = -1;

html_tags.forEach(function (parentTag) {
  var parent_score = 0;
  html_tags.forEach(function (childTag) {
    var parent = document.createElement(parentTag);
    var expectedInnerHTML = '<' + childTag + '></' + childTag + '>';
    parent.innerHTML = expectedInnerHTML;
    var resultInnerHTML = parent.innerHTML;
    var resultTagName = parent && parent.firstChild && parent.firstChild.tagName && parent.firstChild.tagName.toLowerCase();
    if (expectedInnerHTML !== resultInnerHTML || resultTagName !== childTag) {
      pass.push(false);
//      str += (counter++) + '. ' + parentTag + ' with ' + childTag + ': ' + expectedInnerHTML + ' --- ' + resultInnerHTML + '\n';
    }
    else {
      parent_score++;
      pass.push(true);
    }
  });
  if (parent_score === best_parent_score) {
    best_parent_competitors.push(parentTag);
  }
  else if (parent_score > best_parent_score) {
    best_parent_competitors = [];
    best_parent_score = parent_score;
    best_parent = parentTag;
  }
});

console.log(html_tags.length);

console.log(best_parent, best_parent_score, best_parent_competitors);

counter = 0;
table.innerHTML = '<tr><td></td>' + html_tags.reduce(function (html, childTag) {
  return html + '<td>' + childTag + '</td>';
}, '') + '</tr>';
html_tags.forEach(function (parentTag) {
  var trow = document.createElement('tr');
  trow.innerHTML = '<td>' + parentTag + '</td>';
  html_tags.forEach(function (childTag) {
    var tcell = document.createElement('td');
    tcell.textContent = parentTag + ' > ' + childTag;
    tcell.className = 'pass-' + (pass[counter++]);
    trow.appendChild(tcell);
  });
  table.appendChild(trow);
});

result.textContent = str;