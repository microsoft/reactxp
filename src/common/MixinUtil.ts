/**
* MixinUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
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
