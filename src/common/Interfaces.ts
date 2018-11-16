/**
 * Interfaces.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Defines the template for the ReactXP interface that needs to be
 * implemented for each platform.
 */

import * as React from 'react';
import SubscribableEvent from 'subscribableevent';
import * as SyncTasks from 'synctasks';

import AppConfig from './AppConfig';
import * as Types from './Types';

export { Types };

export abstract class ActivityIndicator extends React.Component<Types.ActivityIndicatorProps> {}

export abstract class Alert {
    abstract show(title: string, message?: string, buttons?: Types.AlertButtonSpec[],
        options?: Types.AlertOptions): void;
}

export abstract class AnimatedComponent<P extends Types.CommonProps, T> extends React.Component<P, T> {
    abstract setNativeProps(props: P): void;
}

export abstract class AnimatedImage extends AnimatedComponent<Types.AnimatedImageProps, Types.Stateless> {
}

export abstract class AnimatedText extends AnimatedComponent<Types.AnimatedTextProps, Types.Stateless> {
}

export abstract class AnimatedTextInput extends AnimatedComponent<Types.AnimatedTextInputProps, Types.Stateless> {
}

export abstract class AnimatedView extends AnimatedComponent<Types.AnimatedViewProps, Types.Stateless> implements FocusableComponent {
    abstract setFocusRestricted(restricted: boolean): void;
    abstract setFocusLimited(limited: boolean): void;
    abstract focus(): void;
    abstract requestFocus(): void;
    abstract blur(): void;
}

export abstract class App {
    supportsExperimentalKeyboardNavigation = false;

    // Initialization
    initialize(debug: boolean, development: boolean): void {
        AppConfig.setAppConfig(debug, development);
    }

    // Activation State
    abstract getActivationState(): Types.AppActivationState;
    activationStateChangedEvent = new SubscribableEvent<(state: Types.AppActivationState) => void>();

    // Memory Warnings
    memoryWarningEvent = new SubscribableEvent<() => void>();
}

export abstract class UserInterface {
    abstract setMainView(element: React.ReactElement<any>): void;
    abstract registerRootView(viewKey: string, getComponentFunc: Function): void;

    abstract useCustomScrollbars(enable?: boolean): void;

    // Screen Information
    abstract isHighPixelDensityScreen(): boolean;
    abstract getPixelRatio(): number;

    // Measurements
    abstract measureLayoutRelativeToWindow(component: React.Component<any>):
        SyncTasks.Promise<Types.LayoutInfo>;
    abstract measureLayoutRelativeToAncestor(component: React.Component<any>,
        ancestor: React.Component<any>): SyncTasks.Promise<Types.LayoutInfo>;
    abstract measureWindow(rootViewId?: string): Types.Dimensions;

    // Content Size Multiplier
    abstract getContentSizeMultiplier(): SyncTasks.Promise<number>;
    contentSizeMultiplierChangedEvent = new SubscribableEvent<(multiplier: number) => void>();
    abstract setMaxContentSizeMultiplier(maxContentSizeMultiplier: number): void;

    // On-screen Keyboard
    abstract dismissKeyboard(): void;

    // Latency Warnings
    abstract enableTouchLatencyEvents(latencyThresholdMs: number): void;
    touchLatencyEvent = new SubscribableEvent<(observedLatencyMs: number) => void>();

    // Keyboard navigation
    abstract isNavigatingWithKeyboard(): boolean;
    keyboardNavigationEvent = new SubscribableEvent<(isNavigatingWithKeyboard: boolean) => void>();
}

export abstract class Modal {
    abstract isDisplayed(modalId?: string): boolean;
    abstract show(modal: React.ReactElement<Types.ViewProps>, modalId: string, options?: Types.ModalOptions): void;
    abstract dismiss(modalId: string): void;
    abstract dismissAll(): void;
}

export abstract class Popup {
    abstract show(options: Types.PopupOptions, popupId: string, delay?: number): boolean;
    abstract autoDismiss(popupId: string, delay?: number): void;
    abstract dismiss(popupId: string): void;
    abstract dismissAll(): void;
    abstract isDisplayed(popupId?: string): boolean;
}

export abstract class Linking {
    // Incoming deep links
    abstract getInitialUrl(): SyncTasks.Promise<string | undefined>;
    deepLinkRequestEvent = new SubscribableEvent<(url: string) => void>();

    // Outgoing deep links
    abstract openUrl(url: string): SyncTasks.Promise<void>;
    abstract launchSms(smsData: Types.SmsInfo): SyncTasks.Promise<void>;
    abstract launchEmail(emailData: Types.EmailInfo): SyncTasks.Promise<void>;

    protected abstract _createEmailUrl(emailInfo: Types.EmailInfo): string;
}

export abstract class Accessibility {
    abstract isScreenReaderEnabled(): boolean;
    abstract isHighContrastEnabled(): boolean;
    abstract announceForAccessibility(announcement: string): void;
    screenReaderChangedEvent = new SubscribableEvent<(isEnabled: boolean) => void>();
    highContrastChangedEvent = new SubscribableEvent<(isEnabled: boolean) => void>();
}

export interface FocusableComponent {
    focus(): void;
    requestFocus(): void;
    blur(): void;
}

export abstract class Button extends React.Component<Types.ButtonProps> implements FocusableComponent {
    abstract focus(): void;
    abstract requestFocus(): void;
    abstract blur(): void;
}

export abstract class Picker extends React.Component<Types.PickerProps, Types.Stateless> {}

export class Component<P, T> extends React.Component<P, T> {}

export interface ImageConstructor {
    new (props: Types.ImageProps): Image;

    prefetch(url: string): SyncTasks.Promise<boolean>;
    getMetadata(url: string): SyncTasks.Promise<Types.ImageMetadata>;
}

export abstract class Image extends React.Component<Types.ImageProps> {
    abstract getNativeWidth(): number | undefined;
    abstract getNativeHeight(): number | undefined;
}

export abstract class Clipboard {
    abstract setText(text: string): void;
    abstract getText(): SyncTasks.Promise<string>;
}

export abstract class Link extends React.Component<Types.LinkProps> implements FocusableComponent {
    abstract focus(): void;
    abstract requestFocus(): void;
    abstract blur(): void;
}

export abstract class Storage {
    abstract getItem(key: string): SyncTasks.Promise<string | undefined>;
    abstract setItem(key: string, value: string): SyncTasks.Promise<void>;
    abstract removeItem(key: string): SyncTasks.Promise<void>;
    abstract clear(): SyncTasks.Promise<void>;
}

export abstract class Location {
    abstract isAvailable(): boolean;
    abstract setConfiguration(config: LocationConfiguration): void;
    abstract getCurrentPosition(options?: PositionOptions): SyncTasks.Promise<Position>;
    abstract watchPosition(successCallback: Types.LocationSuccessCallback, errorCallback?: Types.LocationFailureCallback,
        options?: PositionOptions): SyncTasks.Promise<Types.LocationWatchId>;
    abstract clearWatch(watchID: Types.LocationWatchId): void;
}

export interface LocationConfiguration {
    // if true, assumes permission is already granted
    skipPermissionRequests: boolean;
}

export abstract class Network {
    abstract isConnected(): SyncTasks.Promise<boolean>;
    abstract getType(): SyncTasks.Promise<Types.DeviceNetworkType>;
    connectivityChangedEvent = new SubscribableEvent<(isConnected: boolean) => void>();
}

export abstract class Platform {
    abstract getType(): Types.PlatformType;
    abstract select<T>(specifics: { [ platform in Types.PlatformType | 'default' ]?: T }): T | undefined;
}

export abstract class Input {
    backButtonEvent = new SubscribableEvent<() => boolean>(true);
    keyDownEvent = new SubscribableEvent<(e: Types.KeyboardEvent) => boolean>(true);
    keyUpEvent = new SubscribableEvent<(e: Types.KeyboardEvent) => boolean>(true);
}

export interface ScrollViewConstructor {
    new(props: Types.ScrollViewProps): ScrollView;
}

export interface ScrollView extends React.Component<Types.ScrollViewProps> {
    setScrollTop(scrollTop: number, animate?: boolean): void;
    setScrollLeft(scrollLeft: number, animate?: boolean): void;
}

export abstract class StatusBar {
    abstract isOverlay(): boolean;
    abstract setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void;
    abstract setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void;
    abstract setNetworkActivityIndicatorVisible(value: boolean): void;
    abstract setBackgroundColor(color: string, animated: boolean): void;
    abstract setTranslucent(translucent: boolean): void;
}

export abstract class Styles {
    abstract combine<T>(ruleSet1: Types.StyleRuleSetRecursive<T> | undefined, ruleSet2?: Types.StyleRuleSetRecursive<T>)
        : Types.StyleRuleSetOrArray<T> | undefined;
    abstract createViewStyle(ruleSet: Types.ViewStyle, cacheStyle?: boolean): Types.ViewStyleRuleSet;
    abstract createAnimatedViewStyle(ruleSet: Types.AnimatedViewStyle): Types.AnimatedViewStyleRuleSet;
    abstract createScrollViewStyle(ruleSet: Types.ScrollViewStyle, cacheStyle?: boolean): Types.ScrollViewStyleRuleSet;
    abstract createButtonStyle(ruleSet: Types.ButtonStyle, cacheStyle?: boolean): Types.ButtonStyleRuleSet;
    abstract createWebViewStyle(ruleSet: Types.WebViewStyle, cacheStyle?: boolean): Types.WebViewStyleRuleSet;
    abstract createTextStyle(ruleSet: Types.TextStyle, cacheStyle?: boolean): Types.TextStyleRuleSet;
    abstract createAnimatedTextStyle(ruleSet: Types.AnimatedTextStyle): Types.AnimatedTextStyleRuleSet;
    abstract createTextInputStyle(ruleSet: Types.TextInputStyle, cacheStyle?: boolean): Types.TextInputStyleRuleSet;
    abstract createAnimatedTextInputStyle(ruleSet: Types.AnimatedTextInputStyle): Types.AnimatedTextInputStyleRuleSet;
    abstract createImageStyle(ruleSet: Types.ImageStyle, cacheStyle?: boolean): Types.ImageStyleRuleSet;
    abstract createAnimatedImageStyle(ruleSet: Types.AnimatedImageStyle): Types.AnimatedImageStyleRuleSet;
    abstract createLinkStyle(ruleSet: Types.LinkStyleRuleSet, cacheStyle?: boolean): Types.LinkStyleRuleSet;
    abstract createPickerStyle(ruleSet: Types.PickerStyle, cacheStyle?: boolean): Types.PickerStyleRuleSet;

    // This method isn't part of the documented ReactXP interface and shouldn't be used by
    // app-level code, but it is needed for some ReactXP extensions (e.g. reactxp-imagesvg),
    // so we export it here.
    abstract getCssPropertyAliasesCssStyle(): { [key: string]: string };
}

export abstract class Text extends React.Component<Types.TextProps> implements FocusableComponent {
    abstract focus(): void;
    abstract requestFocus(): void;
    abstract blur(): void;
    abstract getSelectedText(): string;
}

export abstract class TextInput extends React.Component<Types.TextInputProps> implements FocusableComponent {
    abstract setAccessibilityFocus(): void;
    abstract isFocused(): boolean;
    abstract selectAll(): void;
    abstract selectRange(start: number, end: number): void;
    abstract getSelectionRange(): {
        start: number;
        end: number;
    };
    abstract setValue(value: string): void;
    abstract focus(): void;
    abstract requestFocus(): void;
    abstract blur(): void;
}

export abstract class UserPresence {
    abstract isUserPresent(): boolean;
    userPresenceChangedEvent = new SubscribableEvent<(isPresent: boolean) => void>();
}

export abstract class ViewBase<P, S = {}> extends React.Component<P, S> {}

export abstract class View extends ViewBase<Types.ViewProps> implements FocusableComponent {
    abstract setFocusRestricted(restricted: boolean): void;
    abstract setFocusLimited(limited: boolean): void;
    abstract focus(): void;
    abstract requestFocus(): void;
    abstract blur(): void;
}

export abstract class GestureView extends ViewBase<Types.GestureViewProps> {}

export interface WebViewConstructor {
    new(props: Types.WebViewProps): WebView;
}

export interface WebView extends ViewBase<Types.WebViewProps> {
    postMessage(message: string, targetOrigin?: string): void;
    reload(): void;
    goBack(): void;
    goForward(): void;
}

export interface Animated {
    Image: typeof AnimatedImage;
    Text: typeof AnimatedText;
    TextInput: typeof AnimatedTextInput;
    View: typeof AnimatedView;
    Easing: Types.Animated.Easing;
    timing: Types.Animated.TimingFunction;
    parallel: Types.Animated.ParallelFunction;
    sequence: Types.Animated.SequenceFunction;

    Value: typeof Types.AnimatedValue;
    createValue: (initialValue: number) => Types.AnimatedValue;
    interpolate: (value: Types.AnimatedValue, inputRange: number[], outputRange: string[]) => Types.InterpolatedValue;
}

export interface International {
    allowRTL(allow: boolean): void;
    forceRTL(force: boolean): void;
    isRTL(): boolean;
}
