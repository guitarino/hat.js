const TemplateProperty = Symbol();
const SlotsProperty = Symbol();

export class HatDOM {
  constructor(template, slots) {
    this[TemplateProperty] = template;
    this[SlotsProperty] = slots;
  }
}