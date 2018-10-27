/**
 * Styles.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * RN-specific implementation of style functions.
 */

import * as RN from 'react-native';

import AppConfig from '../common/AppConfig';
import * as RX from '../common/Interfaces';
import { omit } from './utils/lodashMini';
import Platform from './Platform';
import StyleLeakDetector from './StyleLeakDetector';

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
type ReactNativeViewAndImageCommonStyle<Style extends RX.Types.ViewAndImageCommonStyle> = Style & {
    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number;
    textShadowColor?: string;
    textShadowOffset?: RX.Types.ShadowOffset;
    textShadowRadius?: number;
};

export class Styles extends RX.Styles {
    combine<S>(ruleSet1: RX.Types.StyleRuleSetRecursive<S> | undefined, ruleSet2?: RX.Types.StyleRuleSetRecursive<S>)
            : RX.Types.StyleRuleSetOrArray<S> | undefined {
        if (!ruleSet1 && !ruleSet2) {
            return undefined;
        }

        const ruleSet = ruleSet1 ? (ruleSet2 ? [ruleSet1, ruleSet2] : ruleSet1) : ruleSet2;

        if (ruleSet instanceof Array) {
            let resultArray: RX.Types.StyleRuleSet<S>[] = [];
            for (let i = 0; i < ruleSet.length; i++) {
                const subRuleSet = this.combine(ruleSet[i]);

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
    createViewStyle(ruleSet: RX.Types.ViewStyle, cacheStyle = true): RX.Types.ViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates animated styles that can be used for View
    createAnimatedViewStyle(ruleSet: RX.Types.AnimatedViewStyle): RX.Types.AnimatedViewStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for ScrollView
    createScrollViewStyle(ruleSet: RX.Types.ScrollViewStyle, cacheStyle = true): RX.Types.ScrollViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Button
    createButtonStyle(ruleSet: RX.Types.ButtonStyle, cacheStyle = true): RX.Types.ButtonStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for WebView
    createWebViewStyle(ruleSet: RX.Types.WebViewStyle, cacheStyle = true): RX.Types.WebViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Text
    createTextStyle(ruleSet: RX.Types.TextStyle, cacheStyle = true): RX.Types.TextStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle, true);
    }

    // Creates opaque styles that can be used for Text
    createAnimatedTextStyle(ruleSet: RX.Types.AnimatedTextStyle): RX.Types.AnimatedTextStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for TextInput
    createTextInputStyle(ruleSet: RX.Types.TextInputStyle, cacheStyle = true): RX.Types.TextInputStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle, true);
    }

    // Creates opaque styles that can be used for TextInput
    createAnimatedTextInputStyle(ruleSet: RX.Types.AnimatedTextInputStyle): RX.Types.AnimatedTextInputStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for Image
    createImageStyle(ruleSet: RX.Types.ImageStyle, cacheStyle = true): RX.Types.ImageStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

     // Creates animated opaque styles that can be used for Image
    createAnimatedImageStyle(ruleSet: RX.Types.AnimatedImageStyle): RX.Types.AnimatedImageStyleRuleSet {
        return this._adaptAnimatedStyles(ruleSet);
    }

    // Creates opaque styles that can be used for Link
    createLinkStyle(ruleSet: RX.Types.LinkStyle, cacheStyle = true): RX.Types.LinkStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Picker
    createPickerStyle(ruleSet: RX.Types.PickerStyle, cacheStyle = true): RX.Types.PickerStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    getCssPropertyAliasesCssStyle(): {[key: string]: string} {
        // Nothing to do in native; this is for web only
        return {};
    }

    private _adaptStyles<S extends RX.Types.ViewAndImageCommonStyle>(
        def: S,
        cacheStyle: boolean,
        isTextStyle = false
    ): Readonly<RX.Types.StyleRuleSet<S>> {
        let adaptedRuleSet = def as ReactNativeViewAndImageCommonStyle<S>;
        if (cacheStyle) {
            StyleLeakDetector.detectLeaks(def);

            // Forbidden props are not allowed in uncached styles. Perform the
            // omit only in the cached path.
            adaptedRuleSet = omit<S>(adaptedRuleSet, forbiddenProps) as ReactNativeViewAndImageCommonStyle<S>;
        }

        // Convert text styling
        const textStyle = adaptedRuleSet as RX.Types.TextStyle;
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

        if (isTextStyle) {
            if (textStyle.shadowColor !== undefined) {
                adaptedRuleSet.textShadowColor = textStyle.shadowColor;
                delete textStyle.shadowColor;
            }
            if (textStyle.shadowOffset !== undefined) {
                adaptedRuleSet.textShadowOffset = textStyle.shadowOffset;
                delete textStyle.shadowOffset;
            }
            if (textStyle.shadowRadius !== undefined) {
                adaptedRuleSet.textShadowRadius = textStyle.shadowRadius;
                delete textStyle.shadowRadius;
            }
        }

        if (def.flex !== undefined) {
            // In development mode, see if we're going to overwrite explicit flexGrow
            // or flexShrink attributes. It's a programming error to specify these in
            // combination with flex.
            if (AppConfig.isDevelopmentMode()) {
                if (adaptedRuleSet.flexGrow !== undefined || adaptedRuleSet.flexShrink !== undefined) {
                    console.error('Conflicting rules for flex specified.');
                }
            }

            const flexValue = def.flex;
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

    private _adaptAnimatedStyles<T extends RX.Types.AnimatedViewAndImageCommonStyle>(def: T): Readonly<T> {
        const adaptedRuleSet = omit<T>(def, forbiddenProps) as T;
        return AppConfig.isDevelopmentMode() ? Object.freeze(adaptedRuleSet) : adaptedRuleSet;
    }
}

export default new Styles();
