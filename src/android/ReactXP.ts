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

import AnimatedImpl = require('./Animated');
import RXInterfaces = require('../common/Interfaces');
import RXModuleInterface = require('../common/ModuleInterface');
import RXTypes = require('../common/Types');

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.

import AccessibilityImpl from '../native-common/Accessibility';
import ActivityIndicatorImpl from '../native-common/ActivityIndicator';
import AlertImpl from '../native-common/Alert';
import AppImpl from '../native-common/App';
import ButtonImpl from '../native-common/Button';
import PickerImpl from '../native-common/Picker';
import ImageImpl from './Image';
import ClipboardImpl from '../native-common/Clipboard';
import GestureViewImpl from './GestureView';
import InputImpl from '../native-common/Input';
import InternationalImpl from '../native-common/International';
import LinkImpl from '../native-common/Link';
import LinkingImpl from '../native-common/Linking';
import LocationImpl from '../common/Location';
import ModalImpl from '../native-common/Modal';
import NetworkImpl from '../native-common/Network';
import PlatformImpl from '../native-common/Platform';
import PopupImpl from '../native-common/Popup';
import ScrollViewImpl from '../native-common/ScrollView';
import StatusBarImpl from './StatusBar';
import StorageImpl from '../native-common/Storage';
import StylesImpl from '../native-common/Styles';
import TextImpl from './Text';
import TextInputImpl from '../native-common/TextInput';
import UserInterfaceImpl from '../native-common/UserInterface';
import UserPresenceImpl from '../native-common/UserPresence';
import ViewImpl from '../native-common/View';
import WebViewImpl from '../native-common/WebView';
import ViewBase from '../native-common/ViewBase';

// Initialize the Android default view style. This is should not be required because RN for
// Android defaults to overflow 'hidden'. But we are running into issues with removing it
// (probably because it's used for both rendering and layout).
const _defaultViewStyle = StylesImpl.createViewStyle({
    overflow: 'hidden'
});
ViewBase.setDefaultViewStyle(_defaultViewStyle);

// Initialize Android implementation of platform accessibility helpers inside the singleton
// instance of native-common AccessibilityUtil. This is to let native-common components access
// platform specific APIs through native-common implementation itself. 
import AccessibilityUtil from '../native-common/AccessibilityUtil';
import AccessibilityPlatformUtil  from './AccessibilityUtil';

AccessibilityUtil.setAccessibilityPlatformUtil(AccessibilityPlatformUtil);

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.

module ReactXP {
    export type Accessibility = RXInterfaces.Accessibility;
    export var Accessibility: RXInterfaces.Accessibility = AccessibilityImpl;
    export type ActivityIndicator = RXInterfaces.ActivityIndicator;
    export var ActivityIndicator: typeof RXInterfaces.ActivityIndicator = ActivityIndicatorImpl;
    export type Alert = RXInterfaces.Alert;
    export var Alert: RXInterfaces.Alert = AlertImpl;
    export type App = RXInterfaces.App;
    export var App: RXInterfaces.App = AppImpl;
    export type Button = RXInterfaces.Button;
    export var Button: typeof RXInterfaces.Button = ButtonImpl;
    export type Picker = RXInterfaces.Picker;
    export var Picker: typeof RXInterfaces.Picker = PickerImpl;
    export type Clipboard = RXInterfaces.Clipboard;
    export var Clipboard: RXInterfaces.Clipboard = ClipboardImpl;
    export type GestureView = RXInterfaces.GestureView;
    export var GestureView: typeof RXInterfaces.GestureView = GestureViewImpl;
    export type Image = RXInterfaces.Image;
    export var Image: RXInterfaces.ImageConstructor = ImageImpl;
    export type Input = RXInterfaces.Input;
    export var Input: RXInterfaces.Input = InputImpl;
    export type International = RXInterfaces.International;
    export var International: RXInterfaces.International = InternationalImpl;
    export type Link = RXInterfaces.Link;
    export var Link: typeof RXInterfaces.Link = LinkImpl;
    export type Linking = RXInterfaces.Linking;
    export var Linking: RXInterfaces.Linking = LinkingImpl;
    export type Location = RXInterfaces.Location;
    export var Location: RXInterfaces.Location = LocationImpl;
    export type Modal = RXInterfaces.Modal;
    export var Modal: RXInterfaces.Modal = ModalImpl;
    export type Network = RXInterfaces.Network;
    export var Network: RXInterfaces.Network = NetworkImpl;
    export type Platform = RXInterfaces.Platform;
    export var Platform: RXInterfaces.Platform = PlatformImpl;
    export type Popup = RXInterfaces.Popup;
    export var Popup: RXInterfaces.Popup = PopupImpl;
    export type ScrollView = RXInterfaces.ScrollView;
    export var ScrollView: RXInterfaces.ScrollViewConstructor = ScrollViewImpl;
    export type StatusBar = RXInterfaces.StatusBar;
    export var StatusBar: RXInterfaces.StatusBar = StatusBarImpl;
    export type Storage = RXInterfaces.Storage;
    export var Storage: RXInterfaces.Storage = StorageImpl;
    export type Styles = RXInterfaces.Styles;
    export var Styles: RXInterfaces.Styles = StylesImpl;
    export type Text = RXInterfaces.Text;
    export var Text: typeof RXInterfaces.Text = TextImpl;
    export type TextInput = RXInterfaces.TextInput;
    export var TextInput: typeof RXInterfaces.TextInput = TextInputImpl;
    export type UserInterface = RXInterfaces.UserInterface;
    export var UserInterface: RXInterfaces.UserInterface = UserInterfaceImpl;
    export type UserPresence = RXInterfaces.UserPresence;
    export var UserPresence: RXInterfaces.UserPresence = UserPresenceImpl;
    export type View = RXInterfaces.View;
    export var View: typeof RXInterfaces.View = ViewImpl;
    export type WebView = RXInterfaces.WebView;
    export var WebView: RXInterfaces.WebViewConstructor = WebViewImpl;

    export import Animated = AnimatedImpl.Animated;
    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Stateless = RXTypes.Stateless;
    export import Types = RXTypes;

    export import Component = React.Component;
    export import ComponentBase = RXTypes.ComponentBase;
    export import createElement = React.createElement;
    export import Children = React.Children;
    export var __spread = (React as any).__spread;
}

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.

var _rxImplementsRxInterface: typeof RXModuleInterface.ReactXP = ReactXP;
_rxImplementsRxInterface = _rxImplementsRxInterface;
export = ReactXP;

/*
var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
