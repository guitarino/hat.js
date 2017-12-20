export class KeyedSlot {
  constructor(key, renderSlot) {
    this.key = key;
    this.renderSlot = renderSlot;
  }
}

export function withKey(key, renderSlot) {
  return new KeyedSlot(key, renderSlot);
}