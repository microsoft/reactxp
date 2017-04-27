/**
* Types.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definitions for ReactXP framework.
*/
import React = require('react');
import RX = require('./Interfaces');
export { SubscribableEvent, SubscriptionToken } from './SubscribableEvent';
export declare type ReactNode = React.ReactNode;
export declare type ReactInterface = {
    createElement<P>(type: string, props?: P, ...children: React.ReactNode[]): React.ReactElement<P>;
};
export interface FlexboxStyle {
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
    borderWidth?: number;
    borderTopWidth?: number;
    borderRightWidth?: number;
    borderBottomWidth?: number;
    borderLeftWidth?: number;
    height?: number;
    width?: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    flex?: number;
    flexWrap?: 'wrap' | 'nowrap';
    flexDirection?: 'column' | 'row' | 'column-reverse' | 'row-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    maxHeight?: number;
    maxWidth?: number;
    minHeight?: number;
    minWidth?: number;
    margin?: number;
    marginHorizontal?: number;
    marginVertical?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    padding?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    position?: 'absolute' | 'relative';
}
export interface AnimatedFlexboxStyle {
    height?: RX.AnimatedValue;
    width?: RX.AnimatedValue;
    top?: RX.AnimatedValue;
    right?: RX.AnimatedValue;
    bottom?: RX.AnimatedValue;
    left?: RX.AnimatedValue;
}
export interface TransformStyle {
    transform?: [{
        perspective?: number;
        rotate?: string;
        rotateX?: string;
        rotateY?: string;
        rotateZ?: string;
        scale?: number;
        scaleX?: number;
        scaleY?: number;
        translateX?: number;
        translateY?: number;
    }];
}
export interface AnimatedTransformStyle {
    transform?: [{
        perspective?: RX.AnimatedValue;
        rotate?: RX.AnimatedValue;
        rotateX?: RX.AnimatedValue;
        rotateY?: RX.AnimatedValue;
        rotateZ?: RX.AnimatedValue;
        scale?: RX.AnimatedValue;
        scaleX?: RX.AnimatedValue;
        scaleY?: RX.AnimatedValue;
        translateX?: RX.AnimatedValue;
        translateY?: RX.AnimatedValue;
    }];
}
export declare type StyleRuleSet<T> = T | number;
export interface ViewAndImageCommonStyle extends FlexboxStyle, TransformStyle {
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    borderTopRightRadius?: number;
    borderBottomRightRadius?: number;
    borderBottomLeftRadius?: number;
    borderTopLeftRadius?: number;
    overflow?: 'visible' | 'hidden';
    backgroundColor?: string;
    opacity?: number;
}
export interface AnimatedViewAndImageCommonStyle extends AnimatedFlexboxStyle, AnimatedTransformStyle {
    borderRadius?: RX.AnimatedValue;
    backgroundColor?: RX.AnimatedValue;
    opacity?: RX.AnimatedValue;
}
export interface ViewStyle extends ViewAndImageCommonStyle {
    borderStyle?: 'none' | 'solid' | 'dotted' | 'dashed';
    wordBreak?: 'break-all' | 'break-word';
    appRegion?: 'drag' | 'no-drag';
    cursor?: 'pointer' | 'default';
    shadowOffset?: {
        width: number;
        height: number;
    };
    shadowOpacity?: number;
    shadowRadius?: number;
    shadowColor?: string;
    elevation?: number;
}
export declare type ViewStyleRuleSet = StyleRuleSet<ViewStyle>;
export interface AnimatedViewStyle extends AnimatedViewAndImageCommonStyle {
}
export declare type AnimatedViewStyleRuleSet = StyleRuleSet<AnimatedViewStyle>;
export interface ScrollViewStyle extends ViewStyle {
}
export declare type ScrollViewStyleRuleSet = StyleRuleSet<ScrollViewStyle>;
export interface ButtonStyle extends ViewStyle {
}
export declare type ButtonStyleRuleSet = StyleRuleSet<ButtonStyle>;
export interface WebViewStyle extends ViewStyle {
}
export declare type WebViewStyleRuleSet = StyleRuleSet<WebViewStyle>;
export interface ActivityIndicatorStyle extends ViewStyle {
}
export declare type ActivityIndicatorStyleRuleSet = StyleRuleSet<ActivityIndicatorStyle>;
export interface FontInfo {
    fontFamily?: string;
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}
export interface TextStyle extends ViewStyle {
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    font?: FontInfo;
    letterSpacing?: number;
    lineHeight?: number;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
    textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed';
    textDecorationColor?: string;
    writingDirection?: 'auto' | 'ltr' | 'rtl';
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    includeFontPadding?: boolean;
}
export declare type TextStyleRuleSet = StyleRuleSet<TextStyle>;
export interface AnimatedTextStyle extends AnimatedViewAndImageCommonStyle {
    color?: RX.AnimatedValue;
    fontSize?: RX.AnimatedValue;
}
export declare type AnimatedTextStyleRuleSet = StyleRuleSet<AnimatedTextStyle>;
export interface TextInputStyle extends TextStyle {
}
export declare type TextInputStyleRuleSet = StyleRuleSet<TextInputStyle>;
export interface AnimatedTextInputStyle extends AnimatedViewAndImageCommonStyle {
    color?: RX.AnimatedValue;
    fontSize?: RX.AnimatedValue;
}
export declare type AnimatedTextInputStyleRuleSet = StyleRuleSet<AnimatedTextInputStyle>;
export interface LinkStyle extends TextStyle {
}
export declare type LinkStyleRuleSet = StyleRuleSet<LinkStyle>;
export interface ImageStyle extends ViewAndImageCommonStyle, FlexboxStyle {
    resizeMode?: 'contain' | 'cover' | 'stretch';
    overlayColor?: string;
}
export declare type ImageStyleRuleSet = StyleRuleSet<ImageStyle>;
export interface AnimatedImageStyle extends AnimatedViewAndImageCommonStyle, AnimatedFlexboxStyle {
}
export declare type AnimatedImageStyleRuleSet = StyleRuleSet<AnimatedImageStyle>;
export interface PickerStyle extends ViewStyle {
    color?: string;
}
export declare type PickerStyleRuleSet = StyleRuleSet<PickerStyle>;
export interface CommonProps {
    ref?: string | ((obj: React.Component<any, any>) => void);
    key?: string | number;
    type?: any;
    children?: React.ReactNode | React.ReactNode[];
}
export interface CommonAccessibilityProps {
    importantForAccessibility?: ImportantForAccessibility;
    accessibilityLabel?: string;
    accessibilityTraits?: AccessibilityTrait | AccessibilityTrait[];
    tabIndex?: number;
}
export declare enum ImportantForAccessibility {
    Auto = 1,
    Yes = 2,
    No = 3,
    NoHideDescendants = 4,
}
export interface AccessibilityHtmlAttributes extends React.HTMLAttributes {
    'aria-label'?: string;
    'aria-live'?: string;
    'aria-hidden'?: boolean;
    'aria-disabled'?: boolean;
    'aria-selected'?: boolean;
}
export declare enum AccessibilityLiveRegion {
    None = 0,
    Polite = 1,
    Assertive = 2,
}
export declare enum AccessibilityTrait {
    Summary = 0,
    Adjustable = 1,
    Button = 2,
    Tab = 3,
    Selected = 4,
    Radio_button_checked = 5,
    Radio_button_unchecked = 6,
    Link = 7,
    Header = 8,
    Search = 9,
    Image = 10,
    Plays = 11,
    Key = 12,
    Text = 13,
    Disabled = 14,
    FrequentUpdates = 15,
    StartsMedia = 16,
    AllowsDirectInteraction = 17,
    PageTurn = 18,
    Menu = 19,
    MenuItem = 20,
    MenuBar = 21,
    TabList = 22,
    List = 23,
    ListItem = 24,
    ListBox = 25,
    Group = 26,
    CheckBox = 27,
    ComboBox = 28,
    Log = 29,
    Status = 30,
    Dialog = 31,
    None = 32,
}
export interface CommonStyledProps<T> extends CommonProps {
    style?: T | T[];
}
export interface ButtonProps extends CommonStyledProps<ButtonStyleRuleSet>, CommonAccessibilityProps {
    title?: string;
    children?: ReactNode;
    disabled?: boolean;
    delayLongPress?: number;
    cursor?: string;
    onContextMenu?: (e: SyntheticEvent) => void;
    onPress?: (e: SyntheticEvent) => void;
    onPressIn?: (e: SyntheticEvent) => void;
    onPressOut?: (e: SyntheticEvent) => void;
    onLongPress?: (e: SyntheticEvent) => void;
    onHoverStart?: (e: SyntheticEvent) => void;
    onHoverEnd?: (e: SyntheticEvent) => void;
    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    shouldRasterizeIOS?: boolean;
    disableTouchOpacityAnimation?: boolean;
    activeOpacity?: number;
    underlayColor?: string;
}
export interface PickerPropsItem {
    label: string;
    value: string;
}
export interface PickerProps extends CommonProps {
    items: PickerPropsItem[];
    selectedValue: string;
    onValueChange: (itemValue: string, itemPosition: number) => void;
    style?: PickerStyleRuleSet | PickerStyleRuleSet[];
}
export interface ImagePropsShared extends CommonProps {
    source: string;
    headers?: {
        [headerName: string]: string;
    };
    accessibilityLabel?: string;
    children?: ReactNode;
    resizeMode?: 'stretch' | 'contain' | 'cover' | 'auto' | 'repeat';
    resizeMethod?: 'auto' | 'resize' | 'scale';
    title?: string;
    onLoad?: (size: Dimensions) => void;
    onError?: (err?: Error) => void;
    shouldRasterizeIOS?: boolean;
}
export interface ImageProps extends ImagePropsShared {
    style?: ImageStyleRuleSet | ImageStyleRuleSet[];
}
export interface AnimatedImageProps extends ImagePropsShared {
    style?: AnimatedImageStyleRuleSet | (AnimatedImageStyleRuleSet | ImageStyleRuleSet)[];
}
export interface TextPropsShared extends CommonProps {
    children?: ReactNode;
    selectable?: boolean;
    numberOfLines?: number;
    allowFontScaling?: boolean;
    maxFontSizeMultiplier?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail';
    textBreakStrategy?: 'highQuality' | 'simple' | 'balanced';
    importantForAccessibility?: ImportantForAccessibility;
    elevation?: number;
    onPress?: (e: SyntheticEvent) => void;
}
export interface TextProps extends TextPropsShared {
    style?: TextStyleRuleSet | TextStyleRuleSet[];
}
export interface AnimatedTextProps extends TextPropsShared {
    style?: AnimatedTextStyleRuleSet | (AnimatedTextStyleRuleSet | TextStyleRuleSet)[];
}
export declare type ViewLayerType = 'none' | 'software' | 'hardware';
export interface ViewPropsShared extends CommonProps, CommonAccessibilityProps {
    title?: string;
    ignorePointerEvents?: boolean;
    blockPointerEvents?: boolean;
    shouldRasterizeIOS?: boolean;
    viewLayerTypeAndroid?: ViewLayerType;
    children?: ReactNode;
    focusable?: boolean;
    animateChildEnter?: boolean;
    animateChildLeave?: boolean;
    animateChildMove?: boolean;
    onLayout?: (e: ViewOnLayoutEvent) => void;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onDragEnter?: (e: DragEvent) => void;
    onDragOver?: (e: DragEvent) => void;
    onDragLeave?: (e: DragEvent) => void;
    onDrop?: (e: DragEvent) => void;
    onMouseOver?: (e: MouseEvent) => void;
    onMouseMove?: (e: MouseEvent) => void;
    onPress?: (e: SyntheticEvent) => void;
    onLongPress?: (e: SyntheticEvent) => void;
    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    disableTouchOpacityAnimation?: boolean;
    activeOpacity?: number;
    underlayColor?: string;
}
export interface ViewProps extends ViewPropsShared {
    style?: ViewStyleRuleSet | ViewStyleRuleSet[];
    onContextMenu?: (e: React.SyntheticEvent) => void;
    onStartShouldSetResponder?: (e: React.SyntheticEvent) => boolean;
    onMoveShouldSetResponder?: (e: React.SyntheticEvent) => boolean;
    onStartShouldSetResponderCapture?: (e: React.SyntheticEvent) => boolean;
    onMoveShouldSetResponderCapture?: (e: React.SyntheticEvent) => boolean;
    onResponderGrant?: (e: React.SyntheticEvent) => void;
    onResponderReject?: (e: React.SyntheticEvent) => void;
    onResponderRelease?: (e: React.SyntheticEvent) => void;
    onResponderStart?: (e: React.TouchEvent) => void;
    onResponderMove?: (e: React.TouchEvent) => void;
    onResponderEnd?: (e: React.TouchEvent) => void;
    onResponderTerminate?: (e: React.SyntheticEvent) => void;
    onResponderTerminationRequest?: (e: React.SyntheticEvent) => boolean;
}
export interface AnimatedViewProps extends ViewPropsShared {
    style?: AnimatedViewStyleRuleSet | (AnimatedViewStyleRuleSet | ViewStyleRuleSet)[];
}
export interface GestureState {
    timeStamp: Date;
}
export interface MultiTouchGestureState extends GestureState {
    initialCenterClientX: number;
    initialCenterClientY: number;
    initialCenterPageX: number;
    initialCenterPageY: number;
    initialWidth: number;
    initialHeight: number;
    initialDistance: number;
    initialAngle: number;
    centerClientX: number;
    centerClientY: number;
    centerPageX: number;
    centerPageY: number;
    velocityX: number;
    velocityY: number;
    width: number;
    height: number;
    distance: number;
    angle: number;
    isComplete: boolean;
}
export interface ScrollWheelGestureState extends GestureState {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    scrollAmount: number;
}
export interface PanGestureState extends GestureState {
    initialClientX: number;
    initialClientY: number;
    initialPageX: number;
    initialPageY: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
    velocityX: number;
    velocityY: number;
    isComplete: boolean;
}
export interface TapGestureState extends GestureState {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
}
export declare enum GestureMouseCursor {
    Default = 0,
    Pointer = 1,
    Grab = 2,
    Move = 3,
}
export declare enum PreferredPanGesture {
    Horizontal = 0,
    Vertical = 1,
}
export interface GestureViewProps extends CommonStyledProps<ViewStyleRuleSet> {
    onPinchZoom?: (gestureState: MultiTouchGestureState) => void;
    onRotate?: (gestureState: MultiTouchGestureState) => void;
    onScrollWheel?: (gestureState: ScrollWheelGestureState) => void;
    mouseOverCursor?: GestureMouseCursor;
    onPan?: (gestureState: PanGestureState) => void;
    onPanVertical?: (gestureState: PanGestureState) => void;
    onPanHorizontal?: (gestureState: PanGestureState) => void;
    onTap?: (gestureState: TapGestureState) => void;
    onDoubleTap?: (gestureState: TapGestureState) => void;
    preferredPan?: PreferredPanGesture;
    panPixelThreshold?: number;
    releaseOnRequest?: boolean;
}
export interface ScrollViewProps extends ViewProps {
    style?: ScrollViewStyleRuleSet | ScrollViewStyleRuleSet[];
    children?: ReactNode;
    vertical?: boolean;
    horizontal?: boolean;
    justifyEnd?: boolean;
    onLayout?: (e: ViewOnLayoutEvent) => void;
    onContentSizeChange?: (width: number, height: number) => void;
    onScroll?: (newScrollTop: number, newScrollLeft: number) => void;
    onScrollBeginDrag?: () => void;
    onScrollEndDrag?: () => void;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    scrollEnabled?: boolean;
    keyboardDismissMode?: 'none' | 'interactive' | 'on-drag';
    keyboardShouldPersistTaps?: boolean;
    scrollEventThrottle?: number;
    bounces?: boolean;
    pagingEnabled?: boolean;
    snapToInterval?: number;
    scrollsToTop?: boolean;
    overScrollMode?: 'always' | 'always-if-content-scrolls' | 'never';
    scrollIndicatorInsets?: {
        top: number;
        left: number;
        bottom: number;
        right: number;
    };
}
export interface LinkProps extends CommonStyledProps<LinkStyleRuleSet> {
    title?: string;
    url?: string;
    children?: ReactNode;
    selectable?: boolean;
    numberOfLines?: number;
    onPress?: (e: RX.Types.SyntheticEvent, url: string) => void;
    onLongPress?: (e: RX.Types.SyntheticEvent, url: string) => void;
    onHoverStart?: (e: SyntheticEvent) => void;
    onHoverEnd?: (e: SyntheticEvent) => void;
}
export interface TextInputPropsShared extends CommonProps, CommonAccessibilityProps {
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    autoFocus?: boolean;
    blurOnSubmit?: boolean;
    defaultValue?: string;
    editable?: boolean;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'number-pad';
    maxLength?: number;
    multiline?: boolean;
    placeholder?: string;
    placeholderTextColor?: string;
    secureTextEntry?: boolean;
    value?: string;
    textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    allowFontScaling?: boolean;
    keyboardAppearance?: 'default' | 'light' | 'dark';
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
    disableFullscreenUI?: boolean;
    spellCheck?: boolean;
    selectionColor?: string;
    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    onPaste?: (e: ClipboardEvent) => void;
    onChangeText?: (newValue: string) => void;
    onSelectionChange?: (start: number, end: number) => void;
    onSubmitEditing?: () => void;
    onScroll?: (newScrollTop: number, newScrollLeft: number) => void;
}
export interface TextInputProps extends TextInputPropsShared {
    style?: TextInputStyleRuleSet | TextInputStyleRuleSet[];
}
export interface AnimatedTextInputProps extends TextInputPropsShared {
    style?: AnimatedTextInputStyleRuleSet | (AnimatedTextInputStyleRuleSet | TextInputStyleRuleSet)[];
}
export interface ActivityIndicatorProps extends CommonStyledProps<ActivityIndicatorStyleRuleSet> {
    color: string;
    size?: 'large' | 'medium' | 'small' | 'tiny';
    deferTime?: number;
}
export interface WebViewNavigationState extends Event {
    canGoBack: boolean;
    canGoForward: boolean;
    loading: boolean;
    url: string;
    title: string;
}
export interface WebViewErrorState extends WebViewNavigationState {
    description: string;
    domain: string;
    code: string;
}
export declare enum WebViewSandboxMode {
    None = 0,
    AllowForms = 1,
    AllowModals = 2,
    AllowOrientationLock = 4,
    AllowPointerLock = 8,
    AllowPopups = 16,
    AllowPopupsToEscapeSandbox = 32,
    AllowPresentation = 64,
    AllowSameOrigin = 128,
    AllowScripts = 256,
    AllowTopNavigation = 512,
}
export interface WebViewProps extends CommonStyledProps<WebViewStyleRuleSet> {
    url: string;
    headers?: {
        [key: string]: string;
    };
    onLoad?: (e: SyntheticEvent) => void;
    onNavigationStateChange?: (navigationState: WebViewNavigationState) => void;
    scalesPageToFit?: boolean;
    injectedJavaScript?: string;
    javaScriptEnabled?: boolean;
    startInLoadingState?: boolean;
    domStorageEnabled?: boolean;
    onShouldStartLoadWithRequest?: (shouldStartLoadEvent: WebViewShouldStartLoadEvent) => boolean;
    onLoadStart?: (e: SyntheticEvent) => void;
    onError?: (s: SyntheticEvent) => void;
    sandbox?: WebViewSandboxMode;
}
export declare type PopupPosition = 'top' | 'right' | 'bottom' | 'left';
export interface PopupOptions {
    getAnchor: () => React.Component<any, any>;
    renderPopup: (anchorPosition: PopupPosition, anchorOffset: number, popupWidth: number, popupHeight: number) => ReactNode;
    getElementTriggeringPopup?: () => React.Component<any, any>;
    onDismiss?: () => void;
    positionPriorities?: PopupPosition[];
    useInnerPositioning?: boolean;
    onAnchorPressed?: (e: RX.Types.SyntheticEvent) => void;
    dismissIfShown?: boolean;
}
export declare enum NavigatorSceneConfigType {
    FloatFromRight = 0,
    FloatFromLeft = 1,
    FloatFromBottom = 2,
    Fade = 3,
    FadeWithSlide = 4,
}
export interface NavigatorRoute {
    routeId: number;
    sceneConfigType: NavigatorSceneConfigType;
    gestureResponseDistance?: number;
    customSceneConfig?: CustomNavigatorSceneConfig;
}
export declare type NavigationTransitionSpec = {
    duration?: number;
    easing?: Animated.EasingFunction;
};
export declare type NavigationTransitionStyleConfig = {
    inputRange?: number[];
    opacityOutput: number | number[];
    scaleOutput: number | number[];
    translateXOutput: number | number[];
    translateYOutput: number | number[];
};
export declare type CustomNavigatorSceneConfig = {
    transitionStyle?: (sceneIndex: number, sceneDimensions: Dimensions) => NavigationTransitionStyleConfig;
    transitionSpec?: NavigationTransitionSpec;
    cardStyle?: ViewStyleRuleSet;
    hideShadow?: boolean;
    presentBelowPrevious?: boolean;
};
export interface NavigatorProps extends CommonProps {
    renderScene?: (route: NavigatorRoute) => JSX.Element;
    navigateBackCompleted?: () => void;
    transitionStarted?: (progress?: RX.AnimatedValue, toRouteId?: string, fromRouteId?: string, toIndex?: number, fromIndex?: number) => void;
    transitionCompleted?: () => void;
    cardStyle?: ViewStyleRuleSet;
    children?: ReactNode;
}
export interface AlertButtonSpec {
    text?: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}
export declare enum LocationErrorType {
    PermissionDenied = 1,
    PositionUnavailable = 2,
    Timeout = 3,
}
export declare type LocationWatchId = number;
export declare type LocationSuccessCallback = (position: Position) => void;
export declare type LocationFailureCallback = (error: LocationErrorType) => void;
export declare module Animated {
    type ValueListenerCallback = (value: number | string) => void;
    type EndResult = {
        finished: boolean;
    };
    type EndCallback = (result: EndResult) => void;
    type CompositeAnimation = {
        start: (callback?: EndCallback) => void;
        stop: () => void;
    };
    interface LoopConfig {
        restartFrom: number;
    }
    interface AnimationConfig {
        useNativeDriver?: boolean;
        isInteraction?: boolean;
    }
    interface TimingAnimationConfig extends AnimationConfig {
        toValue: number;
        easing?: EasingFunction;
        duration?: number;
        delay?: number;
        loop?: LoopConfig;
    }
    interface InterpolationConfigType {
        inputRange: number[];
        outputRange: (number | string)[];
    }
    type TimingFunction = (value: RX.AnimatedValue, config: TimingAnimationConfig) => CompositeAnimation;
    var timing: TimingFunction;
    type SequenceFunction = (animations: Array<CompositeAnimation>) => CompositeAnimation;
    var sequence: SequenceFunction;
    type ParallelFunction = (animations: Array<CompositeAnimation>) => CompositeAnimation;
    var parallel: ParallelFunction;
    type EasingFunction = {
        cssName: string;
        function: (input: number) => number;
    };
    interface Easing {
        Default(): EasingFunction;
        Linear(): EasingFunction;
        Out(): EasingFunction;
        In(): EasingFunction;
        InOut(): EasingFunction;
        InBack(): EasingFunction;
        OutBack(): EasingFunction;
        InOutBack(): EasingFunction;
        StepStart(): EasingFunction;
        StepEnd(): EasingFunction;
        Steps(intervals: number, end?: boolean): EasingFunction;
        CubicBezier(x1: number, y1: number, x2: number, y2: number): EasingFunction;
    }
}
export declare type SyntheticEvent = React.SyntheticEvent;
export declare type DragEvent = React.DragEvent;
export declare type ClipboardEvent = React.ClipboardEvent;
export declare type FocusEvent = React.FocusEvent;
export declare type FormEvent = React.FormEvent;
export declare type MouseEvent = React.MouseEvent;
export declare type TouchEvent = React.TouchEvent;
export declare type UIEvent = React.UIEvent;
export declare type WheelEvent = React.WheelEvent;
export interface WebViewShouldStartLoadEvent extends SyntheticEvent {
    url: string;
}
export interface WebViewNavigationEvent extends SyntheticEvent {
    nativeEvent: WebViewNavigationState;
}
export interface WebViewErrorEvent extends SyntheticEvent {
    nativeEvent: WebViewErrorState;
}
export declare type ViewOnLayoutEvent = {
    x: number;
    y: number;
    height: number;
    width: number;
};
export interface KeyboardEvent extends SyntheticEvent {
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    keyCode: number;
}
export declare var Children: React.ReactChildren;
export declare type Dimensions = {
    width: number;
    height: number;
};
export interface EmailInfo {
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    body?: string;
}
export interface SmsInfo {
    phoneNumber?: string;
    body?: string;
}
export declare enum LinkingErrorCode {
    NoAppFound = 0,
    UnexpectedFailure = 1,
    Blocked = 2,
    InitialUrlNotFound = 3,
}
export interface LinkingErrorInfo {
    code: LinkingErrorCode;
    url: string;
    description?: string;
}
export declare enum AppActivationState {
    Active = 1,
    Background = 2,
    Inactive = 3,
}
export interface LayoutInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare type PlatformType = 'web' | 'ios' | 'android' | 'windows';
export interface ProfilingLoggingConfig {
    printInclusive?: boolean;
    printExclusive?: boolean;
    printWasted?: boolean;
    printOperations?: boolean;
    printDOM?: boolean;
}
