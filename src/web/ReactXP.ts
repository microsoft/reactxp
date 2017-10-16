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
import { Picker as PickerImpl } from './Picker';
import { Image as ImageImpl } from './Image';
import ClipboardImpl from './Clipboard';
import { GestureView as GestureViewImpl } from './GestureView';
import InputImpl from './Input';
import InternationalImpl from './International';
import { Link as LinkImpl } from './Link';
import LinkingImpl from './Linking';
import LocationImpl from '../common/Location';
import ModalImpl from './Modal';
import NetworkImpl from './Network';
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

// -- STRANGE THINGS GOING ON HERE --
//
// 1) 'export type Foo = FooImpl; export var Foo = FooImpl;'
//    If the var 'Foo' was exported alone then the name 'RX.Foo' would not be valid in a type position: 'function takesFoo(foo: RX.Foo)'.
//    To avoid this problem, the type information is also exported. TypeScript will merge the var and type together (if the types match).

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

    export import Animated = AnimatedImpl;
    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Stateless = RXTypes.Stateless;
    export import Types = RXTypes;

    export import Component = React.Component;
    export import ComponentBase = RXTypes.ComponentBase;
    export var createElement = React.createElement;
    export var Children = React.Children;
    export var __spread = (React as any).__spread;
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

var _rxImplementsRxInterface: typeof RXModuleInterface.ReactXP = ReactXP;
_rxImplementsRxInterface = _rxImplementsRxInterface;
export = ReactXP;

/*

var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
