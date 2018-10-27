/**
 * Styles.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of style functions.
 */

import AppConfig from '../common/AppConfig';
import * as RX from '../common/Interfaces';
import * as _ from './utils/lodashMini';
import StyleLeakDetector from '../common/StyleLeakDetector';

type CssAliasMap = { [prop: string]: string };

export class Styles extends RX.Styles {
    // Combines a set of styles
    combine<S>(ruleSet1: RX.Types.StyleRuleSetRecursive<S> | undefined, ruleSet2?: RX.Types.StyleRuleSetRecursive<S>)
            : RX.Types.StyleRuleSetOrArray<S> | undefined {
        if (!ruleSet1 && !ruleSet2) {
            return undefined;
        }

        const ruleSet = ruleSet1 ? (ruleSet2 ? [ruleSet1, ruleSet2] : ruleSet1) : ruleSet2;

        if (ruleSet instanceof Array) {
            let combinedStyles: any = {};

            for (let i = 0; i < ruleSet.length; i++) {
                const subRuleSet = this.combine(ruleSet[i]);
                combinedStyles = _.extend(combinedStyles, subRuleSet);
            }

            if (AppConfig.isDevelopmentMode()) {
                if ((combinedStyles.marginLeft !== undefined || combinedStyles.marginRight !== undefined ||
                        combinedStyles.marginTop !== undefined || combinedStyles.marginBottom !== undefined) &&
                        combinedStyles.margin !== undefined) {
                    console.error('Conflicting rules for margin specified.');
                }

                if ((combinedStyles.paddingLeft !== undefined || combinedStyles.paddingRight !== undefined ||
                        combinedStyles.paddingTop !== undefined || combinedStyles.paddingBottom !== undefined) &&
                        combinedStyles.padding !== undefined) {
                    console.error('Conflicting rules for padding specified.');
                }
            }

            if (combinedStyles.borderWidth ||
                    combinedStyles.borderTopWidth || combinedStyles.borderRightWidth ||
                    combinedStyles.borderBottomWidth || combinedStyles.borderLeftWidth) {
                // If the caller specified a non-zero border width
                // but no border color or style, set the defaults to
                // match those of React Native platforms.
                if (combinedStyles.borderColor === undefined) {
                    combinedStyles.borderColor = 'black';
                }
                if (combinedStyles.borderStyle === undefined) {
                    combinedStyles.borderStyle = 'solid';
                }
            }

            return combinedStyles as RX.Types.StyleRuleSet<S>;
        }

        return ruleSet;
    }

    // Creates opaque styles that can be used for View
    createViewStyle(ruleSet: RX.Types.ViewStyle, cacheStyle = true): RX.Types.ViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for View
    createAnimatedViewStyle(ruleSet: RX.Types.AnimatedViewStyle): RX.Types.AnimatedViewStyleRuleSet {
        return this._adaptStyles(ruleSet, false);
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
        return this._adaptStyles(ruleSet, false);
    }

    // Creates opaque styles that can be used for TextInput
    createTextInputStyle(ruleSet: RX.Types.TextInputStyle, cacheStyle = true): RX.Types.TextInputStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle, true);
    }

    // Creates opaque styles that can be used for TextInput
    createAnimatedTextInputStyle(ruleSet: RX.Types.AnimatedTextInputStyle): RX.Types.AnimatedTextInputStyleRuleSet {
        return this._adaptStyles(ruleSet, false);
    }

    // Creates opaque styles that can be used for Link
    createLinkStyle(ruleSet: RX.Types.LinkStyle, cacheStyle = true): RX.Types.LinkStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Image
    createImageStyle(ruleSet: RX.Types.ImageStyle, cacheStyle = true): RX.Types.ImageStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Image
    createAnimatedImageStyle(ruleSet: RX.Types.AnimatedImageStyle): RX.Types.AnimatedImageStyleRuleSet {
        return this._adaptStyles(ruleSet, false);
    }

    // Creates opaque styles that can be used for Picker
    createPickerStyle(ruleSet: RX.Types.PickerStyle, cacheStyle = true): RX.Types.PickerStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Returns the name of a CSS property or its alias. Returns undefined if the property is not supported.
    private _getCssPropertyAlias(name: string) {
        // If we're inside unit tests, document may not be defined yet. We don't need prefixes for tests
        if (typeof document === 'undefined') {
            return undefined;
        }

        const upperName = name.charAt(0).toUpperCase() + name.slice(1);
        let propsToTest = [name, upperName];

        propsToTest = propsToTest.concat(['Webkit', 'webkit', 'Moz', 'O', 'ms'].map(
            prefix => prefix + upperName));

        const testElement = this._createDummyElement();
        const styleObj = testElement.style as any;

        for (let i = 0; i < propsToTest.length; i++) {
            const prop = propsToTest[i];

            if (styleObj[prop] !== undefined) {
                return prop;
            }
        }

        return undefined;
    }

    // Use memoize to cache the result after the first call.
    private _createDummyElement = _.memoize((): HTMLElement => {
        return document.createElement('testCss');
    });

    private _getCssPropertyAliasesJsStyle = _.memoize(() => {
        const props = [
            'flex',
            'flexDirection',
            'alignItems',
            'justifyContent',
            'alignSelf',
            'alignContent',
            'transform',
            'transition',
            'animationDuration',
            'animationTimingFunction',
            'animationDirection',
            'animationDelay',
            'animationIterationCount',
            'animationName',
            'hyphens',
            'filter',
            'appRegion'
        ];

        const aliases: CssAliasMap = {};

        props.forEach(prop => {
            const alias = this._getCssPropertyAlias(prop);
            if (alias && prop !== alias) {
                aliases[prop] = alias;
            }
        });

        return aliases;
    });

    // Converts a property from JavaScript style (camel-case) to CSS style (lowercase with hyphens).
    convertJsToCssStyle(prop: string): string {
        let cssString = '';

        if (prop) {
            for (let i = 0; i < prop.length; i++) {
                const lowerChar = prop[i].toLowerCase();
                if (lowerChar === prop[i]) {
                    cssString += lowerChar;
                } else {
                    cssString += '-' + lowerChar;
                }
            }
        }

        return cssString;
    }

    _cssPropertyAliasesCssStyle = memoize(() => {
        const jsStyleAliases = this._getCssPropertyAliasesJsStyle();

        const aliases: CssAliasMap = {};

        _.each(_.keys(jsStyleAliases), prop => {
            aliases[prop] = this.convertJsToCssStyle(jsStyleAliases[prop]);
        });

        return aliases;
    });

    getCssPropertyAliasesCssStyle(): {[key: string]: string} {
        return this._cssPropertyAliasesCssStyle();
    }

    getParentComponentName(component: any): string {
        let parentConstructor: any;
        const internalInstance = component._reactInternalInstance;

        if (internalInstance && internalInstance._currentElement &&
            internalInstance._currentElement._owner && internalInstance._currentElement._owner._instance) {
            parentConstructor = internalInstance._currentElement._owner._instance.constructor;
        }

        if (!parentConstructor) {
            return '';
        }

        return parentConstructor.name ? parentConstructor.name : parentConstructor;
    }

    private _adaptStyles(def: any, validate: boolean, isTextStyle = false): Readonly<any> {
        if (validate) {
            StyleLeakDetector.detectLeaks(def);
        }
        // Expand composite types.
        if (def.font) {
            if (def.font.fontFamily !== undefined) {
                def.fontFamily = def.font.fontFamily;
            }
            if (def.font.fontWeight !== undefined) {
                def.fontWeight = def.font.fontWeight;
            }
            if (def.font.fontStyle !== undefined) {
                def.fontStyle = def.font.fontStyle;
            }
            delete def.font;
        }

        if (def.flex !== undefined) {
            // In development mode, see if we're going to overwrite explicit flexGrow
            // or flexShrink attributes. It's a programming error to specify these in
            // combination with flex.
            if (AppConfig.isDevelopmentMode()) {
                if (def.flexGrow !== undefined || def.flexShrink !== undefined) {
                    console.error('Conflicting rules for flex specified.');
                }
            }

            const flexValue = def.flex as number;
            delete def.flex;

            if (flexValue > 0) {
                // p 1 auto
                def.flexGrow = flexValue;
                def.flexShrink = 1;
            } else if (flexValue < 0) {
                // 0 -n auto
                def.flexGrow = 0;
                def.flexShrink = -flexValue;
            } else {
                // 0 0 auto
                def.flexGrow = 0;
                def.flexShrink = 0;
            }
        }

        if (def.transform) {
            const transformStrings: string[] = [];
            const animatedTransforms: { [key: string]: Object } = {};
            const staticTransforms: { [key: string]: string } = {};

            _.each(def.transform, (t: { [key: string]: string }) => {
                _.each(_.keys(t), key => {
                    // Animated transforms use Animated.Value objects rather
                    // than strings. We need to store these separately.
                    if (typeof t[key] === 'object') {
                        animatedTransforms[key] = t[key];
                    } else {
                        let value: string = t[key].toString();
                        if (key.indexOf('rotate') === 0) {
                            value += 'deg';
                        } else if (key.indexOf('translate') === 0) {
                            value += 'px';
                        }

                        transformStrings.push(key + '(' + value + ')');
                        staticTransforms[key] = value;
                    }
                });
            });

            delete def.transform;

            if (transformStrings.length > 0) {
                def.transform = transformStrings.join(' ');
            }

            if (_.keys(animatedTransforms).length > 0) {
                def.animatedTransforms = animatedTransforms;
                def.staticTransforms = staticTransforms;
            }
        }

        if (def.shadowOffset !== undefined || def.shadowRadius !== undefined || def.shadowColor !== undefined) {
            let width = 0;
            let height = 0;
            let radius = 0;
            let color = 'black';

            if (def.shadowOffset !== undefined) {
                width = def.shadowOffset.width;
                height = def.shadowOffset.height;
                delete def.shadowOffset;
            }

            if (def.shadowRadius !== undefined) {
                radius = def.shadowRadius;
                delete def.shadowRadius;
            }

            if (def.shadowColor !== undefined) {
                color = def.shadowColor;
                delete def.shadowColor;
            }

            if (isTextStyle) {
                def.textShadow = width + 'px ' + height + 'px ' + radius + 'px ' + color;
            } else {
                def.boxShadow = width + 'px ' + height + 'px ' + radius + 'px 0px ' + color;
            }
        }

        // CSS (and React JS) support lineHeight defined as either a multiple of the font
        // size or a pixel count. The RX.Types interface always uses a pixel count. We need to
        // convert to the string notation to make CSS happy.
        if (def.lineHeight !== undefined) {
            def.lineHeight = def.lineHeight + 'px';
        }

        // Add default border width if border style or some subset of border widths
        // were provided. Otherwise the browser will default to a two-pixel border.
        if (def.borderStyle || def.borderTopWidth || def.borderRightWidth || def.borderBottomWidth || def.borderLeftWidth) {
            if (def.borderWidth === undefined) {
                if (def.borderTopWidth === undefined) {
                    def.borderTopWidth = 0;
                }
                if (def.borderRightWidth === undefined) {
                    def.borderRightWidth = 0;
                }
                if (def.borderBottomWidth === undefined) {
                    def.borderBottomWidth = 0;
                }
                if (def.borderLeftWidth === undefined) {
                    def.borderLeftWidth = 0;
                }
            }
        }

        // CSS doesn't support vertical/horizontal margins or padding.
        if (def.marginVertical !== undefined) {
            def.marginTop = def.marginVertical;
            def.marginBottom = def.marginVertical;
            delete def.marginVertical;
        }

        if (def.marginHorizontal !== undefined) {
            def.marginLeft = def.marginHorizontal;
            def.marginRight = def.marginHorizontal;
            delete def.marginHorizontal;
        }

        if (AppConfig.isDevelopmentMode()) {
            if ((def.marginHorizontal !== undefined || def.marginVertical !== undefined ||
                    def.marginLeft !== undefined || def.marginRight !== undefined ||
                    def.marginTop !== undefined || def.marginBottom !== undefined) && def.margin !== undefined) {
                console.error('Conflicting rules for margin specified.');
            }
        }

        if (def.paddingVertical !== undefined) {
            def.paddingTop = def.paddingVertical;
            def.paddingBottom = def.paddingVertical;
            delete def.paddingVertical;
        }

        if (def.paddingHorizontal !== undefined) {
            def.paddingLeft = def.paddingHorizontal;
            def.paddingRight = def.paddingHorizontal;
            delete def.paddingHorizontal;
        }

        if (AppConfig.isDevelopmentMode()) {
            if ((def.paddingHorizontal !== undefined || def.paddingVertical !== undefined ||
                    def.paddingLeft !== undefined || def.paddingRight !== undefined ||
                    def.paddingTop !== undefined || def.paddingBottom !== undefined) && def.padding !== undefined) {
                console.error('Conflicting rules for padding specified.');
            }
        }

        // CSS doesn't support 'textDecorationLine'
        if (def.textDecorationLine !== undefined) {
            def.textDecoration = def.textDecorationLine;
            delete def.textDecorationLine;
        }

        // Add common aliases if necessary.
        const jsAliases = this._getCssPropertyAliasesJsStyle();
        for (const prop in jsAliases) {
            if (def[prop] !== undefined && jsAliases[prop]) {
                def[jsAliases[prop]] = def[prop];
            }
        }

        // Add IE-specific word wrap property.
        if (def.wordBreak === 'break-word') {
            def.wordWrap = 'break-word';
        }

        return AppConfig.isDevelopmentMode() ? Object.freeze(def) : def;
    }
}

export function memoize<T extends (...args: any[]) => any>(func: T, resolver?: (...args: any[]) => any): T {
    return _.memoize(func, resolver);
}

export default new Styles();
