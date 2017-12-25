import { Symbol } from './symbol';

export function createPrivate() {
  const priv_key = {};
  const priv_prop = Symbol();

  const actions = {
    on: function(o) {
      if (!actions.has(o)) {
        return actions.create(o);
      }
      return actions.get(o);
    },

    create: function create(o) {
      const priv_store = {};

      Object.defineProperty(o, priv_prop, {
        configurable: true,
        value: function access(provided_key) {
          if (priv_key === provided_key) {
            return priv_store;
          }
          console.error('Cannot access private props');
          return undefined;
        }
      });

      return priv_store;
    },

    get: function(o) {
      if (actions.has(o)) {
        return o[priv_prop](priv_key);
      }
    },

    has: function(o) {
      return priv_prop in o;
    },

    remove: function(o) {
      if (actions.has(o)) {
        delete o[priv_prop];
        return true;
      }
      return false;
    }
  };

  return actions;
}