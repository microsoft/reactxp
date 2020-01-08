/**
* Types.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definitions for ReactXP framework.
*/

import * as React from 'react';

// Use only for type data
import * as RX from './Interfaces';

export { default as SubscribableEvent, SubscriptionToken } from 'subscribableevent';

export type ReactNode = React.ReactNode;

// Some RX components contain render logic in the abstract classes located in rx/common. That render logic
// depends on using a platform specific React library (web vs native). Thus, we need an interface to abstract
// this detail away from the components' common implementation.
export interface ReactInterface {
    createElement<P>(type: string, props?: P, ...children: ReactNode[]): React.ReactElement<P>;
}

// ------------------------------------------------------------
// React Native Flexbox styles 0.14.2
// ------------------------------------------------------------

export interface FlexboxParentStyle {
    flexDirection?: 'column' | 'row' | 'column-reverse' | 'row-reverse';

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

    flexGrow?: number;
    flexShrink?: number;
    flexBasis?: number;
    flex?: number;

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

// These are supported by most views but not by ScrollView
export interface FlexboxChildrenStyle {
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
    alignContent?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';

    flexWrap?: 'wrap' | 'nowrap';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
}

export interface FlexboxStyle extends FlexboxParentStyle, FlexboxChildrenStyle {
}

export interface InterpolationConfig {
    inputRange: number[];
    outputRange: number[] | string[];
}

export abstract class AnimatedValue {
    constructor(val: number) {
        // No-op
    }
    abstract setValue(value: number): void;
    abstract interpolate(config: InterpolationConfig): InterpolatedValue;
}

export declare abstract class InterpolatedValue {
    private constructor();
    abstract interpolate(config: InterpolationConfig): InterpolatedValue;
}

export interface AnimatedFlexboxStyle {
    height?: AnimatedValue | InterpolatedValue;
    width?: AnimatedValue | InterpolatedValue;

    top?: AnimatedValue | InterpolatedValue;
    right?: AnimatedValue | InterpolatedValue;
    bottom?: AnimatedValue | InterpolatedValue;
    left?: AnimatedValue | InterpolatedValue;
}

// ------------------------------------------------------------
// Transform Style Rules
// ------------------------------------------------------------

export interface TransformStyle {
    transform?: {
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
    }[];
}

export interface AnimatedTransformStyle {
    transform?: {
        perspective?: AnimatedValue | InterpolatedValue;
        rotate?: AnimatedValue | InterpolatedValue;
        rotateX?: AnimatedValue | InterpolatedValue;
        rotateY?: AnimatedValue | InterpolatedValue;
        rotateZ?: AnimatedValue | InterpolatedValue;
        scale?: AnimatedValue | InterpolatedValue;
        scaleX?: AnimatedValue | InterpolatedValue;
        scaleY?: AnimatedValue | InterpolatedValue;
        translateX?: AnimatedValue | InterpolatedValue;
        translateY?: AnimatedValue | InterpolatedValue;
    }[];
}

export type StyleRuleSet<T> = T | number | undefined;
export type StyleRuleSetOrArray<T> = StyleRuleSet<T> | StyleRuleSet<T>[];
export interface StyleRuleSetRecursiveArray<T> extends Array<StyleRuleSetOrArray<T> | StyleRuleSetRecursiveArray<T>> {}
export type StyleRuleSetRecursive<T> = StyleRuleSet<T> | StyleRuleSetRecursiveArray<T>;

// ------------------------------------------------------------
// Image and View common Style Rules
// ------------------------------------------------------------
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
    borderRadius?: AnimatedValue | InterpolatedValue;
    backgroundColor?: InterpolatedValue;
    opacity?: AnimatedValue | InterpolatedValue;
}

// ------------------------------------------------------------
// View Style Rules
// ------------------------------------------------------------

export interface ShadowOffset {
    width: number;
    height: number;
}

export interface ViewStyle extends ViewAndImageCommonStyle {
    borderStyle?: 'solid' | 'dotted' | 'dashed' | 'none';
    wordBreak?: 'break-all' | 'break-word'; // Web only
    appRegion?: 'drag' | 'no-drag'; // Web only
    cursor?: 'pointer' | 'default'; // Web only
    shadowOffset?: ShadowOffset;
    shadowOpacity?: number;
    shadowRadius?: number;
    shadowColor?: string;
    // Android does not support shadow, elevation achieves something similar.
    // http://facebook.github.io/react-native/releases/0.30/docs/shadow-props.html (iOS only)
    // http://facebook.github.io/react-native/releases/0.30/docs/view.html#style (see elevation property)
    elevation?: number; // Android only
    // Windows 10 RS3 supports acrylic brushes. In earlier versions these properties are ignored.
    // The tint opacity can be set either with acrylicOpacity or with acrylicTintColor, e.g. #f002.
    acrylicOpacityUWP?: number; // UWP only; default = 1
    acrylicSourceUWP?: 'host' | 'app'; // UWP only; default = "host"
    acrylicTintColorUWP?: string; // UWP only; default = backgroundColor
}

export type ViewStyleRuleSet = StyleRuleSet<ViewStyle>;

export interface AnimatedViewStyle extends AnimatedViewAndImageCommonStyle {
}

export type AnimatedViewStyleRuleSet = StyleRuleSet<AnimatedViewStyle>;

// ------------------------------------------------------------
// ScrollView Style Rules
// ------------------------------------------------------------

export interface ScrollViewStyle extends FlexboxParentStyle, TransformStyle {
    overflow?: 'visible' | 'hidden';
    backgroundColor?: string;
    opacity?: number;
}

export type ScrollViewStyleRuleSet = StyleRuleSet<ScrollViewStyle>;

// ------------------------------------------------------------
// Button Style Rules
// ------------------------------------------------------------

export interface ButtonStyle extends ViewStyle {
}

export type ButtonStyleRuleSet = StyleRuleSet<ButtonStyle>;

// ------------------------------------------------------------
// ActivityIndicator Style Rules
// ------------------------------------------------------------

export interface ActivityIndicatorStyle extends ViewStyle {
}

export type ActivityIndicatorStyleRuleSet = StyleRuleSet<ActivityIndicatorStyle>;

// ------------------------------------------------------------
// Text Style Rules
// ------------------------------------------------------------

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
    // Properties specific to android platform
    // For android, these properties are set to textAlignVertical: 'center' & includeFontPadding: false
    // to match the same rendering as of ios and web
    textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
    includeFontPadding?: boolean; // default is true
}

export type TextStyleRuleSet = StyleRuleSet<TextStyle>;

export interface AnimatedTextStyle extends AnimatedViewAndImageCommonStyle {
    color?: InterpolatedValue;
    fontSize?: AnimatedValue | InterpolatedValue;
}

export type AnimatedTextStyleRuleSet = StyleRuleSet<AnimatedTextStyle>;

// ------------------------------------------------------------
// TextInput Style Rules
// ------------------------------------------------------------

export interface TextInputStyle extends TextStyle {
}

export type TextInputStyleRuleSet = StyleRuleSet<TextInputStyle>;

export interface AnimatedTextInputStyle extends AnimatedViewAndImageCommonStyle {
    color?: InterpolatedValue;
    fontSize?: AnimatedValue | InterpolatedValue;
}

export type AnimatedTextInputStyleRuleSet = StyleRuleSet<AnimatedTextInputStyle>;

// ------------------------------------------------------------
// Link Style Rules
// ------------------------------------------------------------

export interface LinkStyle extends TextStyle {
}

export type LinkStyleRuleSet = StyleRuleSet<LinkStyle>;

// ------------------------------------------------------------
// Image Style Rules
// ------------------------------------------------------------

export interface ImageStyle extends ViewAndImageCommonStyle, FlexboxStyle {
    // This is an Android only style attribute that is used to fill the gap in the case of rounded corners
    // in gif images.
    overlayColor?: string;
}

export type ImageStyleRuleSet = StyleRuleSet<ImageStyle>;

export interface AnimatedImageStyle extends AnimatedViewAndImageCommonStyle, AnimatedFlexboxStyle {
}

export type AnimatedImageStyleRuleSet = StyleRuleSet<AnimatedImageStyle>;

// ------------------------------------------------------------
// Picker Style Rules
// ------------------------------------------------------------

export interface PickerStyle extends ViewStyle {
    color?: string;
}

export type PickerStyleRuleSet = StyleRuleSet<PickerStyle>;

export type ComponentBase = React.Component<any, any>;

/**
 * Components
 */

// Use a private version of RefAttributes rather than the one defined
// in React because older versions of @types/React don't include it.
interface RefObject<T> {
    readonly current: T | null;
}
type Ref<T> = { bivarianceHack(instance: T | null): void }['bivarianceHack'] | RefObject<T> | null;
interface RefAttributes<T> {
    ref?: Ref<T>;
    key?: string | number;
}

export interface CommonProps<C = React.Component> extends RefAttributes<C> {
    // ref and key are typed by react itself
    children?: ReactNode | ReactNode[];
    testId?: string;
}

export interface Stateless {}

//
// Accessibility
//
export interface CommonAccessibilityProps {
    // iOS, Android, and Desktop
    importantForAccessibility?: ImportantForAccessibility;
    accessibilityId?: string;
    accessibilityLabel?: string;
    accessibilityTraits?: AccessibilityTrait | AccessibilityTrait[];

    // Desktop only.
    tabIndex?: number;
    ariaValueNow?: number;

    // iOS only.
    accessibilityActions?: string[];
    onAccessibilityAction?: (e: SyntheticEvent) => void;
}

// Auto, Yes, No - iOS & Android.
// NoHideDescendants - iOS, Android, & Desktop.
export enum ImportantForAccessibility {
    Auto = 1,
    Yes,
    No,
    NoHideDescendants
}

export type AriaLive = 'off' | 'assertive' | 'polite';

// Android & Desktop supported prop, which allows screen-reader to inform its users when a
// component has dynamically changed. For example, the content of an inApp toast.
export enum AccessibilityLiveRegion {
    None,
    Polite,
    Assertive
}

// NOTE: This enum is organized based on priority of these traits (0 is the lowest),
// which can be assigned to an accessible object. On native, all traits are combined as
// a list. On desktop, trait with the maximum value is picked. Whenever you are adding
// a new trait add it in the right priority order in the list.
export enum AccessibilityTrait {
    // Desktop and iOS.
    Summary,
    Adjustable,

    // Desktop, iOS, and Android.
    Button,
    Tab,
    Selected,

    // Android only.
    Radio_button_checked,
    Radio_button_unchecked,

    // iOS only.
    Link,
    Header,
    Search,
    Image,
    Plays,
    Key,
    Text,
    Disabled,
    FrequentUpdates,
    StartsMedia,
    AllowsDirectInteraction,
    PageTurn,

    // Desktop only.
    Menu,
    MenuItem,
    MenuBar,
    TabList,
    List,
    ListItem,
    ListBox,
    Group,
    CheckBox,
    Checked,
    ComboBox,
    Log,
    Status,
    Dialog,
    HasPopup,
    Option,
    Switch,

    // Desktop & mobile. This is at the end because this
    // is the highest priority trait.
    None
}

// When multiple components with autoFocus=true are mounting at the same time,
// and/or multiple requestFocus() calls are happening during the same render cycle,
// it is possible to specify a callback which will choose one from those multiple.
// To set this callback use View's arbitrateFocus property.
export type FocusArbitrator = (candidates: FocusCandidate[]) => FocusCandidate | undefined;

// FocusArbitrator callback will be called with an array of FocusCandidate.
// See View's arbitrateFocus property.
export interface FocusCandidate {
    // An instance of the component which wants to be focused.
    component: RX.FocusableComponent;

    // Value of component.props.accessibilityId (if specified).
    accessibilityId?: string;
}

export interface CommonStyledProps<T, C = React.Component> extends CommonProps<C> {
    style?: StyleRuleSetRecursive<T>;
}

// Button
export interface ButtonProps extends CommonStyledProps<ButtonStyleRuleSet, RX.Button>, CommonAccessibilityProps {
    title?: string;
    disabled?: boolean;
    disabledOpacity?: number;
    delayLongPress?: number;

    autoFocus?: boolean; // The component is a candidate for being autofocused.
    onAccessibilityTapIOS?: (e: SyntheticEvent) => void; // iOS-only prop, call when a button is double tapped in accessibility mode
    onContextMenu?: (e: MouseEvent) => void;
    onPress?: (e: SyntheticEvent) => void;
    onPressIn?: (e: SyntheticEvent) => void;
    onPressOut?: (e: SyntheticEvent) => void;
    onLongPress?: (e: SyntheticEvent) => void;
    onHoverStart?: (e: SyntheticEvent) => void;
    onHoverEnd?: (e: SyntheticEvent) => void;
    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;

    shouldRasterizeIOS?: boolean; // iOS-only prop, if view should be rendered as a bitmap before compositing

    // iOS and Android only. Visual touchfeedback properties
    disableTouchOpacityAnimation?: boolean;
    activeOpacity?: number;
    underlayColor?: string;

    // Web only.
    id?: string; // Needed for accessibility to be able to use labelledBy attribute.
    ariaControls?: string; // Needed for accessibility.
}

// Picker
export interface PickerPropsItem {
    label: string;
    value: string;
}
export interface PickerProps extends CommonProps<RX.Picker> {
    items: PickerPropsItem[];
    selectedValue: string;
    onValueChange: (itemValue: string, itemPosition: number) => void;
    style?: StyleRuleSetRecursive<PickerStyleRuleSet>;
    mode?: 'dialog' | 'dropdown';
}

/**
 * WebView, Image headers
 */
export interface Headers {
    [header: string]: string;
}

// Image
export type ImageResizeMode = 'stretch' | 'contain' | 'cover' | 'auto' | 'repeat';

export interface ImagePropsShared<C = React.Component> extends CommonProps<C> {
    source: string;
    headers?: Headers;
    accessibilityLabel?: string;
    resizeMode?: ImageResizeMode;

    resizeMethod?: 'auto' | 'resize' | 'scale'; // Android only
    title?: string;

    onLoad?: (size: Dimensions) => void;
    onError?: (err?: Error) => void;
}

export interface ImageProps extends ImagePropsShared<RX.Image> {
    style?: StyleRuleSetRecursive<ImageStyleRuleSet>;
}

export interface ImageMetadata {
    width: number;
    height: number;
}

export interface AnimatedImageProps extends ImagePropsShared<RX.AnimatedImage> {
    style?: StyleRuleSetRecursive<AnimatedImageStyleRuleSet | ImageStyleRuleSet>;
}

// Text
// Nested text elements follow a text layout instead of Flexbox.
//
// <Text>I am a <Text style={{fontWeight: 'bold'}}>very</Text> important example</Text>
//
// Will render as
// | I am a very |
// | important   |
// | example     |
export interface TextPropsShared<C = React.Component> extends CommonProps<C> {
    selectable?: boolean;
    numberOfLines?: number;

    // Should fonts be scaled according to system setting? Defaults
    // to true. iOS and Android only.
    allowFontScaling?: boolean;

    // iOS and Android only
    ellipsizeMode?:  'head' | 'middle' | 'tail';

    // Exposing this property as temporary workaround to fix a bug.
    // TODO : http://skype.vso.io/865016 : remove this exposed property
    // Used only for Android.
    textBreakStrategy?: 'highQuality' | 'simple' | 'balanced';

    importantForAccessibility?: ImportantForAccessibility;
    accessibilityId?: string;

    autoFocus?: boolean; // The component is a candidate for being autofocused.

    onPress?: (e: SyntheticEvent) => void;

    id?: string; // Web only. Needed for accessibility.
    onContextMenu?: (e: MouseEvent) => void;
}

export interface TextProps extends TextPropsShared<RX.Text> {
    style?: StyleRuleSetRecursive<TextStyleRuleSet>;
}

export interface AnimatedTextProps extends TextPropsShared<RX.AnimatedText> {
    style?: StyleRuleSetRecursive<AnimatedTextStyleRuleSet | TextStyleRuleSet>;
}

export type ViewLayerType = 'none' | 'software' | 'hardware';

export enum LimitFocusType {
    Unlimited = 0,
    // When limitFocusWithin=Limited, the View and the focusable components inside
    // the View get both tabIndex=-1 and aria-hidden=true.
    Limited = 1,
    // When limitFocusWithin=Accessible, the View and the focusable components inside
    // the View get only tabIndex=-1.
    Accessible = 2
}

// View
export interface ViewPropsShared<C = React.Component> extends CommonProps<C>, CommonAccessibilityProps {
    title?: string;
    ignorePointerEvents?: boolean; // Prop for disabling touches on self
    blockPointerEvents?: boolean; // Prop for disabling touches on self and all child views
    shouldRasterizeIOS?: boolean; // iOS-only prop, if view should be rendered as a bitmap before compositing
    viewLayerTypeAndroid?: ViewLayerType; // Android only property

    restrictFocusWithin?: boolean; // Web-only, during the keyboard navigation, the focus will not go outside this view
    limitFocusWithin?: LimitFocusType; // Web-only, make the view and all focusable subelements not focusable

    autoFocus?: boolean; // The component is a candidate for being autofocused.

    // When multiple components with autoFocus=true inside this View are mounting at the same time,
    // and/or multiple components inside this view have received requestFocus() call during the same
    // render cycle, this callback will be called so that it's possible for the application to
    // decide which one should actually be focused.
    arbitrateFocus?: FocusArbitrator;

    importantForLayout?: boolean; // Web-only, additional invisible DOM elements will be added to track the size changes faster
    id?: string; // Web-only. Needed for accessibility.
    ariaLabelledBy?: string; // Web-only. Needed for accessibility.
    ariaRoleDescription?: string; // Web-only. Needed for accessibility.
    accessibilityLiveRegion?: AccessibilityLiveRegion; // Android and web only

    // There are a couple of constraints when child animations are enabled:
    //   - Every child must have a `key`.
    //   - String refs aren't supported on children. Only callback refs are.
    animateChildEnter?: boolean;
    animateChildLeave?: boolean;
    animateChildMove?: boolean;

    onAccessibilityTapIOS?: (e: SyntheticEvent) => void;
    onLayout?: (e: ViewOnLayoutEvent) => void;
    onMouseEnter?: (e: MouseEvent) => void;
    onMouseLeave?: (e: MouseEvent) => void;
    onDragStart?: (e: DragEvent) => void;
    onDrag?: (e: DragEvent) => void;
    onDragEnd?: (e: DragEvent) => void;
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

    // iOS and Android only. Visual touchfeedback properties
    disableTouchOpacityAnimation?: boolean;
    activeOpacity?: number;
    underlayColor?: string;

    onContextMenu?: (e: MouseEvent) => void;
    onStartShouldSetResponder?: (e: SyntheticEvent) => boolean;
    onMoveShouldSetResponder?: (e: SyntheticEvent) => boolean;
    onStartShouldSetResponderCapture?: (e: SyntheticEvent) => boolean;
    onMoveShouldSetResponderCapture?: (e: SyntheticEvent) => boolean;
    onResponderGrant?: (e: SyntheticEvent) => void;
    onResponderReject?: (e: SyntheticEvent) => void;
    onResponderRelease?: (e: SyntheticEvent) => void;
    onResponderStart?: (e: TouchEvent) => void;
    onResponderMove?: (e: TouchEvent) => void;
    onTouchStartCapture?: (e: TouchEvent) => void;
    onTouchMoveCapture?: (e: TouchEvent) => void;
    onResponderEnd?: (e: TouchEvent) => void;
    onResponderTerminate?: (e: SyntheticEvent) => void;
    onResponderTerminationRequest?: (e: SyntheticEvent) => boolean;
}

export interface ViewProps extends ViewPropsShared<RX.View> {
    style?: StyleRuleSetRecursive<ViewStyleRuleSet>;
    useSafeInsets?: boolean;
}

export interface AnimatedViewProps extends ViewPropsShared<RX.AnimatedView> {
    style?: StyleRuleSetRecursive<AnimatedViewStyleRuleSet | ViewStyleRuleSet>;
}

// GestureView
export interface GestureState {
    isTouch: boolean;
    timeStamp: number;
}

export interface TapGestureState extends GestureState {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
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

export interface ScrollWheelGestureState extends TapGestureState {
    scrollAmount: number;
}

export interface PanGestureState extends TapGestureState {
    initialClientX: number;
    initialClientY: number;
    initialPageX: number;
    initialPageY: number;
    velocityX: number;
    velocityY: number;

    isComplete: boolean;
}

export enum GestureMouseCursor {
    Default,
    Pointer,
    Grab,
    Move,
    EWResize,
    NSResize,
    NESWResize,
    NWSEResize,
    NotAllowed,
    ZoomIn,
    ZoomOut
}

export enum PreferredPanGesture {
    Horizontal,
    Vertical
}

export interface GestureViewProps extends CommonStyledProps<ViewStyleRuleSet, RX.GestureView>, CommonAccessibilityProps {
    // Gestures and attributes that apply only to touch inputs
    onPinchZoom?: (gestureState: MultiTouchGestureState) => void;
    onRotate?: (gestureState: MultiTouchGestureState) => void;

    // Gestures and attributes that apply only to mouse inputs
    onScrollWheel?: (gestureState: ScrollWheelGestureState) => void;
    mouseOverCursor?: GestureMouseCursor;

    // Gestures and attributes that apply to either touch or mouse inputs
    onPan?: (gestureState: PanGestureState) => void;
    onPanVertical?: (gestureState: PanGestureState) => void;
    onPanHorizontal?: (gestureState: PanGestureState) => void;
    onTap?: (gestureState: TapGestureState) => void;
    onDoubleTap?: (gestureState: TapGestureState) => void;
    onLongPress?: (gestureState: TapGestureState) => void;
    onContextMenu?: (gestureState: TapGestureState) => void;

    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    onKeyPress?: (e: KeyboardEvent) => void;

    // We can set vertical or horizontal as preferred
    preferredPan?: PreferredPanGesture;

    // How many pixels (in either horizontal or vertical direction) until
    // pan is recognized? Default is 10. Can be any value > 0.
    panPixelThreshold?: number;

    // Something else wants to become responder. Should this view release the responder?
    // Setting true allows release
    releaseOnRequest?: boolean;
}

export interface ScrollIndicatorInsets {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

// ScrollView
export interface ScrollViewProps extends CommonStyledProps<ScrollViewStyleRuleSet, RX.ScrollView>, CommonAccessibilityProps {
    children?: ReactNode;

    horizontal?: boolean; // By default false

    onLayout?: (e: ViewOnLayoutEvent) => void;
    onContentSizeChange?: (width: number, height: number) => void;
    onScroll?: (newScrollTop: number, newScrollLeft: number) => void;
    onScrollBeginDrag?: () => void;
    onScrollEndDrag?: () => void;
    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;

    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    scrollEnabled?: boolean;

    // The following props are valid only on native platforms and
    // have no meaning on the web implementation.
    keyboardDismissMode?: 'none' | 'interactive' | 'on-drag';
    keyboardShouldPersistTaps?: boolean | 'always' | 'never' | 'handled';

    // This controls how often the scroll event will be fired while scrolling
    // (in milliseconds between events). A lower number yields better accuracy for code
    // that is tracking the scroll position, but can lead to scroll performance
    // problems due to the volume of information being send over the bridge.
    // The default value is 16, which means the scroll event will be sent
    // at most once very frame.
    // @platform ios
    scrollEventThrottle?: number;

    // iOS only properties for controlling bounce effect when scrolling.
    // When true, the scroll view bounces when it reaches the end of the content
    // if the content is larger then the scroll view along the axis of the scroll direction.
    // When false, it disables all bouncing even if the alwaysBounce* props are true.
    // The default value is true.
    bounces?: boolean;

    // iOS only properties to allow snapping the items within a scroll view one by one or in pages.
    pagingEnabled?: boolean;
    snapToInterval?: number;

    // Mobile only property (currently only iOS). If set to true, this scroll view will be
    // scrolled to the top if the status bar is tapped. The default value is true.
    // This maps to the actual behavior of the same property of ScrollView component in React Native.
    // Documentation: http://facebook.github.io/react-native/docs/scrollview.html#scrollstotop
    scrollsToTop?: boolean;

    // Android only property to control overScroll mode
    overScrollMode?: 'auto' | 'always' | 'never';

    // iOS-only property to control scroll indicator insets
    scrollIndicatorInsets?: ScrollIndicatorInsets;

    // Windows-only property to control tab navigation inside the view
    tabNavigation?: 'local' | 'cycle' | 'once';

    // Animation helpers to allow usage of the RN.Animated.Event system through ReactXP.
    // Animated.Values hooked up to either (or both) of these properties will be automatically
    // hooked into the onScroll handler of the scrollview and .setValue() will be called on them
    // with the updated values.  On supported platforms, it will use RN.Animated.event() to do
    // a native-side/-backed coupled animation.
    scrollXAnimatedValue?: RX.Types.AnimatedValue;
    scrollYAnimatedValue?: RX.Types.AnimatedValue;
}

// Link
export interface LinkProps extends CommonStyledProps<LinkStyleRuleSet, RX.Link> {
    title?: string;
    url: string;
    children?: ReactNode;
    selectable?: boolean;
    numberOfLines?: number;
    allowFontScaling?: boolean;
    tabIndex?: number;
    accessibilityId?: string;
    autoFocus?: boolean; // The component is a candidate for being autofocused.

    onPress?: (e: RX.Types.SyntheticEvent, url: string) => void;
    onLongPress?: (e: RX.Types.SyntheticEvent, url: string) => void;
    onHoverStart?: (e: SyntheticEvent) => void;
    onHoverEnd?: (e: SyntheticEvent) => void;
    onContextMenu?: (e: MouseEvent) => void;
}

// TextInput
export interface TextInputPropsShared<C = React.Component> extends CommonProps<C>, CommonAccessibilityProps {
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    autoFocus?: boolean; // The component is a candidate for being autofocused.
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
    title?: string;

    // Should fonts be scaled according to system setting? Defaults
    // to true. iOS and Android only.
    allowFontScaling?: boolean;

    // iOS-only prop for controlling the keyboard appearance
    keyboardAppearance?: 'default' | 'light' | 'dark';

    // iOS and Android prop for controlling return key type
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';

    // Android-only prop for disabling full screen editor mode
    disableFullscreenUI?: boolean;

    // iOS and web prop for enabling spellcheck. Defaults to the value set for 'autoCorrect'.
    spellCheck?: boolean;

    // iOS and Android only property for controlling the text input selection color
    selectionColor?: string;

    // iOS and Windows only property for controlling when the clear button should appear on the right side of the text view.
    clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';

    onKeyPress?: (e: KeyboardEvent) => void;
    onFocus?: (e: FocusEvent) => void;
    onBlur?: (e: FocusEvent) => void;
    onPaste?: (e: ClipboardEvent) => void;
    onChangeText?: (newValue: string) => void;
    onSelectionChange?: (start: number, end: number) => void;
    onSubmitEditing?: () => void;
    onScroll?: (newScrollLeft: number, newScrollTop: number) => void;
}

export interface TextInputProps extends TextInputPropsShared<RX.TextInput> {
    style?: StyleRuleSetRecursive<TextInputStyleRuleSet>;
}

export interface AnimatedTextInputProps extends TextInputPropsShared<RX.AnimatedTextInput> {
    style?: StyleRuleSetRecursive<AnimatedTextInputStyleRuleSet | TextInputStyleRuleSet>;
}

// ActivityIndicator
export interface ActivityIndicatorProps extends CommonStyledProps<ActivityIndicatorStyleRuleSet, RX.ActivityIndicator> {
    color: string;
    size?: 'large' | 'medium' | 'small' | 'tiny';
    deferTime?: number; // Number of ms to wait before displaying
}

// 'context' mode makes it attempt to behave like a context menu -- defaulting
// to the lower right of the anchor element and working its way around.  It is not supported
// with inner positioning and will throw an exception if used there.
export type PopupPosition  = 'top' | 'right' | 'bottom' | 'left' | 'context';

// Popup
export interface PopupOptions {
    // Returns a mounted component instance that serves as the
    // "anchor" for the popup. Often a button.
    getAnchor: () => React.Component<any, any>;

    // Renders the contents of the popup.
    renderPopup: (anchorPosition: PopupPosition, anchorOffset: number,
        popupWidth: number, popupHeight: number) => ReactNode;

    // Returns a mounted component instance that controls the triggering of the popup.
    // In majority of cases, "anchor" of popup has handlers to control when the popup will be seen and this function is not required.
    // In a few cases, where anchor is not the same as the whole component that triggers when the popup wil be seen, this can be used.
    // For instance, a button combined with a chevron icon, which on click triggers a popup below the chevron icon.
    // In this example, getElementTriggeringPopup() can return the container with button and chevron icon.
    getElementTriggeringPopup?: () => React.Component<any, any>;

    // Called when the popup is dismissed.
    onDismiss?: () => void;

    // Prioritized order of positions. Popup is positioned
    // relative to the anchor such that it remains on screen.
    // Default is ['bottom', 'right', 'top', 'left'].
    positionPriorities?: PopupPosition[];

    // Position the popup inside its anchor.
    // In this mode only the first position priority will be used.
    useInnerPositioning?: boolean;

    // On pressed handler to notify whoever wanted to create the popup that its
    // anchor has been pressed.
    // IMPORTANT NOTE: This handler may be called when the component is
    // already unmounted as it uses a time delay to accommodate a fade-out animation.
    onAnchorPressed?: (e?: RX.Types.SyntheticEvent) => void;

    // Determines if the anchor invoking the popup should behave like a toggle.
    // Value = true  => Calling Popup.show will show the popup. A subsequent call, will hide the popup, and so on.
    // Value = false or undefined (default)  => Calling Popup.show will always show the popup.
    dismissIfShown?: boolean;

    // Prevents the front-most popup from closing if the user clicks or taps
    // outside of it. It will still close if the anchor is unmounted or if
    // dismiss is explicitly called.
    preventDismissOnPress?: boolean;

    // The popup may be left in the DOM after it's dismissed. This is a performance optimization to
    // make the popup appear faster when it's shown again, intended for popups that tend to be shown
    // repeatedly. Note that this is only a hint, popups cannot be force-cached.
    cacheable?: boolean;

    // Android, iOS, and Windows only.
    // The id of the root view this popup is associated with.
    // Defaults to the view set by UserInterface.setMainView();
    rootViewId?: string;
}

// Modal
export interface ModalOptions {
    // Android, iOS, and Windows only.
    // The id of the root view this modal is associated with.
    // Defaults to the view set by UserInterface.setMainView();
    rootViewId?: string;
}

//
// Alert
//
// Alerts are not React components but OS dialog boxes which, depending
// on OS support, can show while React window is minimized or while
// the app is in background.
// ----------------------------------------------------------------------
export interface AlertButtonSpec {
    text?: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

// Web specific
export interface AlertModalTheme {
    bodyStyle?: StyleRuleSet<ViewStyle>;
    titleTextStyle?: StyleRuleSet<TextStyle>;
    messageTextStyle?: StyleRuleSet<TextStyle>;

    buttonStyle?: StyleRuleSet<ButtonStyle>;
    buttonHoverStyle?: StyleRuleSet<ButtonStyle>;
    buttonTextStyle?: StyleRuleSet<TextStyle>;

    cancelButtonStyle?: StyleRuleSet<ButtonStyle>;
    cancelButtonHoverStyle?: StyleRuleSet<ButtonStyle>;
    cancelButtonTextStyle?: StyleRuleSet<TextStyle>;
}

export interface AlertOptions {
    icon?: string;
    theme?: AlertModalTheme;
    rootViewId?: string;
    preventDismissOnPress?: boolean;
}

//
// Location
// ----------------------------------------------------------------------
export enum LocationErrorType {
    PermissionDenied = 1,
    PositionUnavailable,
    Timeout
}

export type LocationWatchId = number;
export type LocationSuccessCallback = (position: Position) => void;
export type LocationFailureCallback = (error: LocationErrorType) => void;

//
// Animated
// ----------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Animated {
    export interface EndResult { finished: boolean }
    export type EndCallback = (result: EndResult) => void;
    export interface CompositeAnimation {
        start: (callback?: EndCallback) => void;
        stop: () => void;
    }

    export interface LoopConfig {
        restartFrom: number;
    }

    export interface AnimationConfig {
        useNativeDriver?: boolean;
        isInteraction?: boolean;
    }

    export interface TimingAnimationConfig extends AnimationConfig {
        toValue: number;
        easing?: EasingFunction;
        duration?: number;
        delay?: number;
        loop?: LoopConfig;
    }

    export interface InterpolationConfigType {
        inputRange: number[];
        outputRange: (number | string)[];
    }

    export type TimingFunction = (value: RX.Types.AnimatedValue | RX.Types.InterpolatedValue,
        config: TimingAnimationConfig) => CompositeAnimation;
    export let timing: TimingFunction;

    export type SequenceFunction = (animations: CompositeAnimation[]) => CompositeAnimation;
    export let sequence: SequenceFunction;

    export type ParallelFunction = (animations: CompositeAnimation[]) => CompositeAnimation;
    export let parallel: ParallelFunction;

    export interface EasingFunction {
        cssName: string;
        function: (input: number) => number;
    }

    export interface Easing {
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

//
// Events
// ----------------------------------------------------------------------
export interface SyntheticEvent {
    readonly bubbles: boolean;
    readonly cancelable: boolean;
    readonly defaultPrevented: boolean;
    readonly timeStamp: number;
    readonly nativeEvent: any; // Platform-specific
    preventDefault(): void;
    stopPropagation(): void;
}

export interface ClipboardEvent extends SyntheticEvent {
    clipboardData: DataTransfer;
}

export type FocusEvent = SyntheticEvent;

export interface MouseEvent extends SyntheticEvent {
    altKey: boolean;
    button: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    pageX?: number;
    pageY?: number;
}

export interface DragEvent extends MouseEvent {
    dataTransfer: DataTransfer;
}

export interface Touch {
    identifier: number;
    locationX: number;
    locationY: number;
    screenX: number;
    screenY: number;
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
}

export interface TouchList {
    [index: number]: Touch;
    length: number;
    item(index: number): Touch;
    identifiedTouch(identifier: number): Touch;
}

export interface TouchEvent extends SyntheticEvent {
    // We override this definition because the public
    // type excludes location and page fields.
    altKey: boolean;
    changedTouches: TouchList;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchList;
    locationX?: number;
    locationY?: number;
    pageX?: number;
    pageY?: number;
    touches: TouchList;
}

export interface WheelEvent extends SyntheticEvent {
    deltaMode: number;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
}

export interface ViewOnLayoutEvent {
    x: number;
    y: number;
    height: number;
    width: number;
}

export interface KeyboardEvent extends SyntheticEvent {
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    keyCode: number;
    metaKey: boolean;
    key: string;
}

//
// Component
// ----------------------------------------------------------------------
export let Children: React.ReactChildren;

//
// Dimensions
// ----------------------------------------------------------------------
export interface Dimensions {
    width: number;
    height: number;
}

//
// Linking
// ----------------------------------------------------------------------
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

export enum LinkingErrorCode {
    NoAppFound = 0,
    UnexpectedFailure = 1,
    Blocked = 2,
    InitialUrlNotFound = 3
}

export interface LinkingErrorInfo {
    code: LinkingErrorCode;
    url?: string;
    description?: string;
}

//
// App
// ----------------------------------------------------------------------
export enum AppActivationState {
    Active = 1,
    Background = 2,
    Inactive = 3,
    Extension = 4
}

// UserInterface
// ----------------------------------------------------------------------
export interface LayoutInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}

//
// Platform
// ----------------------------------------------------------------------
export type PlatformType = 'web' | 'ios' | 'android' | 'windows' | 'macos';
