(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VueEventBus = factory());
}(this, (function () { 'use strict';

  function install(Vue, injectName) {
    injectName = injectName && typeof injectName === 'string' ? injectName : '$bus';
    const eventBus = new Vue({});
    const $on = eventBus.$on;
    const $off = eventBus.$off;
    const props = {}
    ;(['on', 'once', 'off', 'emit']).forEach(key => {
      props[key] = {
        get() {
          return this['$' + key].bind(this)
        },
      };
    });
    Object.defineProperties(eventBus, props);

    const weakMap = new WeakMap();

    Object.defineProperty(Vue.prototype, injectName, {
      get() {
        const ctx = this;
        return Object.assign(eventBus, {
          $on(event, oldFn) {
            // 解决this指向
            const newFn = (...rest) => oldFn.apply(ctx, rest);
            $on.call(eventBus, event, newFn);

            weakMap.set(oldFn, newFn);

            // 解决手动清除事件监听问题
            ctx.$on('hook:beforeDestroy', () => {
              this.$off(event, oldFn);
            });
          },
          $off(event, oldFn) {
            let newFn = oldFn;
            if (oldFn instanceof Function) {
              newFn = weakMap.get(oldFn);
              weakMap.delete(oldFn);
            }
            $off.call(eventBus, event, newFn);
          },
        })
      },
    });
  }

  return install;

})));