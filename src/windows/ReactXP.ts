/**
* ReactXP.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Wrapper for all ReactXP functionality. Users of ReactXP should import just this
* file instead of internals.
*/

import React = require('react');

import AnimatedImpl = require('../native-common/Animated');
import RXInterface = require('../common/Interfaces');
import RXTypes = require('../common/Types');

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.

import { default as AccessibilityImpl, Accessibility as AccessibilityType } from './Accessibility';
import { default as ActivityIndicatorImpl, ActivityIndicator as ActivityIndicatorType } from '../native-common/ActivityIndicator';
import { default as AlertImpl, Alert as AlertType } from '../native-common/Alert';
import { default as AppImpl, App as AppType } from '../native-common/App';
import { default as PickerImpl, Picker as PickerType } from '../native-common/Picker';
import { default as ButtonImpl, Button as ButtonType } from '../native-common/Button';
import { default as ImageImpl, Image as ImageType } from '../native-common/Image';
import { default as ClipboardImpl, Clipboard as ClipboardType } from '../native-common/Clipboard';
import { default as GestureViewImpl, GestureView as GestureViewType } from './GestureView';
import { default as InputImpl, Input as InputType } from '../native-common/Input';
import { default as InternationalImpl, International as InternationalType } from '../native-common/International';
import { default as LinkImpl, Link as LinkType } from '../native-common/Link';
import { default as LinkingImpl, Linking as LinkingType } from './Linking';
import { default as LocationImpl, Location as LocationType } from '../common/Location';
import { default as ModalImpl, Modal as ModalType } from '../native-common/Modal';
import { default as NavigatorImpl, Navigator as NavigatorType } from '../native-common/Navigator';
import { default as NetworkImpl, Network as NetworkType } from '../native-common/Network';
import { default as PlatformImpl, Platform as PlatformType } from '../native-common/Platform';
import { default as PopupImpl, Popup as PopupType } from '../native-common/Popup';
import { default as ScrollViewImpl, ScrollView as ScrollViewType } from '../native-common/ScrollView';
import { default as StatusBarImpl, StatusBar as StatusBarType } from './StatusBar';
import { default as StorageImpl, Storage as StorageType } from '../native-common/Storage';
import { default as StylesImpl, Styles as StylesType } from '../native-common/Styles';
import { default as TextImpl, Text as TextType } from '../native-common/Text';
import { default as TextInputImpl, TextInput as TextInputType } from '../native-common/TextInput';
import { default as UserInterfaceImpl, UserInterface as UserInterfaceType } from '../native-common/UserInterface';
import { default as UserPresenceImpl, UserPresence as UserPresenceType } from '../native-common/UserPresence';
import { default as ViewImpl, View as ViewType } from '../native-common/View';
import { default as WebViewImpl, WebView as WebViewType } from '../native-common/WebView';
import ViewBase from '../native-common/ViewBase';

// Initialize the Windows default view style. This is required because on RN for Windows, the default
// overflow is 'visible', but we want it to be 'hidden' (the default for ReactXP and RN Android).
const _defaultViewStyle = StylesImpl.createViewStyle({
    overflow: 'hidden'
});
ViewBase.setDefaultViewStyle(_defaultViewStyle);

// Initialize Windows implementation of platform accessibility helpers inside the singleton
// instance of native-common AccessibilityUtil. This is to let native-common components access
// platform specific APIs through native-common implementation itself. 
import AccessibilityUtil from '../native-common/AccessibilityUtil';
import AccessibilityPlatformUtil from './AccessibilityUtil';

AccessibilityUtil.setAccessibilityPlatformUtil(AccessibilityPlatformUtil);

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.

module ReactXP {
    export type Accessibility = AccessibilityType;
    export var Accessibility = AccessibilityImpl;
    export import Animated = AnimatedImpl.Animated;
    export type ActivityIndicator = ActivityIndicatorType;
    export var ActivityIndicator = ActivityIndicatorImpl;
    export type Alert = AlertType;
    export var Alert = AlertImpl;
    export type App = AppType;
    export var App = AppImpl;
    export type Button = ButtonType;
    export var Button = ButtonImpl;
    export type Picker = PickerType;
    export var Picker = PickerImpl;
    export type Clipboard = ClipboardType;
    export var Clipboard = ClipboardImpl;
    export type GestureView = GestureViewType;
    export var GestureView = GestureViewImpl;
    export type Image = ImageType;
    export var Image = ImageImpl;
    export type Input = InputType;
    export var Input = InputImpl;
    export type International = InternationalType;
    export var International = InternationalImpl;
    export type Link = LinkType;
    export var Link = LinkImpl;
    export type Linking = LinkingType;
    export var Linking = LinkingImpl;
    export type Location = LocationType;
    export var Location = LocationImpl;
    export type Modal = ModalType;
    export var Modal = ModalImpl;
    export type Navigator = NavigatorType;
    export var Navigator = NavigatorImpl;
    export type Network = NetworkType;
    export var Network = NetworkImpl;
    export type Platform = PlatformType;
    export var Platform = PlatformImpl;
    export type Popup = PopupType;
    export var Popup = PopupImpl;
    export type ScrollView = ScrollViewType;
    export var ScrollView = ScrollViewImpl;
    export type Storage = StorageType;
    export var Storage = StorageImpl;
    export type StatusBar = StatusBarType;
    export var StatusBar = StatusBarImpl;
    export type Styles = StylesType;
    export var Styles = StylesImpl;
    export type Text = TextType;
    export var Text = TextImpl;
    export type TextInput = TextInputType;
    export var TextInput = TextInputImpl;
    export type UserInterface = UserInterfaceType;
    export var UserInterface = UserInterfaceImpl;
    export type UserPresence = UserPresenceType;
    export var UserPresence = UserPresenceImpl;
    export type View = ViewType;
    export var View = ViewImpl;
    export type WebView = WebViewType;
    export var WebView = WebViewImpl;

    export import CommonProps = RXTypes.CommonProps;
    export import Types = RXTypes;

    export import Component = React.Component;
    export import createElement = React.createElement;
    export import Children = React.Children;
    export var __spread = (React as any).__spread;
}

export = ReactXP;

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.

/* tslint:disable:no-unused-variable */
var _rxImplementsRxInterface: RXInterface.ReactXP = ReactXP;
/* tslint:enable:no-unused-variable */

/*
var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
