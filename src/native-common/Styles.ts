﻿/**
* Styles.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of style functions.
*/

import _ = require('./lodashMini');
import RN = require('react-native');

import AppConfig from '../common/AppConfig';
import RX = require('../common/Interfaces');
import StyleLeakDetector from './StyleLeakDetector';
import Platform from './Platform';
import Types = require('../common/Types');

const forbiddenProps: string[] = [
    'wordBreak',
    'appRegion',
    'cursor'
];

// RN would crash if it gets an undeclared property.
// The properties below are declared only in RN UWP.
if (Platform.getType() !== 'windows') {
    forbiddenProps.push(
        'acrylicOpacityUWP',
        'acrylicSourceUWP',
        'acrylicTintColorUWP');
}

// React Native styles that ReactXP doesn't expose.
type ReactNativeViewAndImageCommonStyle<Style extends Types.ViewAndImageCommonStyle> = Style & {
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number;
};

export class Styles extends RX.Styles {
    combine<S>(ruleSet1: Types.StyleRuleSetRecursive<S>|undefined, ruleSet2?: Types.StyleRuleSetRecursive<S>)
            : Types.StyleRuleSetOrArray<S>|undefined {
        if (!ruleSet1 && !ruleSet2) {
            return undefined;
        }

        let ruleSet = ruleSet1 ? (ruleSet2 ? [ruleSet1, ruleSet2] : ruleSet1) : ruleSet2;

        if (ruleSet instanceof Array) {
            let resultArray: Types.StyleRuleSet<S>[] = [];
            for (let i = 0; i < ruleSet.length; i++) {
                let subRuleSet = this.combine(ruleSet[i]);
                
                if (subRuleSet) {
                    if (subRuleSet instanceof Array) {
                        resultArray = resultArray.concat(subRuleSet);
                    } else {
                        resultArray.push(subRuleSet);
                    }
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

    getCssPropertyAliasesCssStyle(): {[key: string]: string} {
        // Nothing to do in native; this is for web only
        return {};
    }

    private _adaptStyles<S extends Types.ViewAndImageCommonStyle>(def: S, cacheStyle: boolean): Readonly<Types.StyleRuleSet<S>> {
        let adaptedRuleSet = def as ReactNativeViewAndImageCommonStyle<S>;
        if (cacheStyle) {
            StyleLeakDetector.detectLeaks(def);

            // Forbidden props are not allowed in uncached styles. Perform the
            // omit only in the cached path.
            adaptedRuleSet = _.omit<S>(adaptedRuleSet, forbiddenProps) as ReactNativeViewAndImageCommonStyle<S>;
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

        return AppConfig.isDevelopmentMode() ? Object.freeze(adaptedRuleSet) : adaptedRuleSet;
    }

    private _adaptAnimatedStyles<T extends Types.AnimatedViewAndImageCommonStyle>(def: T): Readonly<T> {
        const adaptedRuleSet = _.omit<T>(def, forbiddenProps) as T;
        return AppConfig.isDevelopmentMode() ? Object.freeze(adaptedRuleSet) : adaptedRuleSet;
    }
}

export default new Styles();
