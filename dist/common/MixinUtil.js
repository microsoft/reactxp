/**
* MixinUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Function applyMixins expects that first argument applies properties from mixins.
*/
"use strict";
function applyMixins(thisObj, mixins) {
    mixins.forEach(function (mixin) {
        Object.getOwnPropertyNames(mixin).forEach(function (name) {
            if (name !== 'constructor') {
                thisObj[name] = mixin[name].bind(thisObj);
            }
        });
    });
}
module.exports = {
    applyMixins: applyMixins
};
