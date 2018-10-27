/**
 * ModuleInterface.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Defines a common base module type information set for all platforms to implement.
 */

import * as RX from './Interfaces';
import * as React from 'react';

export declare module ReactXP {
    export type Accessibility = RX.Accessibility;
    export let Accessibility: RX.Accessibility;
    export type ActivityIndicator = RX.ActivityIndicator;
    export let ActivityIndicator: typeof RX.ActivityIndicator;
    export type Alert = RX.Alert;
    export let Alert: RX.Alert;
    export type App = RX.App;
    export let App: RX.App;
    export type Button = RX.Button;
    export let Button: typeof RX.Button;
    export type Picker = RX.Picker;
    export let Picker: typeof RX.Picker;
    export type Clipboard = RX.Clipboard;
    export let Clipboard: RX.Clipboard;
    export type GestureView = RX.GestureView;
    export let GestureView: typeof RX.GestureView;
    export type Image = RX.Image;
    export let Image: RX.ImageConstructor;
    export type Input = RX.Input;
    export let Input: RX.Input;
    export type International = RX.International;
    export let International: RX.International;
    export type Link = RX.Link;
    export let Link: typeof RX.Link;
    export type Linking = RX.Linking;
    export let Linking: RX.Linking;
    export type Location = RX.Location;
    export let Location: RX.Location;
    export type Modal = RX.Modal;
    export let Modal: RX.Modal;
    export type Network = RX.Network;
    export let Network: RX.Network;
    export type Platform = RX.Platform;
    export let Platform: RX.Platform;
    export type Popup = RX.Popup;
    export let Popup: RX.Popup;
    export type ScrollView = RX.ScrollView;
    export let ScrollView: RX.ScrollViewConstructor;
    export type StatusBar = RX.StatusBar;
    export let StatusBar: RX.StatusBar;
    export type Storage = RX.Storage;
    export let Storage: RX.Storage;
    export type Styles = RX.Styles;
    export let Styles: RX.Styles;
    export type Text = RX.Text;
    export let Text: typeof RX.Text;
    export type TextInput = RX.TextInput;
    export let TextInput: typeof RX.TextInput;
    export type UserInterface = RX.UserInterface;
    export let UserInterface: RX.UserInterface;
    export type UserPresence = RX.UserPresence;
    export let UserPresence: RX.UserPresence;
    export type View = RX.View;
    export let View: typeof RX.View;
    export type WebView = RX.WebView;
    export let WebView: RX.WebViewConstructor;

    export type Animated = RX.Animated;
    export let Animated: RX.Animated;

    export import CommonProps = RX.Types.CommonProps;
    export import CommonStyledProps = RX.Types.CommonStyledProps;
    export import Types = RX.Types;

    export import Component = React.Component;
    export let createElement: typeof React.createElement;
    export let Children: typeof React.Children;
    export let __spread: any;
}
