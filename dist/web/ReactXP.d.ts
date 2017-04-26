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
import { Accessibility as AccessibilityType } from './Accessibility';
import { ActivityIndicator as ActivityIndicatorImpl } from './ActivityIndicator';
import { Alert as AlertType } from './Alert';
import { App as AppType } from './App';
import { Button as ButtonImpl } from './Button';
import { Picker as PickerImpl } from './Picker';
import { Image as ImageImpl } from './Image';
import { Clipboard as ClipboardType } from './Clipboard';
import { GestureView as GestureViewImpl } from './GestureView';
import { Input as InputType } from './Input';
import { Link as LinkImpl } from './Link';
import { Linking as LinkingType } from './Linking';
import { Location as LocationType } from '../common/Location';
import { Modal as ModalType } from './Modal';
import { Navigator as NavigatorImpl } from './Navigator';
import { Network as NetworkType } from './Network';
import { Platform as PlatformType } from './Platform';
import { Popup as PopupType } from '../web/Popup';
import { ScrollView as ScrollViewImpl } from './ScrollView';
import { StatusBar as StatusBarType } from './StatusBar';
import { Storage as StorageType } from './Storage';
import { Styles as StylesType } from './Styles';
import { Text as TextImpl } from './Text';
import { TextInput as TextInputImpl } from './TextInput';
import { Profiling as ProfilingType } from '../common/Profiling';
import { UserInterface as UserInterfaceType } from './UserInterface';
import { UserPresence as UserPresenceType } from './UserPresence';
import { default as ViewImpl, View as ViewType } from './View';
import { WebView as WebViewImpl } from './WebView';
declare module ReactXP {
    type Accessibility = AccessibilityType;
    var Accessibility: AccessibilityType;
    export import Animated = AnimatedImpl;
    type ActivityIndicator = ActivityIndicatorImpl;
    var ActivityIndicator: typeof ActivityIndicatorImpl;
    type Alert = AlertType;
    var Alert: AlertType;
    type App = AppType;
    var App: AppType;
    type Button = ButtonImpl;
    var Button: typeof ButtonImpl;
    type Picker = PickerImpl;
    var Picker: typeof PickerImpl;
    type Clipboard = ClipboardType;
    var Clipboard: ClipboardType;
    type GestureView = GestureViewImpl;
    var GestureView: typeof GestureViewImpl;
    type Image = ImageImpl;
    var Image: typeof ImageImpl;
    type Input = InputType;
    var Input: InputType;
    type Link = LinkImpl;
    var Link: typeof LinkImpl;
    type Linking = LinkingType;
    var Linking: LinkingType;
    type Location = LocationType;
    var Location: LocationType;
    type Modal = ModalType;
    var Modal: ModalType;
    type Navigator = NavigatorImpl;
    var Navigator: typeof NavigatorImpl;
    type Network = NetworkType;
    var Network: NetworkType;
    type Platform = PlatformType;
    var Platform: PlatformType;
    type Popup = PopupType;
    var Popup: PopupType;
    type Profiling = ProfilingType;
    var Profiling: ProfilingType;
    type ScrollView = ScrollViewImpl;
    var ScrollView: typeof ScrollViewImpl;
    type StatusBar = StatusBarType;
    var StatusBar: StatusBarType;
    type Storage = StorageType;
    var Storage: StorageType;
    type Styles = StylesType;
    var Styles: StylesType;
    type Text = TextImpl;
    var Text: typeof TextImpl;
    type TextInput = TextInputImpl;
    var TextInput: typeof TextInputImpl;
    type UserInterface = UserInterfaceType;
    var UserInterface: UserInterfaceType;
    type UserPresence = UserPresenceType;
    var UserPresence: UserPresenceType;
    type View = ViewType;
    var View: typeof ViewImpl;
    type WebView = WebViewImpl;
    var WebView: typeof WebViewImpl;
    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Types = RXTypes;
    export import Component = React.Component;
    var createElement: typeof React.createElement;
    var Children: React.ReactChildren;
    var __spread: any;
    export import DeviceNetworkType = RXInterface.DeviceNetworkType;
}
export = ReactXP;
