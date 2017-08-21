/**
* Styles.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of style functions.
*/

import _ = require('./utils/lodashMini');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import StyleLeakDetector from '../common/StyleLeakDetector';

type CssAliasMap = { [prop: string]: string };

export class Styles extends RX.Styles {
    // Combines a set of styles
    combine<S>(ruleSet1: Types.StyleRuleSetRecursive<S>, ruleSet2?: Types.StyleRuleSetRecursive<S>): Types.StyleRuleSetOrArray<S> {
        if (!ruleSet1 && !ruleSet2) {
            return undefined;
        }

        let ruleSet = ruleSet1;
        if (ruleSet2) {
            ruleSet = [ruleSet1, ruleSet2];
        }

        if (ruleSet instanceof Array) {
            let combinedStyles: any = {};

            for (let i = 0; i < ruleSet.length; i++) {
                let subRuleSet = this.combine(ruleSet[i]);
                combinedStyles = _.extend(combinedStyles, subRuleSet);
            }

            if ((combinedStyles.marginLeft !== undefined || combinedStyles.marginRight !== undefined ||
                    combinedStyles.marginTop !== undefined || combinedStyles.marginBottom !== undefined) &&
                    combinedStyles.margin !== undefined) {
                console.error('Conflicting rules for margin specified.');
                delete combinedStyles.margin;
            }

            if ((combinedStyles.paddingLeft !== undefined || combinedStyles.paddingRight !== undefined ||
                    combinedStyles.paddingTop !== undefined || combinedStyles.paddingBottom !== undefined) &&
                    combinedStyles.padding !== undefined) {
                console.error('Conflicting rules for padding specified.');
                delete combinedStyles.padding;
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

            return combinedStyles as Types.StyleRuleSet<S>;
        }

        return ruleSet as Types.StyleRuleSet<S>;
    }

    // Creates opaque styles that can be used for View
    createViewStyle(ruleSet: Types.ViewStyle, cacheStyle: boolean = true): Types.ViewStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for View
    createAnimatedViewStyle(ruleSet: Types.AnimatedViewStyle): Types.AnimatedViewStyleRuleSet {
        return this._adaptStyles(ruleSet, false);
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
        return this._adaptStyles(ruleSet, false);
    }

    // Creates opaque styles that can be used for TextInput
    createTextInputStyle(ruleSet: Types.TextInputStyle, cacheStyle: boolean = true): Types.TextInputStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for TextInput
    createAnimatedTextInputStyle(ruleSet: Types.AnimatedTextInputStyle): Types.AnimatedTextInputStyleRuleSet {
        return this._adaptStyles(ruleSet, false);
    }

    // Creates opaque styles that can be used for Link
    createLinkStyle(ruleSet: Types.LinkStyle, cacheStyle: boolean = true): Types.LinkStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Image
    createImageStyle(ruleSet: Types.ImageStyle, cacheStyle: boolean = true): Types.ImageStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Creates opaque styles that can be used for Image
    createAnimatedImageStyle(ruleSet: Types.AnimatedImageStyle): Types.AnimatedImageStyleRuleSet {
        return this._adaptStyles(ruleSet, false);
    }

    // Creates opaque styles that can be used for Picker
    createPickerStyle(ruleSet: Types.PickerStyle, cacheStyle: boolean = true): Types.PickerStyleRuleSet {
        return this._adaptStyles(ruleSet, cacheStyle);
    }

    // Returns the name of a CSS property or its alias. Returns null if the property is not supported.
    private _getCssPropertyAlias(name: string) {
        // If we're inside unit tests, document may not be defined yet. We don't need prefixes for tests
        if (typeof document === 'undefined') {
            return null;
        }

        let upperName = name.charAt(0).toUpperCase() + name.slice(1);
        let propsToTest = [name, upperName];

        propsToTest = propsToTest.concat(['Webkit', 'webkit', 'Moz', 'O', 'ms'].map(
            prefix => prefix + upperName));

        let testElement = this._createDummyElement();
        let styleObj = testElement.style as any;

        for (let i = 0; i < propsToTest.length; i++) {
            let prop = propsToTest[i];

            if (styleObj[prop] !== undefined) {
                return prop;
            }
        }

        return null;
    }

    // Use memoize to cache the result after the first call.
    private _createDummyElement = _.memoize((): HTMLElement => {
        return document.createElement('testCss');
    });

    private _getCssPropertyAliasesJsStyle = _.memoize(() => {
        let props = [
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

        let aliases: CssAliasMap = {};

        props.forEach(prop => {
            let alias = this._getCssPropertyAlias(prop);
            if (prop !== alias) {
                aliases[prop] = alias;
            }
        });

        return aliases;
    });

    // Converts a property from JavaScript style (camel-case) to CSS style (lowercase with hyphens).
    private _convertJsToCssStyle(prop: string): string {
        let cssString = '';

        if (prop) {
            for (var i = 0; i < prop.length; i++) {
                let lowerChar = prop[i].toLowerCase();
                if (lowerChar === prop[i]) {
                    cssString += lowerChar;
                } else {
                    cssString += '-' + lowerChar;
                }
            }
        }

        return cssString;
    }

    getCssPropertyAliasesCssStyle = memoize(() => {
        let jsStyleAliases = this._getCssPropertyAliasesJsStyle();

        let aliases: CssAliasMap = {};

        _.each(_.keys(jsStyleAliases), prop => {
            aliases[prop] = this._convertJsToCssStyle(jsStyleAliases[prop]);
        });

        return aliases;
    });

    getParentComponentName(component: any): string {
        let parentConstructor: any;
        let internalInstance = component['_reactInternalInstance'];

        if (internalInstance && internalInstance._currentElement &&
            internalInstance._currentElement._owner && internalInstance._currentElement._owner._instance) {
            parentConstructor = internalInstance._currentElement._owner._instance.constructor;
        }

        if (!parentConstructor) {
            return '';
        }

        return parentConstructor.name ? parentConstructor.name : parentConstructor;
    }

    private _adaptStyles(def: any, validate: boolean): any {
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
            let flexValue = def.flex as number;
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
            let transformStrings: string[] = [];
            let animatedTransforms: { type: string, value: Object }[] = [];

            _.each(def.transform, (t: { [key: string]: string }) => {
                _.each(_.keys(t), key => {
                    // Animated transforms use AnimatedValue objects rather
                    // than strings. We need to store these separately.
                    if (typeof t[key] === 'object') {
                        animatedTransforms.push({ type: key, value: t[key] });
                    } else {
                        let value: string = t[key].toString();
                        if (key.indexOf('rotate') === 0) {
                            value += 'deg';
                        } else if (key.indexOf('translate') === 0) {
                            value += 'px';
                        }

                        transformStrings.push(key + '(' + value + ')');
                    }
                });
            });

            delete def.transform;

            if (transformStrings.length > 0) {
                def['transform'] = transformStrings.join(' ');
            }

            if (animatedTransforms.length > 0) {
                def['animatedTransform'] = animatedTransforms;
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

            def['boxShadow'] = width + 'px ' + height + 'px ' + radius + 'px 0px ' + color;
        }

        // CSS (and React JS) support lineHeight defined as either a multiple of the font
        // size or a pixel count. The Types interface always uses a pixel count. We need to
        // convert to the string notation to make CSS happy.
        if (def.lineHeight !== undefined) {
            def['lineHeight'] = def.lineHeight + 'px';
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

        if ((def.marginHorizontal !== undefined || def.marginVertical !== undefined ||
            def.marginLeft !== undefined || def.marginRight !== undefined ||
            def.marginTop !== undefined || def.marginBottom !== undefined) && def.margin !== undefined) {
            console.error('Conflicting rules for margin specified.');
            delete def.margin;
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

        if ((def.paddingHorizontal !== undefined || def.paddingVertical !== undefined ||
            def.paddingLeft !== undefined || def.paddingRight !== undefined ||
            def.paddingTop !== undefined || def.paddingBottom !== undefined) && def.padding !== undefined) {
            console.error('Conflicting rules for padding specified.');
            delete def.padding;
        }

        // CSS doesn't support 'textDecorationLine'
        if (def.textDecorationLine !== undefined) {
            def['textDecoration'] = def.textDecorationLine;
            delete def.textDecorationLine;
        }

        // Add common aliases if necessary.
        let jsAliases = this._getCssPropertyAliasesJsStyle();
        for (let prop in jsAliases) {
            if (def[prop] !== undefined && jsAliases[prop]) {
                def[jsAliases[prop]] = def[prop];
            }
        }

        // Add IE-specific word wrap property.
        if (def.wordBreak === 'break-word') {
            def['wordWrap'] = 'break-word';
        }

        return def;
    }
}

export function memoize<T extends Function>(func: T, resolver?: Function): T { 
    return _.memoize(func, resolver);
}
 
export default new Styles();
