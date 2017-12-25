import { createPrivate } from './privacy';
import { Symbol } from './symbol';

const privacy = createPrivate();

function WeakMap() {
  if (!(this instanceof WeakMap)) {
    throw Error("Uncaught TypeError: Constructor WeakMap requires 'new'")
  }

  const wm = privacy.create(this);
  wm.name = Symbol();
}

WeakMap.prototype.set = function(o, value) {
  const mapList = privacy.on(o);
  const wm = privacy.get(this);
  mapList[wm.name] = value;
  return this;
};

WeakMap.prototype.get = function(o) {
  const mapList = privacy.get(o);
  if (mapList) {
    const wm = privacy.get(this);
    return mapList[wm.name];
  }
};

WeakMap.prototype.has = function(o) {
  const mapList = privacy.get(o);
  if (mapList) {
    const wm = privacy.get(this);
    return wm.name in mapList;
  }
  return false;
};

WeakMap.prototype.delete = function(o) {
  const mapList = privacy.get(o);
  if (mapList) {
    const wm = privacy.get(this);
    if (wm.name in mapList) {
      delete mapList[wm.name];
      if (!Object.keys(mapList).length) {
        privacy.remove(o);
      }
      return true;
    }
    return false;
  }
  return false;
};

export { WeakMap };