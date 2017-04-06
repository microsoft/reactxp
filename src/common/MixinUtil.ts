 /**
 * MixinUtil.ts
 * Copyright: Microsoft 2017
 *
 * Function applyMixins expects that first argument applies properties from mixins.
 */

function applyMixins(thisObj: any, mixins: any[]) {
    mixins.forEach(mixin => {
       Object.getOwnPropertyNames(mixin).forEach(name => {
          if (name !== 'constructor') {
              thisObj[name] = mixin[name].bind(thisObj);
          }
       });
    });
}

export = {
    applyMixins: applyMixins
};
