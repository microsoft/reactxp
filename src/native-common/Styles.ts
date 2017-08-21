/**
* Styles.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of style functions.
*/

import _ = require('./lodashMini');
import RN = require('react-native');

import RX = require('../common/Interfaces');
import StyleLeakDetector from './StyleLeakDetector';
import Types = require('../common/Types');

const forbiddenProps: string[] = [
    'wordBreak',
    'appRegion',
    'cursor'
];

// React Native styles that ReactXP doesn't expose.
type ReactNativeViewAndImageCommonStyle<Style extends Types.ViewAndImageCommonStyle> = Style & {
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number;
};

export class Styles extends RX.Styles {
    combine<S>(ruleSet1: Types.StyleRuleSetRecursive<S>, ruleSet2?: Types.StyleRuleSetRecursive<S>): Types.StyleRuleSetOrArray<S> {
        if (!ruleSet1 && !ruleSet2) {
            return undefined;
        }

        let ruleSet = ruleSet1;
        if (ruleSet2) {
            ruleSet = [ruleSet1, ruleSet2];
        }

        if (ruleSet instanceof Array) {
            let resultArray: Types.StyleRuleSet<S>[] = [];
            for (let i = 0; i < ruleSet.length; i++) {
                let subRuleSet: Types.StyleRuleSet<S> | Types.StyleRuleSet<S>[] = this.combine(ruleSet[i]);
                    
                if (subRuleSet instanceof Array) {
                    resultArray = resultArray.concat(subRuleSet);
                } else {
                    resultArray.push(subRuleSet);
                }
            }

            if (resultArray.length === 0) {
                return undefined;
            }

            // Elimiante the array if there's a single style.
            if (resultArray.length === 1) {
                return resultArray[0];
            }

            return resultArray;
        }

        // Handle the case where the input was either undefined
        // or not an array (a single style).
        return ruleSet;
    }

    // Creates opaque styles that can be used for View
    createViewStyle(ruleSet: Types.ViewStyle, cacheStyle: boolean = true): Types.ViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates animated styles that can be used for View
    createAnimatedViewStyle(ruleSet: Types.AnimatedViewStyle): Types.AnimatedViewStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for ScrollView
    createScrollViewStyle(ruleSet: Types.ScrollViewStyle, cacheStyle: boolean = true): Types.ScrollViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Button
    createButtonStyle(ruleSet: Types.ButtonStyle, cacheStyle: boolean = true): Types.ButtonStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for WebView
    createWebViewStyle(ruleSet: Types.WebViewStyle, cacheStyle: boolean = true): Types.WebViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Text
    createTextStyle(ruleSet: Types.TextStyle, cacheStyle: boolean = true): Types.TextStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Text
    createAnimatedTextStyle(ruleSet: Types.AnimatedTextStyle): Types.AnimatedTextStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for TextInput
    createTextInputStyle(ruleSet: Types.TextInputStyle, cacheStyle: boolean = true): Types.TextInputStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for TextInput
    createAnimatedTextInputStyle(ruleSet: Types.AnimatedTextInputStyle): Types.AnimatedTextInputStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for Image
    createImageStyle(ruleSet: Types.ImageStyle, cacheStyle: boolean = true): Types.ImageStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

     // Creates animated opaque styles that can be used for Image
    createAnimatedImageStyle(ruleSet: Types.AnimatedImageStyle): Types.AnimatedImageStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for Link
    createLinkStyle(ruleSet: Types.LinkStyle, cacheStyle: boolean = true): Types.LinkStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Picker
    createPickerStyle(ruleSet: Types.PickerStyle, cacheStyle: boolean = true): Types.PickerStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    private _adaptStyles<S extends Types.ViewAndImageCommonStyle>(def: S, cacheStyle: boolean): Types.StyleRuleSet<S> {
        let adaptedRuleSet = def as ReactNativeViewAndImageCommonStyle<S>;
        if (cacheStyle) {
            StyleLeakDetector.detectLeaks(def);

            // Forbidden props are not allowed in uncached styles. Perform the
            // omit only in the cached path.
            adaptedRuleSet = _.omit<S, S>(adaptedRuleSet, forbiddenProps);
        }

        // Convert text styling
        let textStyle = adaptedRuleSet as Types.TextStyle;
        if (textStyle.font) {
            if (textStyle.font.fontFamily !== undefined) {
                textStyle.fontFamily = textStyle.font.fontFamily;
            }
            if (textStyle.font.fontWeight !== undefined) {
                textStyle.fontWeight = textStyle.font.fontWeight;
            }
            if (textStyle.font.fontStyle !== undefined) {
                textStyle.fontStyle = textStyle.font.fontStyle;
            }
            delete textStyle.font;
        }

        if (def.flex !== undefined) {
            var flexValue = def.flex;
            delete adaptedRuleSet.flex;
            if (flexValue > 0) {
                // p 1 auto
                adaptedRuleSet.flexGrow = flexValue;
                adaptedRuleSet.flexShrink = 1;
            } else if (flexValue < 0) {
                // 0 -n auto
                adaptedRuleSet.flexGrow = 0;
                adaptedRuleSet.flexShrink = -flexValue;
            } else {
                // 0 0 auto
                adaptedRuleSet.flexGrow = 0;
                adaptedRuleSet.flexShrink = 0;
            }
        }

        if (cacheStyle) {
            return RN.StyleSheet.create({ _style: adaptedRuleSet })._style;
        }

        return adaptedRuleSet;
    }

    private _adaptAnimatedStyles<T extends Types.AnimatedViewAndImageCommonStyle>(def: T): T {
        return _.omit<T, T>(def, forbiddenProps);
    }
}

export default new Styles();
