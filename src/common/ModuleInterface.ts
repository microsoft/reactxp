/**
 * ModuleInterface.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Defines a common base module type information set for all platforms to implement.
 */

import * as React from 'react';
import * as RX from './Interfaces';

export declare module ReactXP {
    export type Accessibility = RX.Accessibility;
    export var Accessibility: RX.Accessibility;
    export type ActivityIndicator = RX.ActivityIndicator;
    export var ActivityIndicator: typeof RX.ActivityIndicator;
    export type Alert = RX.Alert;
    export var Alert: RX.Alert;
    export type App = RX.App;
    export var App: RX.App;
    export type Button = RX.Button;
    export var Button: typeof RX.Button;
    export type Picker = RX.Picker;
    export var Picker: typeof RX.Picker;
    export type Clipboard = RX.Clipboard;
    export var Clipboard: RX.Clipboard;
    export type GestureView = RX.GestureView;
    export var GestureView: typeof RX.GestureView;
    export type Image = RX.Image;
    export var Image: RX.ImageConstructor;
    export type Input = RX.Input;
    export var Input: RX.Input;
    export type International = RX.International;
    export var International: RX.International;
    export type Link = RX.Link;
    export var Link: typeof RX.Link;
    export type Linking = RX.Linking;
    export var Linking: RX.Linking;
    export type Location = RX.Location;
    export var Location: RX.Location;
    export type Modal = RX.Modal;
    export var Modal: RX.Modal;
    export type Network = RX.Network;
    export var Network: RX.Network;
    export type Platform = RX.Platform;
    export var Platform: RX.Platform;
    export type Popup = RX.Popup;
    export var Popup: RX.Popup;
    export type ScrollView = RX.ScrollView;
    export var ScrollView: RX.ScrollViewConstructor;
    export type StatusBar = RX.StatusBar;
    export var StatusBar: RX.StatusBar;
    export type Storage = RX.Storage;
    export var Storage: RX.Storage;
    export type Styles = RX.Styles;
    export var Styles: RX.Styles;
    export type Text = RX.Text;
    export var Text: typeof RX.Text;
    export type TextInput = RX.TextInput;
    export var TextInput: typeof RX.TextInput;
    export type UserInterface = RX.UserInterface;
    export var UserInterface: RX.UserInterface;
    export type UserPresence = RX.UserPresence;
    export var UserPresence: RX.UserPresence;
    export type View = RX.View;
    export var View: typeof RX.View;
    export type WebView = RX.WebView;
    export var WebView: RX.WebViewConstructor;

    export type Animated = RX.Animated;
    export var Animated: RX.Animated;

    export import CommonProps = RX.Types.CommonProps;
    export import CommonStyledProps = RX.Types.CommonStyledProps;
    export import Types = RX.Types;

    export import Component = React.Component;
    export var createElement: typeof React.createElement;
    export var Children: typeof React.Children;
    export var __spread: any;
}
