/**
* ModuleInterface.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Defines a common base module type information set for all platforms to implement.
*/

import React = require('react');

import Interfaces = require('./Interfaces');

import RXTypes = require('../common/Types');

export declare module ReactXP {
    export type Accessibility = Interfaces.Accessibility;
    export var Accessibility: Interfaces.Accessibility;    
    export type ActivityIndicator = Interfaces.ActivityIndicator;
    export var ActivityIndicator: typeof Interfaces.ActivityIndicator;
    export type Alert = Interfaces.Alert;
    export var Alert: Interfaces.Alert;
    export type App = Interfaces.App;
    export var App: Interfaces.App;
    export type Button = Interfaces.Button;
    export var Button: typeof Interfaces.Button;
    export type Picker = Interfaces.Picker;
    export var Picker: typeof Interfaces.Picker;
    export type Clipboard = Interfaces.Clipboard;
    export var Clipboard: Interfaces.Clipboard;
    export type GestureView = Interfaces.GestureView;
    export var GestureView: typeof Interfaces.GestureView;
    export type Image = Interfaces.Image;
    export var Image: Interfaces.ImageConstructor;
    export type Input = Interfaces.Input;
    export var Input: Interfaces.Input;
    export type International = Interfaces.International;
    export var International: Interfaces.International;
    export type Link = Interfaces.Link;
    export var Link: typeof Interfaces.Link;
    export type Linking = Interfaces.Linking;
    export var Linking: Interfaces.Linking;
    export type Location = Interfaces.Location;
    export var Location: Interfaces.Location;
    export type Modal = Interfaces.Modal;
    export var Modal: Interfaces.Modal;
    export type Network = Interfaces.Network;
    export var Network: Interfaces.Network;
    export type Platform = Interfaces.Platform;
    export var Platform: Interfaces.Platform;
    export type Popup = Interfaces.Popup;
    export var Popup: Interfaces.Popup;
    export type ScrollView = Interfaces.ScrollView;
    export var ScrollView: Interfaces.ScrollViewConstructor;
    export type StatusBar = Interfaces.StatusBar;
    export var StatusBar: Interfaces.StatusBar;
    export type Storage = Interfaces.Storage;
    export var Storage: Interfaces.Storage;
    export type Styles = Interfaces.Styles;
    export var Styles: Interfaces.Styles;
    export type Text = Interfaces.Text;
    export var Text: typeof Interfaces.Text;
    export type TextInput = Interfaces.TextInput;
    export var TextInput: typeof Interfaces.TextInput;
    export type UserInterface = Interfaces.UserInterface;
    export var UserInterface: Interfaces.UserInterface;
    export type UserPresence = Interfaces.UserPresence;
    export var UserPresence: Interfaces.UserPresence;
    export type View = Interfaces.View;
    export var View: typeof Interfaces.View;
    export type WebView = Interfaces.WebView;
    export var WebView: Interfaces.WebViewConstructor;

    export type Animated = Interfaces.Animated;
    export var Animated: Interfaces.Animated;

    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Types = RXTypes;

    export import Component = React.Component;
    export var createElement: typeof React.createElement;
    export var Children: typeof React.Children;
    export var __spread: any;
}
