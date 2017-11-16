/**
* react-native.d.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Type definition file for React Native, based on the React.js definition file on https://github.com/borisyankov/DefinitelyTyped.
*/

declare module 'react-native' {
    //
    // React
    // ----------------------------------------------------------------------

    import React = require('react');

    // BT: Adding ProgressBarAndroid. It's not part of the DefinitelyTyped definitions.
    class ProgressBarAndroid extends React.Component<any, any> {}

    type ReactElement<T> = React.ReactElement<T>;
    type ReactNode = React.ReactNode;

    function createElement<P>(
        type: string,
        props?: P,
        ...children: React.ReactNode[]): React.ReactElement<P>;

    function cloneElement<P>(
        element: P,
        props ?: any
    ): React.ReactElement<P>;

    interface SyntheticEvent extends React.SyntheticEvent {}

    function isValidElement(object: {}): boolean;
    function findNodeHandle(componentOrHandle: any): number;

    var Children: React.ReactChildren;

    type PlatformString = 'android'|'ios'|'windows'|'macos';
    var Platform: {
        OS: PlatformString,
        Version?: number
    };

    //
    // Component base
    // ----------------------------------------------------------------------

    abstract class ReactNativeBaseComponent<P, S> extends React.Component<P, S> {
        setNativeProps(nativeProps: P): void;
        focus(): void;
        blur(): void;
        measure(callback: ((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void)): void;
        measureLayout(relativeToNativeNode: number, onSuccess: ((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void), onFail: () => void): void;
        refs: {
            [key: string]: ReactNativeBaseComponent<any, any>;
        }
    }

    //
    // Style rules
    // ----------------------------------------------------------------------

    type StyleRuleSet = Object | Object[];

    //
    // Specific components
    // ----------------------------------------------------------------------

    interface ComponentPropsBase {
        ref?: string | ((obj: ReactNativeBaseComponent<any, any>) => void);
        key?: string | number;
    }

    interface ComponentPropsStyleBase extends ComponentPropsBase {
        style?: StyleRuleSet | StyleRuleSet[];
    }

    interface ImageSource {
            uri: string;
            headers?: {[header: string]: string};
    }

    interface ImageProps extends ComponentPropsStyleBase {
        onLayout?: Function;
        resizeMode?: string;
        resizeMethod?: string; // android only prop: 'auto' | 'resize' | 'scale'
        source?: ImageSource | number;
        testID?: string;

        // iOS
        accessibilityLabel?: string;
        shouldRasterizeIOS?: boolean;
        accessible?: boolean;
        capInsets?: Object;
        defaultSource?: Object;
        onError?: Function;
        onLoad?: Function;
        onLoadEnd?: (e: SyntheticEvent) => void;
        onLoadStart?: Function;
        onProgress?: Function;

        // Android
        fadeDuration?: number;
    }

    interface ActivityIndicatorProps extends ComponentPropsBase {
        animating?: boolean;
        color?: string;
        onLayout?: Function;
        size?: string; // enum { 'small', 'large' }
    }

    interface TextProps extends ComponentPropsStyleBase {
        importantForAccessibility?: string; // 'auto' | 'yes' | 'no' | 'no-hide-descendants';
        allowFontScaling?: boolean;
        maxContentSizeMultiplier?: number;
        children?        : React.ReactNode;
        numberOfLines?   : number;
        ellipsizeMode?   : 'head' | 'middle' | 'tail' // There's also 'clip' but it is iOS only
        onLayout?        : Function;
        onPress?         : Function;
        onLongPress?     : Function;
        selectable?      : boolean; // only on android, windows
        testID?          : string;

        // iOS
        suppressHighlighting?: boolean;

        // Android
        textBreakStrategy?: 'highQuality' | 'simple'| 'balanced';
        elevation?: number;
    }

    export interface PickerProps extends ComponentPropsStyleBase {

        /**
         * Callback for when an item is selected. This is called with the
         * following parameters:
         * - itemValue: the value prop of the item that was selected
         * - itemPosition: the index of the selected item in this picker
         * @param itemValue
         * @param itemPosition
         */
        onValueChange?: ( itemValue: any, itemPosition: number ) => void

        /**
         * Value matching value of one of the items.
         * Can be a string or an integer.
         */
        selectedValue?: any

        style?: StyleRuleSet | StyleRuleSet[]

        /**
         * Used to locate this view in end-to-end tests.
         */
        testId?: string

        ref?: string | ((obj: ReactNativeBaseComponent<any, any>) => void);
    }

    interface TouchableWithoutFeedbackProps extends ComponentPropsBase {
        accessibilityComponentType?    : string; //enum ( 'none', 'button', 'radiobutton_checked', 'radiobutton_unchecked' )
        accessibilityTraits?: string | string[]; //enum( 'none', 'button', 'link', 'header', 'search', 'image', 'selected', 'plays', 'key', 'text', 'summary', 'disabled', 'frequentUpdates', 'startsMedia', 'adjustable', 'allowsDirectInteraction', 'pageTurn' )
        accessible?: boolean;
        importantForAccessibility? : string; //enum( 'auto', 'yes', 'no', 'no-hide-descendants' )
        delayLongPress?: number;
        delayPressIn?: number;
        delayPressOut?: number;
        onLayout?: Function;
        onLongPress?: Function;
        onPress?: Function;
        onPressIn?: Function;
        onPressOut?: Function
    }

    interface TouchableHighlightProps extends TouchableWithoutFeedbackProps, ComponentPropsStyleBase {
        activeOpacity? : number;
        children?      : React.ReactNode;
        onHideUnderlay?: Function;
        onShowUnderlay?: Function;
        underlayColor? : string;
    }

    interface ResponderProps {
        onMoveShouldSetResponder?        : Function;
        onResponderGrant?                : Function;
        onResponderMove?                 : Function;
        onResponderReject?               : Function;
        onResponderRelease?              : Function;
        onResponderTerminate?            : Function;
        onResponderTerminationRequest?   : Function;
        onStartShouldSetResponder?       : Function;
        onStartShouldSetResponderCapture?: Function;
    }

    interface ViewOnLayoutEvent {
        nativeEvent: {
            layout: {
                x: number,
                y: number,
                width: number,
                height: number
            }
        }
    }

    type ViewLayerType = 'none' | 'software' | 'hardware';

    interface CommonAccessibilityProps {
        accessibilityLabel?              : string;
        accessible?                      : boolean;
        onAcccessibilityTap?             : Function;

        // android
        accessibilityComponentType?    : string; //enum ( 'none', 'button', 'radiobutton_checked', 'radiobutton_unchecked' )
        accessibilityLiveRegion?       : string; //enum ( 'none', 'polite', 'assertive' )
        importantForAccessibility?     : string; //enum( 'auto', 'yes', 'no', 'no-hide-descendants' )

        // iOS
        accessibilityTraits?: string | string[]; //enum( 'none', 'button', 'link', 'header', 'search', 'image', 'selected', 'plays', 'key', 'text', 'summary', 'disabled', 'frequentUpdates', 'startsMedia', 'adjustable', 'allowsDirectInteraction', 'pageTurn' )
    }

    interface ViewProps extends ComponentPropsBase, ResponderProps, ComponentPropsStyleBase, CommonAccessibilityProps {
        children?                        : any;
        onLayout?                        : ((ev: ViewOnLayoutEvent) => void);
        onMagicTap?                      : Function;
        pointerEvents?                   : string; //enum( 'box-none', 'none', 'box-only', 'auto' );
        removeClippedSubviews?           : boolean;
        testID?                          : string;

        // android
        collapsable?                   : boolean;
        needsOffscreenAlphaCompositing?: boolean;
        renderToHardwareTextureAndroid?: boolean;
        viewLayerTypeAndroid?          : ViewLayerType;
        elevation?                     : number;

        // iOS
        onAccessibilityTapIOS?: Function;
        shouldRasterizeIOS? : boolean;
    }

    interface ScrollViewProps extends ViewProps {
        children?: any;

        contentContainerStyle?: StyleRuleSet | StyleRuleSet[];
        horizontal?: boolean;
        keyboardDismissMode?: 'none' | 'interactive' | 'on-drag';
        keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
        onScroll?: Function;
        onScrollBeginDrag?: Function;
        onScrollEndDrag?: Function;
        onContentSizeChange?: (width: number, height: number) => void;
        showsHorizontalScrollIndicator?: boolean;
        showsVerticalScrollIndicator?: boolean;
        removeClippedSubviews?: boolean;

        // iOS
        automaticallyAdjustContentInsets?: boolean;
        //contentInset?: EdgeInsetsPropType;
        //contentOffset?: PointPropType;
        bounces?: boolean;
        bouncesZoom?: boolean;
        alwaysBounceHorizontal?: boolean;
        alwaysBounceVertical?: boolean;
        centerContent?: boolean;
        decelerationRate?: number;
        directionalLockEnabled?: boolean;
        canCancelContentTouches?: boolean;
        maximumZoomScale?: number;
        minimumZoomScale?: number;
        onScrollAnimationEnd?: Function;
        pagingEnabled?: boolean;
        scrollEnabled?: boolean;
        scrollEventThrottle?: number;
        scrollsToTop?: boolean;
        stickyHeaderIndices?: [number];
        snapToInterval?: number;
        snapToAlignment?: string; // enum( 'start', 'center', 'end' )
        zoomScale?: number;
        overScrollMode?: string; //enum( 'always', 'always-if-content-scrolls', 'never' )
        // iOS
        scrollIndicatorInsets?: {top: number, left: number, bottom: number, right: number };
    }

    interface ListViewDataSourceCallback {
        rowHasChanged: <T>(r1: T, r2: T) => boolean;
    }

    interface ListViewDataSource {
        new (onAsset: ListViewDataSourceCallback): ListViewDataSource;
        cloneWithRows<T>(rowList: T[]): void;
    }

    interface ListViewProps extends ScrollViewProps {
        dataSource: Object; //PropTypes.instanceOf(ListViewDataSource).isRequired
        renderSeparator?: Function;
        renderRow: Function;
        initialListSize?: number;
        onEndReached?: (e: React.SyntheticEvent) => void;
        onEndReachedThreshold?: number;
        pageSize?: number;
        renderFooter?: Function;
        renderHeader?: Function;
        renderSectionHeader?: Function;
        renderScrollComponent: Function;
        scrollRenderAheadDistance?: number;
        onChangeVisibleRows?: Function;
        removeClippedSubviews?: boolean;
    }

    interface ModalProps extends ComponentPropsBase {
        animationType?: string; // enum( 'none', 'slide', 'fade' )
        onDismiss?: Function;
        transparent?: boolean;
        onRequestClose: () => void;
    }

    interface TextInputProps extends ComponentPropsStyleBase, CommonAccessibilityProps {
        autoCapitalize?: string; // enum('none', 'sentences', 'words', 'characters')
        autoCorrect?: boolean;
        autoFocus?: boolean;
        blurOnSubmit?: boolean;
        defaultValue?: string;
        editable?: boolean;
        keyboardType?: string; // enum("default", 'numeric', 'email-address', "ascii-capable", 'numbers-and-punctuation', 'url', 'number-pad', 'phone-pad', 'name-phone-pad', 'decimal-pad', 'twitter', 'web-search')
        multiline?: boolean;
        onBlur?: ((e: React.FocusEvent) => void);
        onKeyPress?: (e: SyntheticEvent) => void;
        onChange?: Function;
        onChangeText?: ((changedText: string) => void);
        onSelectionChange?: ((selection: SyntheticEvent) => void);
        onEndEditing?: Function;
        onFocus?: ((e: React.FocusEvent) => void);
        onLayout?: ((props: { x: number, y: number, width: number, height: number }) => void);
        onSubmitEditing?: Function;
        onScroll?: Function;
        placeholder?: string;
        placeholderTextColor?: string;
        returnKeyType?: string; // enum('default', 'go', 'google', 'join', 'next', 'route', 'search', 'send', 'yahoo', 'done', 'emergency-call')
        secureTextEntry?: boolean;
        testID?: string;
        textAlign?: string; // enum('auto' | 'left' | 'right' | 'center' | 'justify')
        allowFontScaling?: boolean;
        maxContentSizeMultiplier?: number;
        selection?: { start: number, end: number };

        //iOS and android
        selectionColor?: string;

        value: string;
        //iOS
        clearButtonMode?: string; // enum('never', 'while-editing', 'unless-editing', 'always')
        clearTextOnFocus?: boolean;
        enablesReturnKeyAutomatically?: boolean;
        keyboardAppearance?: string; // enum ('default', 'light', 'dark')
        maxLength?: number;
        numberOfLines?: number;
        selectTextOnFocus?: boolean;
        selectionState?: any; // see DocumentSelectionState.js
        spellCheck?: boolean;
        //android
        textAlignVertical?: string; // enum('top', 'center', 'bottom')
        textAlignVerticalAndroid?: string; // enum('top', 'center', 'bottom')
        textAlignAndroid?: string;
        underlineColorAndroid?: string;
        disableFullscreenUI?: boolean;
        textBreakStrategy?: 'highQuality' | 'simple' | 'balanced';
        // macOS only property for submitting the text on enter
        submitTextOnEnter?: boolean;
    }

    interface TextInputState {
        currentlyFocusedField(): number;
        focusTextInput(textFieldID?: number): void;
        blurTextInput(textFieldID?: number): void;
    }

    interface WebViewProps extends ComponentPropsStyleBase {
        automaticallyAdjustContentInsets?: boolean;
        bounces?: boolean;
        contentInset?: {top: number, left: number, bottom: number, right: number };
        injectedJavaScript?: string;
        javaScriptEnabled?: boolean;
        domStorageEnabled?: boolean;
        onShouldStartLoadWithRequest?: Function;
        onNavigationStateChange?: Function;
        onLoad?: (e: SyntheticEvent) => void;
        onLoadStart?: Function;
        renderError?: Function;
        onError?: Function;
        renderLoading?: Function;
        scalesPageToFit?: boolean;
        scrollEnabled?: boolean;
        startInLoadingState?: boolean;
        source?: { uri: string; method?: string; headers?: Object; body?: string; } | { html: string; baseUrl?: string; };
    }

    interface NavigatorProps extends ComponentPropsBase {
        configureScene?: Function;
        initialRoute?: any;
        initialRouteStack?: any[];
        navigatorBar?: any;
        navigator?: Navigator;
        onDidFocus?: Function; //deprecated
        onWillFocus?: Function; //deprecated
        renderScene: Function;
        sceneStyle?: StyleRuleSet | StyleRuleSet[];
    }

    interface DatePickerIOSProps extends ComponentPropsStyleBase {
        date?: Date;
        maximumDate?: Date;
        minimumDate?: Date;
        minuteInterval?: number;
        mode?: string;
        timeZoneOffsetInMinutes?: number;

        onDateChange?: (newDate: Date) => void;
    }

    class DatePickerIOS extends ReactNativeBaseComponent<DatePickerIOSProps, {}> {
    }

    interface DatePickerAndroidProps extends ComponentPropsStyleBase {
        date?: Date;
        maxDate?: Date;
        minDate?: Date;

        onDateChange?: (newDate: Date) => void;
    }

    class DatePickerAndroid extends ReactNativeBaseComponent<DatePickerAndroidProps, {}> {
        static open(options: { date: Date, maxDate: Date, minDate: Date }): Promise<DatePickerAction>;
        static dateSetAction: Function;
        static dismissedAction: Function;
    }

    interface TimePickerAndroidProps extends ComponentPropsStyleBase {
        date?: Date;
        maxDate?: Date;
        minDate?: Date;

        onDateChange?: (newDate: Date) => void;
    }

    class TimePickerAndroid extends ReactNativeBaseComponent<TimePickerAndroidProps, {}> {
        static open(options: { hour: number, minute: number, is24Hour: boolean }): Promise<TimePickerAction>;
        static timeSetAction: Function;
        static dismissedAction: Function;
    }

    type DatePickerAction = {
        action: Function;
        day: number;
        month: number;
        year: number;
    }

    type TimePickerAction = {
        action: Function;
        hour: number;
        minute: number;
    }

    class Image extends ReactNativeBaseComponent<ImageProps, {}> {
        static prefetch(url: string): Promise<boolean>;
    }
    class ActivityIndicator extends ReactNativeBaseComponent<ActivityIndicatorProps, {}> { }
    class Text extends ReactNativeBaseComponent<TextProps, {}> { }
    class Picker extends ReactNativeBaseComponent<PickerProps, {}> {
        static Item: any;
    }
    class TouchableHighlight extends ReactNativeBaseComponent<TouchableHighlightProps, {}> { }
    class TouchableWithoutFeedback extends ReactNativeBaseComponent<TouchableWithoutFeedbackProps, {}> { }
    class View extends ReactNativeBaseComponent<ViewProps, {}> { }
    class ScrollView extends ReactNativeBaseComponent<ScrollViewProps, {}> {
        getInnerViewNode(): number;
        // TODO: Define ScrollResponder type
        scrollTo(val: { x?: number; y?: number; animated?: boolean; }): void;
        scrollBy(val: { deltaX?: number; deltaY?: number; animated?: boolean; }): void;
     }
    class ListView extends ReactNativeBaseComponent<ListViewProps, {}> {
        static DataSource: ListViewDataSource;
    }
    class Modal extends ReactNativeBaseComponent<ModalProps, {}> { }
    class TextInput extends ReactNativeBaseComponent<TextInputProps, {}> {
        static State: TextInputState;
    }
    class WebView extends ReactNativeBaseComponent<WebViewProps, {}> {
        reload() : void;
        goBack() : void;
        goForward() : void;
    }
    class Navigator extends ReactNativeBaseComponent<NavigatorProps, {}> {
        static SceneConfigs: {
            PushFromRight: any;
            FloatFromRight: any;
            FloatFromLeft: any;
            FloatFromBottom: any;
            FloatFromBottomAndroid: any;
            FadeAndroid: any;
            HorizontalSwipeJump:any;
        };
        getCurrentRoutes(): any[];
        jumpBack(): void;
        jumpForward(): void;
        jumpTo(route: any): void;
        push(route: any): void;
        pop(): void;
        replace(route: any): void;
        replaceAtIndex(route: any, index: number): void;
        replacePrevious(route: any): void;
        immediatelyResetRouteStack(routeStack: any[]): void;
        popToRoute(route: any): void;
        popToTop(): void;
    }

    interface ActionSheetOptions {
        options: string[];
        cancelButtonIndex?: number;
        destructiveButtonIndex?: number;
        title?: string;
        message?: string;
    }

    interface ShareActionSheetOptions {
        message?: string;
        url?: string;
        subject?: string;
        excludedActivityTypes?: string[];
    }

    class ActionSheetIOS {
        static showActionSheetWithOptions(options: ActionSheetOptions, callback: (buttonIndex: number) => void): void;
        static showShareActionSheetWithOptions(options: ShareActionSheetOptions, failureCallback: (error: string) => void, successCallback: (success: boolean, method: string) => void): void;
    }

    class BackAndroid {
        static addEventListener(eventName: string, callback: () => boolean): void;
        static removeEventListener(eventName: string, callback: () => boolean): void;
    }

    interface NavigatorIOSRoute {
        component: any;
        title: string;
        passProps?: any;
        backButtonTitle?: string;
        backButtonIcon?: any;
        leftButtonTitle?: string;
        leftButtonIcon?: any;
        onLeftButtonPress?: () => void;
        rightButtonTitle?: string;
        rightButtonIcon?: any;
        onRightButtonPress?: () => void;
        wrapperStyle?: any;
    }

    interface NavigatorIOSProps extends ComponentPropsBase {
        barTintColor?: string;
        initialRoute: NavigatorIOSRoute;
        itemWrapperStyle?: StyleRuleSet | StyleRuleSet[];
        navigationBarHidden?: boolean;
        shadowHidden?: boolean;
        style?:any;
        tintColor?: string;
        titleTextColor?: string;
        translucent?: boolean;
        interactivePopGestureEnabled?: boolean;
    }

    class StatusBar {
        // Native
        static setHidden(hidden: boolean, animation?: string): void; //'none'|'fade'|'slide';

        // iOS
        static setBarStyle(barStyle: string, animated: boolean): void; //'default'|'light-content';
        static setNetworkActivityIndicatorVisible(value: boolean): void;

        // Android
        static setBackgroundColor(color: string, animated?: boolean): void;
        static setTranslucent(translucent: boolean): void;
    }

    interface EventSubscription {
        remove(): void;
    }

    interface NavigatorIOSNavigationContext {
        addListener(event: string, callback: (route: NavigatorIOSRoute) => void): EventSubscription;
    }

    interface NavigatorIOSState {
        observedTopOfStack: number;
        requestedTopOfStack: number;
        routeStack: NavigatorIOSRoute[];
    }

    class NavigatorIOS extends ReactNativeBaseComponent<NavigatorIOSProps, NavigatorIOSState> {
        navigationContext: NavigatorIOSNavigationContext;
        push(route: NavigatorIOSRoute): void;
        pop(): void;
        popN(n: number): void;
        replace(route: NavigatorIOSRoute): void;
        replacePrevious(route: NavigatorIOSRoute): void;
        replacePreviousAndPop(route: NavigatorIOSRoute): void;
        resetTo(route: NavigatorIOSRoute): void;
        popToRoute(route: NavigatorIOSRoute): void;
        popToTop(): void;
    }

    // StyleSheet
    class StyleSheet {
        static create(obj: { [key: string]: any }): any;
        static flatten: (s: StyleSheet) => { [key: string]: any };
    }

    class AppRegistry {
        static registerComponent(appKey: string, getComponentFunc: Function): any;
    }

   type  CameraRollProps = {
        /**
        * The number of photos wanted in reverse order of the photo application
        * (i.e. most recent first for SavedPhotos).
        */
        first: number,

        /**
        * A cursor that matches `page_info { end_cursor }` returned from a previous
        * call to `getPhotos`
        */
        after?: string,

        /**
        * Specifies which group types to filter the results to.
        */
        groupTypes?: string, // enum { 'Album', 'All', 'Event', 'Faces', 'Library', 'PhotoStream', 'SavedPhotos', // default },

        /**
        * Specifies filter on group names, like 'Recent Photos' or custom album
        * titles.
        */
        groupName?: string,

        /**
        * Specifies filter on asset type
        */
        assetType?: string; // enum {  'All', 'Videos', 'Photos', // default },

    }

   type GetPhotosCallbackPropNode = {
       node: {
            type: string,
            group_name: string,
            image: {
                uri: string,
                height: number,
                width: number,
                isStored?: boolean,
            },
            timestamp: number,
            location?: {
                latitude?: number,
                longitude?: number,
                altitude?: number,
                heading?: number,
                speed?: number,
            }
       }
   }

   type GetPhotosCallbackProps = {
        edges: GetPhotosCallbackPropNode[],
        page_info: {
            has_next_page: boolean,
            start_cursor?: string,
            end_cursor?: string,
        }
    }

    class Clipboard {
        static setString(content: string): void;
        static getString(): Promise<string>;
    }

    class CameraRoll {
        static saveImageWithTag(tag: string, successCallback: Function, errorCallback: Function): void;
        static getPhotos(params: CameraRollProps, callback: ((props: GetPhotosCallbackProps) => void), errorCallback: Function): void;
    }

    class Linking {
        static getInitialURL(): Promise<string>;
        static openURL(url: string): Promise<void>;
        static canOpenURL(url: string): Promise<boolean>;
        static addEventListener(type: string, handler: (event: any) => void): void;
        static removeEventListener(type: string, handler: (event: any) => void): void;
    }

    class AccessibilityInfo {
        static initialHighContrast: boolean|undefined;
        static fetch: () => Promise<boolean>;
        static fetchIsHighContrast: () => Promise<boolean>;
        static addEventListener(type: string, handler: (event: any) => void): void;
        static removeEventListener(type: string, handler: (event: any) => void): void;
        static announceForAccessibility(announcement: string): void;
        static setAccessibilityFocus(reactTag: number): void;
    }

    interface AlertButtonSpec {
        text?: string;
        onPress?: () => void;
        style?: string; // enum {default', 'cancel', 'destructive'}
    }

    class Alert {
        static alert(
            title: string,
            message?: string,
            buttons?: AlertButtonSpec[],
            type?: string // enum { 'default', 'plain-text', 'secure-text', 'login-password'}
        ): void;
    }

    class PushNotificationIOS {
        static presentLocalNotification(details: { category: string, alertBody: string, soundName?: string}): void;
        static scheduleLocalNotification(details: {alertBody: string, fireDate: Date}): void;

        static getApplicationIconBadgeNumber(callback: (badgeCount:number) => void): void;
        static setApplicationIconBadgeNumber(number: number): void;

        static addEventListener(type: string, handler: (event: any) => void): void;

        static requestPermissions(permissions?: {alert?: boolean, badge?: boolean, sound?: boolean}): void;
        static abandonPermissions(): void;
        static checkPermissions(callback: (permissions: {alert: boolean, badge: boolean, sound: boolean}) => void): void;

        static getInitialNotification(): Promise<PushNotificationIOS>;

        getMessage(): string;
        getSound(): string;
        getAlert(): any;
        getBadgeCount(): number;
        getData(): any;
    }

    interface PanResponderGestureState {
        stateID: number;
        moveX: number;
        moveY: number;
        x0: number;
        y0: number;
        dx: number;
        dy: number;
        vx: number;
        vy: number;
        numberActiveTouches: number;
    }

    interface ResponderSyntheticEvent extends React.SyntheticEvent {
        touchHistory: Function;
    }

    type PanResponderCreateConfig = {
        onMoveShouldSetPanResponder?: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
        onMoveShouldSetPanResponderCapture?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onStartShouldSetPanResponder?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onStartShouldSetPanResponderCapture?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onPanResponderReject?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onPanResponderGrant?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onPanResponderStart?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onPanResponderEnd?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onPanResponderRelease?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onPanResponderMove?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onPanResponderTerminate?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onPanResponderTerminationRequest?: ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean),
        onShouldBlockNativeResponder?:  ((e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean), // android only
        onStartShouldSetResponderCapture?: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void,

    }

    class PanResponder {
        static create(config: PanResponderCreateConfig): PanResponder;
        panHandlers: ResponderProps;
    }

    type DimensionType = {
        width: number,
        height: number,
        scale: number,
        fontScale: number,
    }

    class Dimensions {
        static set(obj: any): boolean;
        static get(key: string): DimensionType;
    }

    type RCTAppStateData = { app_state: string }
    type RCTAppState = {
        getCurrentAppState(successCallback: (appStateData: RCTAppStateData) => void, failureCallback: () => void): void;
    }

    type FileInput = {
        selectImage: Function;
    }

    type SnapshotOptions = {
        width?: number;
        height?: number;
        format?: string; // enum { 'png', 'jpeg' }
        quality?: number;
    }

    type UIManager = {
        measure: Function;
        measureInWindow: Function;
        measureLayout: Function;
        measureLayoutRelativeToParent: Function;
        dispatchViewManagerCommand: Function;

        getContentSizeMultiplier: Function;
        getMaxContentSizeMultiplier: Function;
        setMaxContentSizeMultiplier: Function;

        // ios
        takeSnapshot: (view: any, options?: SnapshotOptions) => Promise<string>;

        // Android
        sendAccessibilityEvent: Function;
    }

    type AccessibilityManager = {
        getMultiplier: Function;
        announceForAccessibility (announcement: string): void;
    }

    // We don't use this module, but need to be able to check its existance
    type NativeAnimatedModule = {

    };

    class ImagePickerManager {
        showImagePicker: Function;
        launchCamera: Function;
        launchImageLibrary: Function;
    }

    class NativeModules {
        static AppState: RCTAppState;
        static FileInput: FileInput;
        static UIManager: UIManager;
        static AccessibilityManager: AccessibilityManager;
        static ImagePickerManager: ImagePickerManager;
        static Networking: {
            clearCookies(callback: (success: boolean) => void): void;
        }
        static ContextMenuAndroid: {
            show(buttons: any, callback: (command: string) => void): void;
        }
        static NativeAnimation: NativeAnimatedModule;
     }

     class AsyncStorage {
         static getItem(key: string, callback: (error: any, result: string) => void): void;
         static setItem(key: string, value: string, callback: (error: any) => void): void;
         static removeItem(key: string, callback: (error: any) => void): void;
         static clear(callback: (error: any) => void): void;
     }

     class NetInfo {
         static isConnected: {
             addEventListener: (eventName: string, handler: (isConnected: boolean) => void) => void;
             removeEventListener: (eventName: string, handler: (isConnected: boolean) => void) => void;
             fetch: () => Promise<boolean>;
         }
         static fetch(): Promise<string>;
     }

     class PixelRatio {
         static get(): number;
     }

     class Easing {
         static bezier(x1: number, y1: number, x2: number, y2: number): ((input: number) => number);
         static linear(): ((input: number) => number);
     }

     interface AnimationConfig {
        isInteraction?: boolean;
        useNativeDriver?: boolean;
     }

     interface AnimatedTimingConfig extends AnimationConfig {
        toValue: number;
        duration?: number;
        delay?: number
        easing?: (input: number) => number;
    }

    interface CompositeAnimation {
        start(callback?: AnimatedEndCallback): void;
        stop: () => void;
    }

    type AnimatedEndResult = { finished: boolean };
    type AnimatedEndCallback = (result: AnimatedEndResult) => void;

     module Animated {
         function createAnimatedComponent(Component: any, notCollapsable?: boolean): any;
         function delay(time: number): CompositeAnimation;
         function timing(value: Animated.Value, config: AnimatedTimingConfig): CompositeAnimation;
         function parallel(animations: CompositeAnimation[]): CompositeAnimation
         function sequence(animations: CompositeAnimation[]): CompositeAnimation
         class Value {
            constructor(val: number);
            setValue(value: number): void;
            addListener(callback: any): string;
            removeListener(id: string): void;
            removeAllListeners(): void;
            interpolate(config: any): Value;
         }
         class View extends ReactNativeBaseComponent<ViewProps, {}> { }
         class Image extends ReactNativeBaseComponent<ImageProps, {}> { }
         class Text extends ReactNativeBaseComponent<TextProps, {}> { }
     }

     interface IUpdateLayoutAnimationConfig {
        duration?: number;
        delay?: number;

        springDamping?: number;
        initialVelocity?: number;

        type?: string;
    }

    interface ICreateLayoutAnimationConfig extends IUpdateLayoutAnimationConfig {
        property?: string;
    }

     interface ILayoutAnimationConfig {
         duration: number;
         create?: ICreateLayoutAnimationConfig;
         update?: IUpdateLayoutAnimationConfig;
     }

     module LayoutAnimation {
         function configureNext(config: ILayoutAnimationConfig): void;

         module Types {
            var spring: string;
            var linear: string;
            var easeInEaseOut: string;
            var easeIn: string;
            var easeOut: string;
            var keyboard: string;
         }

         module Properties {
            var opacity: string;
            var scaleXY: string;
         }
     }

    module NavigationExperimental {
        type NavigationAnimatedValue = Animated.Value;

        // Value  & Structs.
        type NavigationGestureDirection = 'horizontal' | 'vertical' | 'fade';

        interface NavigationRoute {
            key: string;
            title?: string;
        }

        interface NavigationState {
            index: number;
            routes: NavigationRoute[];
        }

        type NavigationLayout = {
            height: NavigationAnimatedValue,
            initHeight: number,
            initWidth: number,
            isMeasured: boolean,
            width: NavigationAnimatedValue,
        };

        type NavigationScene = {
            index: number,
            isActive: boolean,
            isStale: boolean,
            key: string,
            route: NavigationRoute,
        };

        type NavigationTransitionProps = {
            // The layout of the transitioner of the scenes.
            layout: NavigationLayout,

            // The navigation state of the transitioner.
            navigationState: NavigationState,

            // The progressive index of the transitioner's navigation state.
            position: NavigationAnimatedValue,

            // The value that represents the progress of the transition when navigation
            // state changes from one to another. Its numberic value will range from 0
            // to 1.
            //  progress.__getAnimatedValue() < 1 : transtion is happening.
            //  progress.__getAnimatedValue() == 1 : transtion completes.
            progress: NavigationAnimatedValue,

            // All the scenes of the transitioner.
            scenes: NavigationScene[],

            // The active scene, corresponding to the route at
            // `navigationState.routes[navigationState.index]`.
            scene: NavigationScene,

            // The gesture distance for `horizontal` and `vertical` transitions
            gestureResponseDistance?: number|null,
        };

        type NavigationSceneRendererProps = NavigationTransitionProps;

        type NavigationPanPanHandlers = {
            onMoveShouldSetResponder: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onMoveShouldSetResponderCapture: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onResponderEnd: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onResponderGrant: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onResponderMove: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onResponderReject: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onResponderRelease: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onResponderStart: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onResponderTerminate: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onResponderTerminationRequest: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void | boolean,
            onStartShouldSetResponder: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void,
            onStartShouldSetResponderCapture: (e: ResponderSyntheticEvent, gestureState: PanResponderGestureState) => void,
        };

        type NavigationTransitionSpec = {
            duration?: number,
            // An easing function from `Easing`.
            easing?: (input: number) => number,
            // A timing function such as `Animated.timing`.
            timing?: (value: NavigationAnimatedValue, config: any) => any,
        };

        type SceneDimensions = {
            height: number,
            width: number,
        };

        type NavigationTransitionStyleConfig = {
            // By default input range is defined as [index - 1, index, index + 1];
            // Input and output ranges must contain the same number of elements
            inputRange?: number[];
            opacityOutput: number | number[];
            scaleOutput: number | number[];
            translateXOutput: number | number[];
            translateYOutput: number | number[];
        }

        type NavigationCustomTransitionConfig = {
            // Optional transition styles
            transitionStyle?: (sceneIndex: number, sceneDimensions: SceneDimensions) => NavigationTransitionStyleConfig;
            // Optional overrides for duration, easing, and timing
            transitionSpec?: NavigationTransitionSpec;
            // Optionally present the associated below the previous scene
            presentBelowPrevious?: boolean;
        }

        // Functions.
        type NavigationAnimationSetter = (
            position: NavigationAnimatedValue,
            newState: NavigationState,
            lastState: NavigationState
        ) => void;

        type NavigationSceneRenderer = (
            props: NavigationSceneRendererProps
        ) => ReactElement<any>;

        type NavigationStyleInterpolator = (
            props: NavigationSceneRendererProps
        ) => Object;

        module StateUtils {

            /**
             * Searches for state with given key inside of given ParentNavigationState
             * returns null in case nothing found or getParent(state) == null
             */
            function get(state: NavigationState, key: string): NavigationRoute|undefined|null;

            /**
             * returns index of the state with key in given ParentNavigationState
             * returns null if key not found of getParent(state) == null
             */
            function indexOf(state: NavigationState, key: string): number;

            /**
             * Returns `true` at which a given route's key can be found in the
             * routes of the navigation state.
             */
            function has(state: NavigationState, key: string): boolean;

            /**
             * Pushes newChildState into parent state
             */
            function push(state: NavigationState, newChildState: NavigationRoute): NavigationState;

            /**
             * pops out latest state in the existing Parent
             */
            function pop(state: NavigationState): NavigationState;

            /**
             * If this function gets the same index as currently set it returns the same state
             * in other case it would clone previous state and updates the index
             *
             * it looks like it designed to get NavigationParentState only as otherwise it just will return corrupted object without
             * key attribute or even crash depending on how ... operator would work with null value
             */
            function jumpToIndex(state: NavigationState, index: number): NavigationState;

            /**
             * Same as the previous function but search index by the key first
             *
             * would crash if given key is not found
             */
            function jumpTo(state: NavigationState, key: string): NavigationState;

            /**
             * Sets the focused route to the previous route.
             */
            function back(state: NavigationState): NavigationState;

            /**
             * Sets the focused route to the next route.
             */
            function forward(state: NavigationState): NavigationState;

            /**
             * This function wouldn't modify your state unless it's NavigationParentState
             * if this is a parent state it would clone the children array
             * and will try to relplace item in this array by the newState
             *
             * if there is no item with such key it would crash
             */
            function replaceAt(state: NavigationState, key: string, newState: NavigationState): NavigationState;

            /**
             * the same as the previous function but it replaces item directly by the index
             */
            function replaceAtIndex(state: NavigationState, index: number, route: NavigationRoute): NavigationState;

            /**
             * if nextChildren is null parentState.children would be used
             * if nextIndex is null, parent nextIndex would be used
             */
            function reset(state: NavigationState, nextChildren?: NavigationRoute[], index?: number): NavigationState;
        }

        type NavigationTransitionerProps = {
            configureTransition: (
                a: NavigationTransitionProps,
                b?: NavigationTransitionProps
            ) => NavigationTransitionSpec,
            navigationState: NavigationState,
            onTransitionEnd: () => void,
            onTransitionStart: (transitionProps: NavigationTransitionProps, prevTransitionProps?: NavigationTransitionProps) => void,
            render: (transitionProps: NavigationTransitionProps, prevTransitionProps?: NavigationTransitionProps) => ReactElement<any>,
            style: any,
        };

        type NavigationTransitionerState = {
            layout: NavigationLayout,
            position: NavigationAnimatedValue,
            progress: NavigationAnimatedValue,
            scenes: NavigationScene[],
        };

        class NavigationTransitioner extends React.Component<NavigationTransitionerProps, NavigationTransitionerState> {
        }

        type SceneViewProps =  {
            sceneRenderer: NavigationSceneRenderer,
            sceneRendererProps: NavigationSceneRendererProps,
        };

        class SceneView extends React.Component<SceneViewProps, any> {
        }

        type NavigationCardProps = NavigationSceneRendererProps & {
            onComponentRef: (ref: any) => void,
            onNavigateBack?: (action: any) => void,
            panHandlers?: NavigationPanPanHandlers,
            pointerEvents: string,
            renderScene: NavigationSceneRenderer,
            style: any,
        };

        class Card extends React.Component<NavigationCardProps, any> {

        }

        type NavigationCardStackProps = {
            direction: NavigationGestureDirection,
            customTransitionConfig?: NavigationCustomTransitionConfig,
            navigationState: NavigationState,
            onNavigateBack?: (action: any) => void,
            onTransitionStart?: (transitionProps: NavigationTransitionProps, prevTransitionProps?: NavigationTransitionProps) => void,
            onTransitionEnd?: () => void,
            renderHeader?: NavigationSceneRenderer,
            renderScene: NavigationSceneRenderer,
            cardStyle?: any,
            hideShadow?: boolean,
            style?: any,
            gestureResponseDistance?: number|null,
            enableGestures? : boolean
        };

        class CardStack extends React.Component<NavigationCardStackProps, void> {

        }

        type NavigationHeaderProps = NavigationSceneRendererProps & {
            onNavigateBack?: (action: any) => void,
            renderLeftComponent: NavigationSceneRenderer,
            renderRightComponent: NavigationSceneRenderer,
            renderTitleComponent: NavigationSceneRenderer,
            style?: any,
            viewProps?: any,
            statusBarHeight: number | Animated.Value,
        };

        class NavigationHeader extends React.Component<NavigationHeaderProps, any> {

        }
    }

    class DeviceEventSubscription {
        remove(): void;
    }

    class NativeAppEventEmitter {
        static addListener(eventId: string, callback: Function): DeviceEventSubscription;
    }

    module DeviceEventEmitter{
        function addListener(name: string, callback: Function): void;
    }

    module AppState {
        var currentState: string;
        function addEventListener(type: string, handler: Function): void;
        function removeEventListener(type: string, handler: Function): void;
    }

    module AppStateIOS {
        var currentState: string;
        function addEventListener(type: string, handler: Function): void;
        function removeEventListener(type: string, handler: Function): void;
    }

     module Touchable {
        type RectOffset = {
            top: number,
            left: number,
            right: number,
            bottom: number
        }

        interface State {
            touchable: any
        }

        interface TouchableMixin extends React.Mixin<any, any> {
            touchableGetInitialState: () => State
            touchableHandleStartShouldSetResponder: () => {}
            touchableHandleResponderTerminationRequest: () => {}
            touchableHandleResponderGrant: (e: React.SyntheticEvent, dispatchID: string) => {}
            touchableHandleResponderMove: (e: React.SyntheticEvent) => {}
            touchableHandleResponderRelease: (e: React.SyntheticEvent) => {}
            touchableHandleResponderTerminate: (e: React.SyntheticEvent) => {}
            touchableHandleActivePressIn?: (e: React.SyntheticEvent) => {}
            touchableHandleActivePressOut?: (e: React.SyntheticEvent) => {}
            touchableHandlePress?: (e: React.SyntheticEvent) => {}
            touchableHandleLongPress?: (e: React.SyntheticEvent) => {}
            touchableGetHighlightDelayMS?: () => number
            touchableGetPressRectOffset?: () => RectOffset
        }

        var Mixin: TouchableMixin;
    }

    class EmitterSubscription {
        remove(): void;
    }

    module Keyboard {
        function addListener(eventType: string, listener: Function, context?: any): EmitterSubscription;
        function removeAllListeners(eventType: string): void;
        function removeSubscription(subscription: EmitterSubscription): void;
    }

     interface IncrementalProps extends ComponentPropsStyleBase {
         onDone?: () => void;
         name: string;
         children?: any;
     }

     interface IncrementalPresenterProps extends ComponentPropsStyleBase {
         name: string;
         disabled?: boolean;
         onDone?: () => void;
         onLayout?: (event: Object) => void;
         style?: any;
         children?: any;
     }

     class Incremental extends ReactNativeBaseComponent<IncrementalProps, {}> {
     }

     class IncrementalGroup extends ReactNativeBaseComponent<IncrementalProps, {}>{
     }

     class IncrementalPresenter extends ReactNativeBaseComponent<IncrementalPresenterProps, {}> {
     }

     module JSEventLoopWatchdog {
         function install(obj: any): void;
     }

     module InteractionManager {
         function setDeadline(deadline: number): void;
     }

    interface I18nManager {
        isRTL: boolean
        allowRTL: (allowRTL: boolean) => {}
        forceRTL: (forceRTL: boolean) => {}
    }

    export var I18nManager: I18nManager;
}

interface GeoConfiguration {
    skipPermissionRequests: boolean;
}

interface Geolocation {
    // React Native addition to navigator.geolocation
    setRNConfiguration(config: GeoConfiguration): void;
}

