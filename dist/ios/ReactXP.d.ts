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
import RXInterface = require('../common/Interfaces');
import RXTypes = require('../common/Types');
import AnimatedImpl = require('../native-common/Animated');
import { Accessibility as AccessibilityType } from './Accessibility';
import { default as ActivityIndicatorImpl } from '../native-common/ActivityIndicator';
import { Alert as AlertType } from '../native-common/Alert';
import { App as AppType } from '../native-common/App';
import { default as ButtonImpl, Button as ButtonType } from '../native-common/Button';
import { default as PickerImpl, Picker as PickerType } from '../native-common/Picker';
import { default as ImageImpl, Image as ImageType } from '../native-common/Image';
import { Input as InputType } from '../native-common/Input';
import { Clipboard as ClipboardType } from '../native-common/Clipboard';
import { default as GestureViewImpl, GestureView as GestureViewType } from './GestureView';
import { default as LinkImpl, Link as LinkType } from '../native-common/Link';
import { Linking as LinkingType } from './Linking';
import { Location as LocationType } from '../common/Location';
import { Modal as ModalType } from '../native-common/Modal';
import { default as NavigatorImpl, Navigator as NavigatorType } from '../native-common/Navigator';
import { Network as NetworkType } from '../native-common/Network';
import { Platform as PlatformType } from '../native-common/Platform';
import { Popup as PopupType } from '../native-common/Popup';
import { default as ScrollViewImpl, ScrollView as ScrollViewType } from '../native-common/ScrollView';
import { StatusBar as StatusBarType } from './StatusBar';
import { Storage as StorageType } from '../native-common/Storage';
import { Styles as StylesType } from '../native-common/Styles';
import { default as TextImpl, Text as TextType } from '../native-common/Text';
import { default as TextInputImpl, TextInput as TextInputType } from '../native-common/TextInput';
import { Profiling as ProfilingType } from '../native-common/Profiling';
import { UserInterface as UserInterfaceType } from '../native-common/UserInterface';
import { UserPresence as UserPresenceType } from '../native-common/UserPresence';
import { default as ViewImpl, View as ViewType } from '../native-common/View';
import { default as WebViewImpl, WebView as WebViewType } from '../native-common/WebView';
declare module ReactXP {
    type Accessibility = AccessibilityType;
    var Accessibility: AccessibilityType;
    export import Animated = AnimatedImpl.Animated;
    type ActivityIndicator = ActivityIndicatorImpl;
    var ActivityIndicator: typeof ActivityIndicatorImpl;
    type Alert = AlertType;
    var Alert: AlertType;
    type App = AppType;
    var App: AppType;
    type Button = ButtonType;
    var Button: typeof ButtonImpl;
    type Picker = PickerType;
    var Picker: typeof PickerImpl;
    type Clipboard = ClipboardType;
    var Clipboard: ClipboardType;
    type GestureView = GestureViewType;
    var GestureView: typeof GestureViewImpl;
    type Image = ImageType;
    var Image: typeof ImageImpl;
    type Input = InputType;
    var Input: InputType;
    type Link = LinkType;
    var Link: typeof LinkImpl;
    type Linking = LinkingType;
    var Linking: LinkingType;
    type Location = LocationType;
    var Location: LocationType;
    type Modal = ModalType;
    var Modal: ModalType;
    type Navigator = NavigatorType;
    var Navigator: typeof NavigatorImpl;
    type Network = NetworkType;
    var Network: NetworkType;
    type Platform = PlatformType;
    var Platform: PlatformType;
    type Popup = PopupType;
    var Popup: PopupType;
    type Profiling = ProfilingType;
    var Profiling: ProfilingType;
    type ScrollView = ScrollViewType;
    var ScrollView: typeof ScrollViewImpl;
    type StatusBar = StatusBarType;
    var StatusBar: StatusBarType;
    type Storage = StorageType;
    var Storage: StorageType;
    type Styles = StylesType;
    var Styles: StylesType;
    type Text = TextType;
    var Text: typeof TextImpl;
    type TextInput = TextInputType;
    var TextInput: typeof TextInputImpl;
    type UserInterface = UserInterfaceType;
    var UserInterface: UserInterfaceType;
    type UserPresence = UserPresenceType;
    var UserPresence: UserPresenceType;
    type View = ViewType;
    var View: typeof ViewImpl;
    type WebView = WebViewType;
    var WebView: typeof WebViewImpl;
    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Types = RXTypes;
    export import Component = React.Component;
    export import createElement = React.createElement;
    export import Children = React.Children;
    var __spread: any;
    export import DeviceNetworkType = RXInterface.DeviceNetworkType;
}
export = ReactXP;
