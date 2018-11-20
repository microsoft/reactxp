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

import RN = require('react-native');

import { CommonAnimatedClasses, makeAnimated } from '../native-common/Animated';
import RXInterfaces = require('../common/Interfaces');
import RXModuleInterface = require('../common/ModuleInterface');
import RXTypes = require('../common/Types');

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.

import AccessibilityImpl from './Accessibility';
import ActivityIndicatorImpl from '../native-common/ActivityIndicator';
import AlertImpl from '../native-common/Alert';
import AppImpl from '../native-common/App';
import ButtonImpl from '../native-common/Button';
import ClipboardImpl from '../native-common/Clipboard';
import GestureViewImpl from './GestureView';
import ImageImpl from './Image';
import InputImpl from '../native-common/Input';
import InternationalImpl from '../native-common/International';
import LinkImpl from '../native-common/Link';
import LinkingImpl from '../native-common/Linking';
import LocationImpl from '../common/Location';
import ModalImpl from '../native-common/Modal';
import NetworkImpl from '../native-common/Network';
import PickerImpl from '../native-common/Picker';
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
import ViewBase from '../native-common/ViewBase';
import WebViewImpl from '../native-common/WebView';

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
import AccessibilityPlatformUtil from './AccessibilityUtil';

AccessibilityUtil.setAccessibilityPlatformUtil(AccessibilityPlatformUtil);

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.

module ReactXP {
    export type Accessibility = RXInterfaces.Accessibility;
    export let Accessibility: RXInterfaces.Accessibility = AccessibilityImpl;
    export type ActivityIndicator = RXInterfaces.ActivityIndicator;
    export let ActivityIndicator: typeof RXInterfaces.ActivityIndicator = ActivityIndicatorImpl;
    export type Alert = RXInterfaces.Alert;
    export let Alert: RXInterfaces.Alert = AlertImpl;
    export type App = RXInterfaces.App;
    export let App: RXInterfaces.App = AppImpl;
    export type Button = RXInterfaces.Button;
    export let Button: typeof RXInterfaces.Button = ButtonImpl;
    export type Picker = RXInterfaces.Picker;
    export let Picker: typeof RXInterfaces.Picker = PickerImpl;
    export type Clipboard = RXInterfaces.Clipboard;
    export let Clipboard: RXInterfaces.Clipboard = ClipboardImpl;
    export type GestureView = RXInterfaces.GestureView;
    export let GestureView: typeof RXInterfaces.GestureView = GestureViewImpl;
    export type Image = RXInterfaces.Image;
    export let Image: RXInterfaces.ImageConstructor = ImageImpl;
    export type Input = RXInterfaces.Input;
    export let Input: RXInterfaces.Input = InputImpl;
    export type International = RXInterfaces.International;
    export let International: RXInterfaces.International = InternationalImpl;
    export type Link = RXInterfaces.Link;
    export let Link: typeof RXInterfaces.Link = LinkImpl;
    export type Linking = RXInterfaces.Linking;
    export let Linking: RXInterfaces.Linking = LinkingImpl;
    export type Location = RXInterfaces.Location;
    export let Location: RXInterfaces.Location = LocationImpl;
    export type Modal = RXInterfaces.Modal;
    export let Modal: RXInterfaces.Modal = ModalImpl;
    export type Network = RXInterfaces.Network;
    export let Network: RXInterfaces.Network = NetworkImpl;
    export type Platform = RXInterfaces.Platform;
    export let Platform: RXInterfaces.Platform = PlatformImpl;
    export type Popup = RXInterfaces.Popup;
    export let Popup: RXInterfaces.Popup = PopupImpl;
    export type ScrollView = RXInterfaces.ScrollView;
    export let ScrollView: RXInterfaces.ScrollViewConstructor = ScrollViewImpl;
    export type StatusBar = RXInterfaces.StatusBar;
    export let StatusBar: RXInterfaces.StatusBar = StatusBarImpl;
    export type Storage = RXInterfaces.Storage;
    export let Storage: RXInterfaces.Storage = StorageImpl;
    export type Styles = RXInterfaces.Styles;
    export let Styles: RXInterfaces.Styles = StylesImpl;
    export type Text = RXInterfaces.Text;
    export let Text: typeof RXInterfaces.Text = TextImpl;
    export type TextInput = RXInterfaces.TextInput;
    export let TextInput: typeof RXInterfaces.TextInput = TextInputImpl;
    export type UserInterface = RXInterfaces.UserInterface;
    export let UserInterface: RXInterfaces.UserInterface = UserInterfaceImpl;
    export type UserPresence = RXInterfaces.UserPresence;
    export let UserPresence: RXInterfaces.UserPresence = UserPresenceImpl;
    export type View = RXInterfaces.View;
    export let View: typeof RXInterfaces.View = ViewImpl;
    export type WebView = RXInterfaces.WebView;
    export let WebView: RXInterfaces.WebViewConstructor = WebViewImpl;

    const androidAnimatedClasses =  {
        ...CommonAnimatedClasses,
        Text: RN.Animated.createAnimatedComponent(TextImpl)
    };

    export const Animated = makeAnimated(androidAnimatedClasses);
    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Stateless = RXTypes.Stateless;
    export import Types = RXTypes;

    export import Component = React.Component;
    export import ComponentBase = RXTypes.ComponentBase;
    export import createElement = React.createElement;
    export import Children = React.Children;
    export let __spread = (React as any).__spread;
    export import Fragment = React.Fragment;
}

// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.ts for more details.

// tslint:disable-next-line
var _rxImplementsRxInterface: typeof RXModuleInterface.ReactXP = ReactXP;
_rxImplementsRxInterface = _rxImplementsRxInterface;
export = ReactXP;

/*
var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
