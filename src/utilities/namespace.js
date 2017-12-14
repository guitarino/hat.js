export function createSeparator() {
  return (
    'sandboxseparator' + (new Date()).getTime()
  )
}

export function createIdSeparator(Separator, id) {
  return (
    Separator + '_' + id + '_'
  )
}

export function createIdSeparatorRegExp(Separator) {
  return (
    new RegExp(Separator + '_(\\d+)_')
  );
}