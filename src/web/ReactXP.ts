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
//
// 1) 'export var Foo = Foo;'
//    TypeScript will get confused if (in the module RX below) you try to create a var with the same name as an import.
//    To avoid this problem, the imports are renamed to 'FooImpl'.
//
// 2) 'import { default as FooImpl }... export var foo = FooImpl;'
//    The way we generate RX.d.ts has extra rules around having the name of the type in scope.
//    This is not a problem if the class was imported directly (regardless of renames). However, the 'default' import is not sufficient as
//    a type name. In order to generate the type of 'foo', the actual 'Foo' class needs to be imported. Of course, the same naming problem
//    exists as (1) so it is imported as 'FooType'. Note: you will see 'FooType' in the generated RX.d.ts ('export var Foo: FooType').

import AccessibilityImpl from './Accessibility';
import { ActivityIndicator as ActivityIndicatorImpl } from './ActivityIndicator';
import AlertImpl from './Alert';
import AppImpl from './App';
import { Button as ButtonImpl } from './Button';
import ClipboardImpl from './Clipboard';
import { GestureView as GestureViewImpl } from './GestureView';
import { Image as ImageImpl } from './Image';
import InputImpl from './Input';
import InternationalImpl from './International';
import { Link as LinkImpl } from './Link';
import LinkingImpl from './Linking';
import LocationImpl from '../common/Location';
import ModalImpl from './Modal';
import NetworkImpl from './Network';
import { Picker as PickerImpl } from './Picker';
import PlatformImpl from './Platform';
import PopupImpl from '../web/Popup';
import { ScrollView as ScrollViewImpl } from './ScrollView';
import StatusBarImpl from './StatusBar';
import StorageImpl from './Storage';
import StylesImpl from './Styles';
import { Text as TextImpl } from './Text';
import { TextInput as TextInputImpl } from './TextInput';
import UserInterfaceImpl from './UserInterface';
import UserPresenceImpl from './UserPresence';
import ViewImpl from './View';
import { ViewBase } from './ViewBase';
import { WebView as WebViewImpl } from './WebView';

// Initialize AutofocusHelper.
import { setSortAndFilterFunc } from '../common/utils/AutoFocusHelper';
import FocusManager from './utils/FocusManager';
setSortAndFilterFunc(FocusManager.sortAndFilterAutoFocusCandidates);

// -- STRANGE THINGS GOING ON HERE --
//
// 1) 'export type Foo = FooImpl; export var Foo = FooImpl;'
//    If the var 'Foo' was exported alone then the name 'RX.Foo' would not be valid in a type position: 'function takesFoo(foo: RX.Foo)'.
//    To avoid this problem, the type information is also exported. TypeScript will merge the var and type together (if the types match).

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

    export import Animated = AnimatedImpl;
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

ViewBase.setActivationState(AppImpl.getActivationState());
AppImpl.activationStateChangedEvent.subscribe(newState => {
    ViewBase.setActivationState(newState);
});

// -- STRANGE THINGS GOING ON HERE --
//
// 1) Unused variable
//    This forces TypeScript to type-check the above RX module against the common RX interface. Missing/incorrect types will cause errors.
//    Note: RX must be a module so 'RX.Foo' can be a valid value ('new RX.Foo') and valid type ('var k: RX.Foo'), but modules cannot
//    implement an interface. If RX was a class or variable then it could directly check this, but then 'RX.Foo' would not be a valid type.

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
