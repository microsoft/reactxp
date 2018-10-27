/**
 * ViewBase.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Base class that is used for several RX views.
 */

import * as RN from 'react-native';

import * as RX from '../common/Interfaces';
import { isEqual } from './utils/lodashMini';

export abstract class ViewBase<P extends RX.Types.ViewProps, S> extends RX.ViewBase<P, S> {
    private static _defaultViewStyle: RX.Types.ViewStyleRuleSet | undefined;
    private _layoutEventValues: RX.Types.ViewOnLayoutEvent | undefined;

    abstract render(): JSX.Element;
    protected _nativeView: RN.View | undefined;

    static setDefaultViewStyle(defaultViewStyle: RX.Types.ViewStyleRuleSet) {
        ViewBase._defaultViewStyle = defaultViewStyle;
    }

    static getDefaultViewStyle() {
        return ViewBase._defaultViewStyle;
    }

    // To be able to use View inside TouchableHighlight/TouchableOpacity
    setNativeProps(nativeProps: RN.ViewProps) {
        if (this._nativeView) {
            this._nativeView.setNativeProps(nativeProps);
        }
    }

    protected _setNativeView = (view: any | undefined) => {
        this._nativeView = view;
    }

    protected _getStyles(props: RX.Types.ViewProps) {
        // If this platform uses an explicit default view style, push it on to
        // the front of the list of provided styles.
        if (ViewBase._defaultViewStyle) {
            return [ViewBase._defaultViewStyle, props.style];
        }

        return props.style;
    }

    protected _onLayout = (event: RN.LayoutChangeEvent) => {
        if (this.props.onLayout) {
            const layoutEventValues = {
                x: event.nativeEvent.layout.x,
                y: event.nativeEvent.layout.y,
                width: event.nativeEvent.layout.width,
                height: event.nativeEvent.layout.height
            };

            // Only fire the onLayout callback if the layout values change
            if (!isEqual(this._layoutEventValues, layoutEventValues)) {
                this.props.onLayout(layoutEventValues);
                this._layoutEventValues = layoutEventValues;
            }
        }
    }
}

export default ViewBase;
