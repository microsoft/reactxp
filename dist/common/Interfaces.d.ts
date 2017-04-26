/**
* Interfaces.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Defines the template for the ReactXP interface that needs to be
* implemented for each platform.
*/
import React = require('react');
import SyncTasks = require('synctasks');
import SubscribableEvent = require('./SubscribableEvent');
import Types = require('./Types');
export import Types = Types;
export interface ReactXP {
    ActivityIndicator: typeof ActivityIndicator;
    Alert: Alert;
    App: App;
    Button: typeof Button;
    Picker: typeof Picker;
    Clipboard: Clipboard;
    DeviceNetworkType: typeof DeviceNetworkType;
    Image: typeof Image;
    GestureView: typeof GestureView;
    Input: Input;
    Link: typeof Link;
    Storage: Storage;
    Location: Location;
    Modal: Modal;
    Navigator: typeof Navigator;
    Network: Network;
    Platform: Platform;
    Popup: Popup;
    Profiling: Profiling;
    ScrollView: typeof ScrollView;
    StatusBar: StatusBar;
    Styles: Styles;
    Text: typeof Text;
    TextInput: typeof TextInput;
    UserInterface: UserInterface;
    UserPresence: UserPresence;
    View: typeof View;
    WebView: typeof WebView;
    Component: typeof Component;
    createElement: any;
    Children: typeof React.Children;
    Types: typeof Types;
    __spread: any;
    Animated: Animated;
}
export declare class ActivityIndicator<S> extends React.Component<Types.ActivityIndicatorProps, S> {
}
export declare abstract class Alert {
    abstract show(title: string, message?: string, buttons?: Types.AlertButtonSpec[]): void;
}
export declare abstract class AnimatedComponent<P extends Types.CommonProps, T> extends React.Component<P, T> {
    abstract setNativeProps(props: P): void;
}
export declare abstract class AnimatedImage extends AnimatedComponent<Types.AnimatedImageProps, {}> {
}
export declare abstract class AnimatedText extends AnimatedComponent<Types.AnimatedTextProps, {}> {
}
export declare abstract class AnimatedTextInput extends AnimatedComponent<Types.AnimatedTextInputProps, {}> {
}
export declare abstract class AnimatedView extends AnimatedComponent<Types.AnimatedViewProps, {}> {
}
export interface IAnimatedValue {
    setValue(value: number): void;
    addListener(callback: any): number;
    removeListener(id: string): void;
    removeAllListeners(): void;
    interpolate(config: any): AnimatedValue;
}
export declare abstract class AnimatedValue implements IAnimatedValue {
    constructor(val: number);
    abstract setValue(value: number): void;
    abstract addListener(callback: any): number;
    abstract removeListener(id: string): void;
    abstract removeAllListeners(): void;
    abstract interpolate(config: any): AnimatedValue;
}
export declare abstract class Profiling {
    abstract start(): void;
    abstract stop(): void;
    abstract printResults(config: Types.ProfilingLoggingConfig): void;
    abstract installWatchdog(): void;
}
export declare abstract class App {
    initialize(debug: boolean, development: boolean): void;
    abstract getActivationState(): Types.AppActivationState;
    activationStateChangedEvent: SubscribableEvent.SubscribableEvent<(state: Types.AppActivationState) => void>;
    memoryWarningEvent: SubscribableEvent.SubscribableEvent<() => void>;
}
export declare abstract class UserInterface {
    abstract setMainView(element: React.ReactElement<any>): void;
    abstract useCustomScrollbars(enable: boolean): void;
    abstract isHighPixelDensityScreen(): boolean;
    abstract getPixelRatio(): number;
    abstract measureLayoutRelativeToWindow(component: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo>;
    abstract measureLayoutRelativeToAncestor(component: React.Component<any, any>, ancestor: React.Component<any, any>): SyncTasks.Promise<Types.LayoutInfo>;
    abstract measureWindow(): Types.Dimensions;
    abstract getContentSizeMultiplier(): SyncTasks.Promise<number>;
    contentSizeMultiplierChangedEvent: SubscribableEvent.SubscribableEvent<(multiplier: number) => void>;
    abstract dismissKeyboard(): void;
}
export declare abstract class Modal {
    abstract isDisplayed(modalId: string): boolean;
    abstract show(modal: React.ReactElement<Types.ViewProps>, modalId: string): void;
    abstract dismiss(modalId: string): void;
    abstract dismissAll(): void;
}
export declare abstract class Popup {
    abstract show(options: Types.PopupOptions, popupId: string, delay?: number): boolean;
    abstract autoDismiss(popupId: string, delay?: number): void;
    abstract dismiss(popupId: string): void;
    abstract dismissAll(): void;
}
export declare abstract class Linking {
    abstract getInitialUrl(): SyncTasks.Promise<string>;
    deepLinkRequestEvent: SubscribableEvent.SubscribableEvent<(url: string) => void>;
    abstract openUrl(url: string): SyncTasks.Promise<void>;
    abstract launchSms(smsData: Types.SmsInfo): SyncTasks.Promise<void>;
    abstract launchEmail(emailData: Types.EmailInfo): SyncTasks.Promise<void>;
}
export declare abstract class Accessibility {
    abstract isScreenReaderEnabled(): boolean;
    abstract announceForAccessibility(announcement: string): void;
    screenReaderChangedEvent: SubscribableEvent.SubscribableEvent<(isEnabled: boolean) => void>;
}
export declare abstract class Button<S> extends React.Component<Types.ButtonProps, S> {
}
export declare abstract class Picker extends React.Component<Types.PickerProps, {}> {
}
export declare class Component<P, T> extends React.Component<P, T> {
}
export declare abstract class Image<S> extends React.Component<Types.ImageProps, S> {
}
export declare abstract class Clipboard {
    abstract setText(text: string): void;
    abstract getText(): SyncTasks.Promise<string>;
}
export declare abstract class Link<S> extends React.Component<Types.LinkProps, S> {
}
export declare abstract class Storage {
    abstract getItem(key: string): SyncTasks.Promise<string>;
    abstract setItem(key: string, value: string): SyncTasks.Promise<void>;
    abstract removeItem(key: string): SyncTasks.Promise<void>;
    abstract clear(): SyncTasks.Promise<void>;
}
export declare abstract class Location {
    abstract isAvailable(): boolean;
    abstract setConfiguration(config: LocationConfiguration): void;
    abstract getCurrentPosition(options?: PositionOptions): SyncTasks.Promise<Position>;
    abstract watchPosition(successCallback: Types.LocationSuccessCallback, errorCallback?: Types.LocationFailureCallback, options?: PositionOptions): SyncTasks.Promise<Types.LocationWatchId>;
    abstract clearWatch(watchID: Types.LocationWatchId): void;
}
export interface LocationConfiguration {
    skipPermissionRequests: boolean;
}
export declare abstract class Navigator<S> extends React.Component<Types.NavigatorProps, S> {
    abstract push(route: Types.NavigatorRoute): void;
    abstract pop(): void;
    abstract replace(route: Types.NavigatorRoute): void;
    abstract replacePrevious(route: Types.NavigatorRoute): void;
    abstract replaceAtIndex(route: Types.NavigatorRoute, index: number): void;
    abstract immediatelyResetRouteStack(nextRouteStack: Types.NavigatorRoute[]): void;
    abstract popToRoute(route: Types.NavigatorRoute): void;
    abstract popToTop(): void;
    abstract getCurrentRoutes(): Types.NavigatorRoute[];
}
export declare enum DeviceNetworkType {
    UNKNOWN = 0,
    NONE = 1,
    WIFI = 2,
    MOBILE_2G = 3,
    MOBILE_3G = 4,
    MOBILE_4G = 5,
}
export declare abstract class Network {
    abstract isConnected(): SyncTasks.Promise<boolean>;
    connectivityChangedEvent: SubscribableEvent.SubscribableEvent<(isConnected: boolean) => void>;
}
export declare abstract class Platform {
    abstract getType(): Types.PlatformType;
}
export declare abstract class Input {
    backButtonEvent: SubscribableEvent.SubscribableEvent<() => boolean>;
    keyDownEvent: SubscribableEvent.SubscribableEvent<(e: Types.KeyboardEvent) => boolean>;
    keyUpEvent: SubscribableEvent.SubscribableEvent<(e: Types.KeyboardEvent) => boolean>;
}
export interface IScrollView {
    setScrollTop(scrollTop: number, animate: boolean): void;
    setScrollLeft(scrollLeft: number, animate: boolean): void;
    addToScrollTop(deltaTop: number, animate: boolean): void;
    addToScrollLeft(deltaLeft: number, animate: boolean): void;
}
export declare abstract class ScrollView<S> extends React.Component<Types.ScrollViewProps, S> implements IScrollView {
    abstract setScrollTop(scrollTop: number, animate: boolean): void;
    abstract setScrollLeft(scrollLeft: number, animate: boolean): void;
    abstract addToScrollTop(deltaTop: number, animate: boolean): void;
    abstract addToScrollLeft(deltaLeft: number, animate: boolean): void;
}
export declare abstract class StatusBar {
    abstract isOverlay(): boolean;
    abstract setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void;
    abstract setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void;
    abstract setNetworkActivityIndicatorVisible(value: boolean): void;
    abstract setBackgroundColor(color: string, animated: boolean): void;
    abstract setTranslucent(translucent: boolean): void;
}
export declare abstract class Styles {
    abstract createViewStyle(ruleSet: Types.ViewStyle, cacheStyle?: boolean): Types.ViewStyleRuleSet;
    abstract createAnimatedViewStyle(ruleSet: Types.AnimatedViewStyle): Types.AnimatedViewStyleRuleSet;
    abstract createScrollViewStyle(ruleSet: Types.ScrollViewStyle, cacheStyle?: boolean): Types.ScrollViewStyleRuleSet;
    abstract createButtonStyle(ruleSet: Types.ButtonStyle, cacheStyle?: boolean): Types.ButtonStyleRuleSet;
    abstract createWebViewStyle(ruleSet: Types.WebViewStyle, cacheStyle?: boolean): Types.WebViewStyleRuleSet;
    abstract createTextStyle(ruleSet: Types.TextStyle, cacheStyle?: boolean): Types.TextStyleRuleSet;
    abstract createAnimatedTextStyle(ruleSet: Types.AnimatedTextStyle): Types.AnimatedTextStyleRuleSet;
    abstract createTextInputStyle(ruleSet: Types.TextInputStyle, cacheStyle?: boolean): Types.TextInputStyleRuleSet;
    abstract createImageStyle(ruleSet: Types.ImageStyle, cacheStyle?: boolean): Types.ImageStyleRuleSet;
    abstract createAnimatedImageStyle(ruleSet: Types.AnimatedImageStyle): Types.AnimatedImageStyleRuleSet;
    abstract createLinkStyle(ruleSet: Types.LinkStyleRuleSet, cacheStyle?: boolean): Types.LinkStyleRuleSet;
    abstract createPickerStyle(ruleSet: Types.PickerStyle, cacheStyle?: boolean): Types.PickerStyleRuleSet;
}
export declare abstract class Text<S> extends React.Component<Types.TextProps, S> {
}
export declare abstract class TextInput<S> extends React.Component<Types.TextInputProps, S> {
    abstract blur(): void;
    abstract focus(): void;
    abstract isFocused(): boolean;
    abstract selectAll(): void;
    abstract selectRange(start: number, end: number): void;
    abstract getSelectionRange(): {
        start: number;
        end: number;
    };
    abstract setValue(value: string): void;
}
export declare abstract class UserPresence {
    abstract isUserPresent(): boolean;
    userPresenceChangedEvent: SubscribableEvent.SubscribableEvent<(isPresent: boolean) => void>;
}
export declare abstract class ViewBase<P, S> extends React.Component<P, S> {
}
export declare abstract class View<S> extends ViewBase<Types.ViewProps, S> {
}
export declare abstract class GestureView<S> extends ViewBase<Types.GestureViewProps, S> {
}
export declare abstract class WebView<S> extends ViewBase<Types.WebViewProps, S> {
}
export interface Animated {
    Image: typeof AnimatedImage;
    Text: typeof AnimatedText;
    View: typeof AnimatedView;
    Value: typeof AnimatedValue;
    Easing: Types.Animated.Easing;
    timing: Types.Animated.TimingFunction;
    parallel: Types.Animated.ParallelFunction;
    sequence: Types.Animated.SequenceFunction;
}
