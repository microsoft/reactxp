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
import RXInterface = require('../common/Interfaces');
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

import { default as AccessibilityImpl, Accessibility as AccessibilityType } from './Accessibility';
import { ActivityIndicator as ActivityIndicatorImpl } from './ActivityIndicator';
import { default as AlertImpl, Alert as AlertType } from './Alert';
import { default as AppImpl, App as AppType } from './App';
import { Button as ButtonImpl } from './Button';
import { Picker as PickerImpl } from './Picker';
import { Image as ImageImpl } from './Image';
import { default as ClipboardImpl, Clipboard as ClipboardType } from './Clipboard';
import { GestureView as GestureViewImpl } from './GestureView';
import { default as InputImpl, Input as InputType } from './Input';
import { default as InternationalImpl, International as InternationalType } from './International';
import { Link as LinkImpl } from './Link';
import { default as LinkingImpl, Linking as LinkingType } from './Linking';
import { default as LocationImpl, Location as LocationType } from '../common/Location';
import { default as ModalImpl, Modal as ModalType } from './Modal';
import { Navigator as NavigatorImpl } from './Navigator';
import { default as NetworkImpl, Network as NetworkType } from './Network';
import { default as PlatformImpl, Platform as PlatformType } from './Platform';
import { default as PopupImpl, Popup as PopupType } from '../web/Popup';
import { ScrollView as ScrollViewImpl } from './ScrollView';
import { default as StatusBarImpl, StatusBar as StatusBarType } from './StatusBar';
import { default as StorageImpl, Storage as StorageType } from './Storage';
import { default as StylesImpl, Styles as StylesType } from './Styles';
import { Text as TextImpl } from './Text';
import { TextInput as TextInputImpl } from './TextInput';
import { default as UserInterfaceImpl, UserInterface as UserInterfaceType } from './UserInterface';
import { default as UserPresenceImpl, UserPresence as UserPresenceType } from './UserPresence';
import { default as ViewImpl, View as ViewType } from './View';
import { ViewBase } from './ViewBase';
import { WebView as WebViewImpl } from './WebView';

// -- STRANGE THINGS GOING ON HERE --
//
// 1) 'export type Foo = FooImpl; export var Foo = FooImpl;'
//    If the var 'Foo' was exported alone then the name 'RX.Foo' would not be valid in a type position: 'function takesFoo(foo: RX.Foo)'.
//    To avoid this problem, the type information is also exported. TypeScript will merge the var and type together (if the types match).

module ReactXP {
    export type Accessibility = AccessibilityType;
    export var Accessibility = AccessibilityImpl;
    export import Animated = AnimatedImpl;
    export type ActivityIndicator = ActivityIndicatorImpl;
    export var ActivityIndicator = ActivityIndicatorImpl;
    export type Alert = AlertType;
    export var Alert = AlertImpl;
    export type App = AppType;
    export var App = AppImpl;
    export type Button = ButtonImpl;
    export var Button = ButtonImpl;
    export type Picker = PickerImpl;
    export var Picker = PickerImpl;
    export type Clipboard = ClipboardType;
    export var Clipboard = ClipboardImpl;
    export type GestureView = GestureViewImpl;
    export var GestureView = GestureViewImpl;
    export type Image = ImageImpl;
    export var Image = ImageImpl;
    export type Input = InputType;
    export var Input = InputImpl;
    export type International = InternationalType;
    export var International = InternationalImpl;
    export type Link = LinkImpl;
    export var Link = LinkImpl;
    export type Linking = LinkingType;
    export var Linking = LinkingImpl;
    export type Location = LocationType;
    export var Location = LocationImpl;
    export type Modal = ModalType;
    export var Modal = ModalImpl;
    export type Navigator = NavigatorImpl;
    export var Navigator = NavigatorImpl;
    export type Network = NetworkType;
    export var Network = NetworkImpl;
    export type Platform = PlatformType;
    export var Platform = PlatformImpl;
    export type Popup = PopupType;
    export var Popup = PopupImpl;
    export type ScrollView = ScrollViewImpl;
    export var ScrollView = ScrollViewImpl;
    export type StatusBar = StatusBarType;
    export var StatusBar = StatusBarImpl;
    export type Storage = StorageType;
    export var Storage = StorageImpl;
    export type Styles = StylesType;
    export var Styles = StylesImpl;
    export type Text = TextImpl;
    export var Text = TextImpl;
    export type TextInput = TextInputImpl;
    export var TextInput = TextInputImpl;
    export type UserInterface = UserInterfaceType;
    export var UserInterface = UserInterfaceImpl;
    export type UserPresence = UserPresenceType;
    export var UserPresence = UserPresenceImpl;
    export type View = ViewType;
    export var View = ViewImpl;
    export type WebView = WebViewImpl;
    export var WebView = WebViewImpl;

    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Types = RXTypes;

    export import Component = React.Component;
    export var createElement = React.createElement;
    export var Children = React.Children;
    export var __spread = (React as any).__spread;
}

export = ReactXP;

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

/* tslint:disable:no-unused-variable */
var _rxImplementsRxInterface: RXInterface.ReactXP = ReactXP;
/* tslint:enable:no-unused-variable */

/*

var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
