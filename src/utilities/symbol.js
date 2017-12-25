let counter = 0;
const key_prefix = '_symbol';

export function Symbol() {
  return (key_prefix + Math.random()) + (counter++);
};