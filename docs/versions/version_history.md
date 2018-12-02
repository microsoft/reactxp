---
id: version_history
title: Version History
layout: hero
sectionid: versions
permalink: versions/version_history.html
redirect_from:
  - "versions/index.html"
---

## ReactXP Versioning

### Versioning Strategy
A new version of ReactXP will be released a monthly basis (approximately), following the same general update timeline of React Native. Each new version will get its own branch, allowing consumers of the library to take a dependency on a stable code base.


### Version History

#### Version 1.5.0 of reactxp-imagesvg, reactxp-navigation, reactxp-video, reactxp-virtuallistview - _1 Dec 2018_
* No new features; updated dependencies.

#### Version 1.5.0 of reactxp - _1 Dec 2018_
* #935: Maded ReactXP compatible with React.Fragment.
* #933: Reset VoiceOver queue when app goes inactive or in background (iOS and Windows).
* #939: Added keyboard event mapping for kePress handling in View (Windows and MacOS).
* #941: Updated RX.Animated.InterpolatedValue to allow for chaining interpolations.
* #942: Added key mappings for MacOS and wired onKeyPress for RX.View.
* #943: Added focus and blur calls for RX.Button, RX.Link, RX.Text and RX.View.
* #946: Fixed crashing bug in accessibility for iOS and MacOS.
* #949: Added onFocus, onBlur and onKeyPress support for GestureView.
* #948: Respect negative tabIndex in Button on MacOS.
* #953: Wired up tabIndex prop for web implementation of RX.TextInput.

#### Version 1.5.0-rc.4 of reactxp - _18 Nov 2018_
* #909: Eliminated not-prebound callbacks in view resize detector on web (perf improvement).
* #912: Fixed VoiceOver iOS 12 issue.
* #913 and #923: Added key codes that are specific for MacOS.
* #916: Added basic tabindex handling on views for MacOS.
* #920: Removed deep comparison on every button prop change (perf improvement).
* #917: Added onKeyDown support for MacOS ScrollView.
* #922: Removed undocumented and broken (onRN) API: addToScrolLeft and addToScrollTop on RX.ScrollView.
* #928: Fixed bug in _buildInternalProps of View relating to tabIndex.
* #927: Fixed drag support on MacOS.
* Added CONTRIBUTION guide.

#### Version 1.5.0-rc.1 of reactxp-virtuallistview - _11 Nov 2018_
* #899: Fix web accessibility
* #902: Mac accessibility improvements (keyboard focus).

#### Version 1.5.0-rc.3 of reactxp - _11 Nov 2018_
* #898: Ensure taht onKeyDown/Focus/Blur events are sent from ScrollView.
* #895: On Windows, make FocusManager track View instances with negative tabIndex.
* #901: Optimization on native platforms: when there are no accessibilityTraits, don't create an additional unneeded array.
* #902: Mac accessibility improvements (keyboard focus).

#### Version 1.5.0-rc.2 of reactxp - _28 Oct 2018_
* Fixed regression introduced recently in web version of ScrollView.

#### Version 1.5.0-rc.1 of reactxp - _27 Oct 2018_
New functionality:
* #848: Added support for RTL (right-to-left) change event on native platforms.
* #843: Added new AlertOption preventDismissOnPress.
* #847: Added support for Animated.Event, which allows animations to be associated with scroll events.
* #868: Added support for placeholder text color on web platform.
Bug fixes:
* #833: Eliminated rerender of app when mousing over popups.
* #846: Disabled mouse gestures in main view when a modal dialog is overlaying the main view.
* #854: Removed draggable="false" in web implementation of View, since this is the default value.
* #853: Emulate cache-control: max stale on iOS.
* #869: Eliminate excess focus calls.
* #877 and #875: Fixed crashes relating to popups due to race condition in unmounting.
* #873: Fixed scroll view focus issue on MacOS.
* Fixed several "hanging promises" that didn't properly deal with error conditions.

#### Version 1.4.0 of reactxp - _30 Sep 2018_
* Added the ability to programmatically retrieve the text selection for RX.Text (if selectable attribute is true). Includes test cases in RXPTest sample.
* Added drag and drop capabilities to RX.View (including onDragStart, onDrag, onDragEnd props). Includes test cases in RXPTest sample.

#### Version 1.4.0-rc.1 of reactxp-navigation - _21 Sep 2018_
* Changed renderScene to accept a return value of null rather than undefined, making it consistent with other render functions.

#### Version 1.4.0-rc.2 of reactxp - _15 Sep 2018_
* Fixed bug #800: If there are only cached popups and no visible one the main remains inaccessible for screen readers.
* Fixed bug #815: Show warning in console if disallowed style combinations appear.

#### Version 1.4.0-rc.1 of reactxp - _9 Sep 2018_
* Worked around change in recent versions of RN that removed support for Images with children.
* Changed announceForAccessibility implementation to use Assertive live region type instead of Polite.
* In web implementation of RX.Image, always show the img tag if XHR request option is used.
* Fixed bug #744: On web implementation, styling behavior differed between developmenta nd production.
* Added support for the new React.RefObject variant of ref prop.
* Added support for multi-window apps to RX.Alert.
* Added support for onLongPress to RX.GestureView.
* Fixed bug #793: In web implementation, cursor type was overridden in some cases.
* Added useWebKit prop for native RN.WebView in prep for NR 0.57 on iOS.
* Fixed bug that caused testID not to be set properly for RX.View instances.

#### Version 1.3.2 of reactxp-imagesvg - _25 Aug 2018_
* Added support for SvgRect children within SvgImage.

#### Version 1.3.1 of reactxp-imagesvg - _7 Aug 2018_
* Fixed bug in native implementation that caused runtime warning every time SvgPath was used.

#### Version 1.3.2 of reactxp - _2 Aug 2018_
* Fixed bug #745: WebView.onMessage receives additional props which are not defined in Types.WebViewMessageEvent.
* Fixed bug #746 relating to cursor overrides for buttons on the web implementation.
* Fixed bug #749: Set size attribute of input HTML element to 1.
* Fixed bug #753: isRightMouseButton implementation that works also on Mac.
* Fixed bug #752: Accessibility fix for Clipboard.
* Fixed bug #756: Prevent a crash during onLayout handling on web.
* Fixed bug #761: Update usages of findDOMNode to indicate that it returns null.
* Fixed bug #767: buttonStyles may be undefined; fixed inconsistency in onAccessibilityTapIOS definition for Button and View.
* Fixed regression in Timers.ts. Some environments don't define "global" and use "window" instead for the built-in timer functions.
* Use semver for reactxp dependencies.
* Feature #764: Add support for Android WebView compatibility modes.

#### Version 1.3.1 of reactxp-virtuallistview - _2 Aug 2018_
* Added support for testId prop.

#### Version 1.3.2 of reactxp - _7 Jul 2018_
* Updated custom tslint rule groupedImportRule to treat imports starting with '@' as relative rather than ambient.
* Made 'auto' a valid resizeMode for images in web implementation.
* Added support for 'title' prop on RX.TextInput.

#### Version 1.3.0 of reactxp-imagesvg, reactxp-navigation, reactxp-video, reactxp-virtuallistview - _28 Jun 2018_
* No new features; updated dependencies.

#### Version 1.3.0 of reactxp - _28 Jun 2018_
* Added support for function keys in native desktop implmenetations.
* Fixed recent regression that caused a crash when using the web implementation in a non-browser environment like node.
* Reverted change in behavior on web implementation of ActivityState.Inactive. This state is no longer used on the web, as before 1.3.0-rc.4.

#### Version 1.3.0-rc.6 of reactxp - _25 Jun 2018_
* Added support for testId prop to all reactxp components. On native, it uses testID. On web, it adds a data-test-id attribute to the node.
* Added three new tslint custom rules that are useful for reactxp projects.

#### Version 1.3.0-rc.5 of reactxp - _24 Jun 2018_
* Added missing definition for getMetadata method in RX.Image.
* Implemented RX.International methods for web platform.

#### Version 1.3.0-rc.4 of reactxp - _19 Jun 2018_
* Enabled context menu on keyboard input in Windows UWP implementation.
* On web implementation, augmented AppActivityState. Inactive state now indicates that main window is not in focus.
* On web implementation, eliminated dependency on ifvisible library, shrinking the footprint of reactxp.

#### Version 1.3.0-rc.3 of reactxp - _16 Jun 2018_
* [Breaking Change] Removed hideDeleteButton prop in RX.TextInput in favor of clearButtonMode prop, which applies to iOS and Windows UWP.

#### Version 1.3.0-rc.2 of reactxp - _14 Jun 2018_
* [Breaking Change] Renamed several methods in RX.Animated.ValueListener that were meant to be private.
* Improved screen reader support in Windows UWP implementation.
* On iOS implementation, automatically set decelerationRate to "fast" if snapToInterval is set.
* Added hideDeleteButton prop to RX.TextInput for Windows UWP.

#### Version 1.3.0-rc.1 of reactxp - _13 Jun 2018_
* Fixed accessibility issues with screen reader in Windows UWP implementation.
* Removed shouldRasterizeIOS prop on RX.Image. It was never supported in RN, so it was just a no-op.
* Fixed bug in RX.Network.getType() which returned the wrong response if the device was connected to ethernet on Android.

#### Version 1.3.0-rc.0 of reactxp - _10 Jun 2018_
* Fixed a few bugs in keyboard focus handling for Windows UWP.
* Web implementation of RX.Image now uses credentials for image fetches if origin header is specified.
* Added support for text shadows in RX.Text (shadowColor, shadowOffset, shadowRadius style attributes).
* Fixed keyboard navigation logic for multi-root-view case.
* Wired up tooltips in web implementation of RX.Button, RX.Image, RX.Link, and RX.View (title prop).
* Extended RX.UserInterface.measureWindow to support multi-root-view case. It now takes an optional rootViewId parameter.
* Added drag and drop handler support for Mac OS.
* Added new static API RX.Image.getMetadata that returns dimensions of an image.
* Avoided the use of the deprecated RN.NetInfo "change" event in favor of "connectionChange" so RN doesn't emit warning.
* Added back parameter to onBlur event handler that was incorrectly removed in version 1.2.x.

#### Version 1.2.1 of reactxp - _24 May 2018_
* Wired up onPaste handler for Windows implementation.
* Fixed bug that resulted in cached popups to appear when they shouldn't.
* Fixed bug in web implementation of RX.ScrollView that resulted in incorrect screen reader announcements.

#### Version 1.2.0 of reactxp-imagesvg, reactxp-navigation, reactxp-video, reactxp-virtuallistview - _22 May 2018_
* Automatically suppressed system context menu for selectable RX.Text items on Windows if containing view has onContextMenu handler.

#### Version 1.2.0 of reactxp - _22 May 2018_
* Automatically suppressed system context menu for selectable RX.Text items on Windows if containing view has onContextMenu handler.

#### Version 1.1.2-rc.3 of reactxp - _21 May 2018_
* Fixed bug in RX.Linking.getInitialUrl, which was returning null rather than undefined for the url in some cases.
* Added support for Dilaog trait to trigger yes-dont-hide importantForAccessibility behavior in Windows implementation.
* Fixed UWP accessibility announce to make it act the same way as Android.
* Create correct Animated.TextInput for Windows.

#### Version 1.1.2-rc.2 of reactxp - _15 May 2018_
* Improved keyboard focus support. Added focus, blur and requestFocus methods to several existing components. Added new focusArbitrator prop to RX.View, which allows callback to arbitrate between multiple children that are requesting autofocus.
* Fixed bug that caused group view children to be invisible to UI automation.
* Improved keyboard support for Windows implementation.

#### Version 1.1.2-rc.1 of reactxp - _9 May 2018_
* Fixed bug in Windows implementation that prevented RX.Input.keyDownEvent from being dispatched.
* Fixed bugs in Windows implementation that reported wrong key codes for keyboard events.
* Fixed focus management for cacheable popups in Windows implementation.
* Fixed type definitions of GestureView, ScrollView and WebView. They were incorrectly extending ViewBase, which pulled in a number of unsupported props.
* Fixed bug that caused cached popups to appear on screen when not appropriate.
* Added onContextMenu prop to GestureView.
* Added accessibility trait for ListItem.
* In Windows implementation, use RNW.Hyperlink for rendering RX.Link.
* Removed "justifyEnd" prop from RX.ScrollView. It was never implemented as documented.
* Added useSafeInsets prop onR X.View to support rendering within safe area on iOS.
* Fixed bug RX.StatusBar.setBarStyle where animated parameter was not properly passed to RN.
* Added onContextMenu to RX.Link.

#### Version 1.1.1 of reactxp - _13 Apr 2018_
* Fixed reentrancy issue in popup support. Displaying a popup from within the onDismiss callback was recently broken.
* Added disabledOpacity prop for RX.Button component.
* Improved handling of RX.Clipboard.setText on web. It now properly handles carriage returns.
* Fixed TextInput focusability after focus restriction on Windows.
* Fixed accessibility issue related to voice over on web.

#### Version 1.0.18 of reactxp-navigation - _10 Apr 2018_
* Fixed bug in web implementation that caused a problem when popping multiple items from the navigation stack.

#### Version 0.2.10 of reactxp-imagesvg, 1.0.17 of reactxp-navigation, 0.2.5 of reactxp-video, 0.1.9 of reactxp-virtuallistview - _4 Apr 2018_
* Rebuilt using reactxp 1.1.0.

#### Version 1.1.0 of reactxp - _4 Apr 2018_
* Added workaround to enable the keyboard navigation mode when the screen reader is used.

#### Version 1.1.0-rc.2 of reactxp - _28 Mar 2018_
* Fixed bug in web implementation of animation where completion callback was called multiple times in some cases.

#### Version 1.1.0-rc.1 of reactxp - _26 Mar 2018_
* Added support for "cacheable" popups. This is useful for popups that involve many views and are costly to recreate from scratch.
* Fixed keyboard handler in RX.Link, it was defferring to base class only when onPress was defined, and that was wrong.
* Fixed bug in native implementation of TextInput where selection was sometimes lost.
* Fixed TextInput reference for focus control on windows.
* Implemented hidden scroll indicators in web/ScrollView.

#### Version 1.0.2 of reactxp - _16 Mar 2018_
* Fixed bug in web TextInput implementation that resulted in a console warning with the latest versions of ReactJS.
* Fixed bug in native Button implementation that resulted in corrupted styles.
* Fixed accessibility (screen reader) bug in web implementation.

#### Version 1.0.1 of reactxp - _5 Mar 2018_
* Moved event handlers from ViewProps to ViewPropsShared so AnimatedView has them too.
* Fixed recent regression in handling of popups in native implementation.
* Events passed to onPress and onLongPress now include touch or mouse coordinates.

#### Version 0.2.9 of reactxp-imagesvg, 1.0.16 of reactxp-navigation, 0.2.4 of reactxp-video,  0.1.8 of reactxp-virtuallistview - _2 Mar 2018_
* Rebuilt using reactxp 1.0.0 and latest typescript compiler version.

#### Version 1.0.0 of reactxp - _2 Mar 2018_
* Filled in fields for MouseEvent on web.
* Fixed a few style leaks in web implementation.

#### Version 1.0.0-rc.1 of reactxp - _28 Feb 2018_
* Improved accessibility handling for Button.
* Added select<T>() method to RX.Platform namespace to make it easier to implement platform-specific behavior.
* Improved accessibility performance.
* Improved performance by avoiding triggering synchronous layout on web.
* Fixed behavior of onContextMenu.
* Removed unused "type" field from RX.CommonProps interface.
* Updated typescript compiler to 2.7.2 and enabled strictPropertyInitialization.
* Added ability to set limitFocusWithin without automatically setting aria-hidden=true on web.
* Implemented RX.Linking APIs for Windows UWP platform.
* Removed "currentTarget" from SyntheticEvent.
* Added coordinates/modifiers/button information to MouseEvent definition.

#### Version 1.0.0-alpha.2 of reactxp - _21 Feb 2018_
* Switched to new versioning scheme that's independent of RN.
* Updated default RN dependency from 0.51.x to 0.53.x, although backward compatibility is maintained.
* Added support for numeric keyboards in mobile browsers.
* Fixed announceForAccessibility API for Mac.
* Added MacOS implementation of Button and Animated.
* Added valuenow attribute for slider role support.
* Fixed bug in web implementation of Animated where it wasn't properly managing listener subscriptions when animated styles were added to (or removed from) an animated component.
* Fix random Android crashes when Talkback is enabled.
* Fixed bug in web animation that caused certain CSS properties not to animate correctly because transition was specifying the attribute using camel case rather than CSS (hyphenated) case. This affected attributes like "backgroundColor".
* Removed parameter from onBlur event.
* Fixed bug in RX.TextInput that affected Windows version: Pass selection in render only after explicitly set.
* Added right-click support for Windows platform.
* Added more accessibility support for Windows platform.
* Use white-space:pre for the aria-live region.

#### Version 0.51.1 of reactxp - _19 Jan 2018_
* Fixed regression in native implementation of Animated.View's blur() method.

#### Version 0.2.3 of reactxp-video, 1.0.15 of reactxp-navigator, 0.2.8 of reactxp-imagesvg, 0.1.7 of reactxp-virtuallistview - _18 Jan 2018_
* Updated for RN 0.51 compatibility.

#### Version 0.51.0 of reactxp - _18 Jan 2018_
* Fixed focusable View condition for VoiceOver in web implementation.
* Exposed web-specific ariaRoleDescription prop to work around other VoiceOver issues.
* Updated RN for Windows UWP dependency.
* Fixed recent regression that broke focus and blur calls in iOS and Android implementations of AnimatedTextInput.

#### Version 0.51.0-alpha.9 of reactxp - _17 Jan 2018_
* Removed console error related to animations of values not currently associated with any mounted component. It was too noisy.

#### Version 0.51.0-alpha.8 of reactxp - _16 Jan 2018_
* Fixed bug in Windows UWP implementation related to selection ranges in TextInput.
* Fixed screen reader issue in Mac implementation.
* Removed ```textAlign``` prop from TextInput. It was extraneous, since it's already supported as a style attribute.
* Updated Windows UWP dependency to use the latest version of RN for UWP.
* Worked around issue with screen readers on Chrome browsers.
* Added currentTarget field back to SyntheticEvent.
* Added support for "switch" aria type (web implementation).
* Fixed recent regression in web animation code.

#### Version 0.51.0-alpha.5 of reactxp - _11 Jan 2018_
* Eliminated limitation within RX.Button where only one child element was allowed.
* Fixed regression where native implementation of RX.View with onPress handler didn't provide touch feedback.

#### Version 0.51.0-alpha.4 of reactxp - _10 Jan 2018_
* Added code to native implementation of RX.Network so it works with versions of RN before and after 0.48.x.
* Fixed regression in web implementation of RX.TextInput.
* Fixed bug that caused incorrect behavior of RX.Modal on native platforms.

#### Version 0.51.0-alpha.2 of reactxp - _9 Jan 2018_
* Fixed bug in native implementation of RX.ActivityIndicator. It wasn't properly handling the delay prop.
* Added support in web implementation of RX.TextInput for custom keyboard types on mobile web browsers.
* Added focus and keyboard navigation support for native UWP platform.
* Added support for injection of HTML content into RX.WebView.
* Added support for postMessage and onMessage handler in RX.WebView for bidirectional communication.

#### Version 0.51.0-alpha.1 of reactxp - _6 Jan 2018_
* Fixed break in device dimension change event due to change in RN.
* Removed use of RX.Button implementation within RX.View for native-common implementation.
* Fixed bug in web implementation of RX.Clipboard.getText. It shouldn't throw.
* Fixed timing bug in web implementation of GestureView.
* Fixed popup positioning for right-to-left languages in native-common implementation.
* Fixed bug in web implementation of TextInput that caused assertion in React.
* Breaking change: Removed 'cursor' prop from RX.Button. It was redundant with the 'cursor' style.
* New feature: RX.Input.key[Up|Down]Event now allow event subscribers to cancel the event.
* New feature: Changed RX.Modal.isDisplayed to accept undefined parameter, in which case it determines whether _any_ modal is displayed.
* New feature: Added RX.Popup.isDisplayed method.
* Reimplemented web implementation of animation APIs. Removed many limitations of previous implementation and fixed several bugs. Documented remaining limitations.
* Fixed bug in web implementation of RX.TextInput that resulted in assertions within React.
* Fixed bug in web implementation of RX.Picker. It wasn't correctly combining styles.
* Added support in web implementation of RX.TextInput for keyboard type (applicable on mobile web browsers).
* Removed use of deprecated RX.NetInfo.fetch method.

#### Version 0.46.6 of reactxp - _13 Dec 2017_
* Fixed potential crash in web implementation of RX.ScrollView.
* Fixed bug in UWP implementation of RX.Popup, allowing background to be clickable.
* In web implementation of RX.ScrollView, added support for clicking on scroll bar to adjust position of thumb.
* Added dev warning when using nested RX.Button items.
* Fixed a potential crash in web implementation of RX.GestureView.
* Implemented drag-and-drop support in UWP implementation of RX.View.

#### Version 0.46.5 of reactxp - _31 Oct 2017_
* Added Android "mode" prop to Picker.
* Added type definitions for RX.Stateless and RX.ComponentBase.
* Updated to React 16.0.0 and React-Dom 16.0.0.
* Added RX.UserInterface.registerRootView API to allow registration of secondary views. Also added rootViewId option to RX.Modal and RX.Popup so they can be displayed on secondary views.
* Fixed bug in focus restoration on web implementation.
* Replaced use of deprecated BackAndroid with BackHandler, avoiding deprecation warnings.
* Fixed bug in RX.Button RN implementation where opacity was not property restored after changing disabled prop.

#### Version 0.46.3 of reactxp - _7 Oct 2017_
* Added missing focus() method to RX.Animated.View interface.
* Exported RX.AnimatedImage, RX.AnimatedText, RX.AnimatedTextInput, and RX.AnimatedView.
* Added accessibilityLiveRegion prop to ViewProps for Android and web.
* Exported explicit types for ShadowOffset, ScrollIndicatorInsets.
* Fixed crash in web RootView when clicking on a popup anchor.
* Fixed race condition in hover of Button on web.

#### Version 0.2.2 of reactxp-video, 1.0.13 of reactxp-navigator, 0.2.7 of reactxp-imagesvg, 0.1.6 of reactxp-virtuallistview - _21 Sep 2017_
* Updated for RN 0.46 compatibility.
* Removed custom react.d.ts and react-dom.d.ts files in favor of public versions.

#### Version 0.46.2 of reactxp - _21 Sep 2017_
* Added onContextMenu support on web for Text components.
* Exposed attributes to make menus and listboxes accessible on web.
* Added new RX.Animated.createValue and RX.Animated.interpolate methods. The old way of instantiating a value and creating an interpolation will be deprecated going forward.
* Made a breaking change to Alert.show interface - combined optional parameters into an AlertOptions interface. This will allow for better extensibility in the future.
* Updated RN dependency to 0.46.
* Removed custom react.d.ts and react-dom.d.ts files in favor of public versions.

#### Version 0.46.0_rc.2 of reactxp - _19 Sep 2017_
* Changed RX.Link props to make url mandatory.
* Added new Alert implementation for web. It now presents a modal-based themable dialog box.
* Fixed bug in ScrollView styles from previous release.
* Exposed aria-checked property on button type for web.
* Added key attribute to KeyboardEvent.
* Fixed bug in web code where onScrollBeginDrag and onScrollEndDrag were called unconditionally even if they were undefined.
* Enabled strict null checks in TS compiler and fixed a number of bugs that were exposed.

#### Version 0.46.0_rc.1 of reactxp - _5 Sep 2017_
* First pre-release version of 0.46.
* Removed Navigator component and moved to an extension.
* Fixed style definition for ScrollView so it doesn't include child-related flexbox styles, which aren't supported.

#### Version 0.42.0 of reactxp - _5 Sep 2017_
* Removed rc from version.

#### Version 0.42.0_rc.25 of reactxp - _18 Aug 2017_
* On web, if there's a queued onScroll event when the scroll position is manually set, cancel the onScroll.

#### Version 0.42.0_rc.24 of reactxp - _9 Aug 2017_
* Added accessibility support for GestureView.
* Fixed bug in web version that prevented animated fontSize from working.

#### Version 0.42.0_rc.22 of reactxp - _30 July 2017_
* On RN platforms, initialProps is now passed to the main view.
* Added new PopupOptions field preventDismissOnPress that prevents the popup from being dismissed implicitly when the user clicks or taps outside of the popup or the anchor.
* Fixed bug in web implementation of TextInput where border styling was not honored.
* Fixed bug on Android that allowed presses to background of Modal to go through.

#### Version 0.42.0_rc.20 of reactxp - _15 July 2017_
* Updated to TypeScript 2.4, which caught several bugs in the ReactXP code.
* Made Styles.combine much more flexible - it now supports arbitrarily nested arrays of styles.
* Changed Network API namespace for detecting network type so it's consistent with other ReactXP APIs. Added documentation.

#### Version 0.1.6 of reactxp-video - _15 July 2017_
* Updated to TypeScript 2.4 and made changes to work with latest ReactXP core.

#### Version 0.2.4 of reactxp-imagesvg - _15 July 2017_
* Updated to TypeScript 2.4 and made changes to work with latest ReactXP core.

#### Version 0.42.0_rc.18 of reactxp - _13 July 2017_
* Fixed runtime crash when running web implementation in Electron.
* Added a way to provide screen reader focus to TextInput on web.

#### Version 0.42.0_rc.17 of reactxp - _4 July 2017_
* Added ability to set accessibility focus for text input controls.
* Added support for iOS-specific ActivationState for RN extensions.

#### Version 0.42.0_rc.16 of reactxp - _30 June 2017_
* Fixed another bug in handling of default border width on web.
* Added setFocusRestricted and setFocusLimited methods and support for nested keyboard focus on web.
* Added isNavigatingWithKdyboard method and keyboardNavigationEvent.

#### Version 0.42.0_rc.12 of reactxp - _16 June 2017_
* Added support for new limitFocusWidth prop for constraining keyboard focus.
* Fixed bug in handling of mailto URLs on web in the Link component.
* Added support for flexGrow, flexShrink, and flexBasis props.

#### Version 0.42.0_rc.11 of reactxp - _13 June 2017_
* Fixed bugs in web implementation of focus manager.
* Added new API (enableTouchLatencyEvents) and event (touchLatencyEvent) in UserInterface namespace for detecting delays in touch event handling.
* Fixed crash in native implementation of Link component that resulted in uncaught exception for some types of links.
* Fixed flexDirection style default for web implementation in Image component.
* Fixed inconsistency in handling of borders between web and RN when borderStyle is not specified.

#### Version 0.42.0_rc.10 of reactxp - _25 May 2017_
* Added new International API namespace for controlling right-to-left mirroring behavior.

#### Version 0.1.2 of reactxp-virtualistview - _23 May 2017_
* Republished because index files were missing in previous publish.

#### Version 0.42.0_rc.9 of reactxp - _17 May 2017_
* Fixed bug in Navigator that caused crash in hello-world sample.

#### Version 0.42.0_rc.8 of reactxp - _16 May 2017_
* Removed Profiling API namespace and dependency on react-addons-perf.

#### Version 0.1.1 of reactxp-virtualistview - _11 May 2017_
* Republished because "dist" directory was missing in previous publish.

#### Version 0.1.2 of reactxp-video - _11 May 2017_
* Published first version of reactxp-video extension.

#### Version 0.2.0 of reactxp-imagesvg - _10 May 2017_
* Switched from old version of react-native-art-svg to latest version of react-native-svg.

#### Version 0.42.0_rc.5 of reactxp - _10 May 2017_
* Fixed incorrect import path (using wrong case).
* Fixed bug in native View implementation - was using stale props.
* Added importantForLayout prop on View (web specific).
* Fixed bug in native NavigatorExperimentalDelegate - was using wrong props.

#### Version 0.42.0_rc.4 of reactxp - _27 Apr 2017_
* Changed web implementation of Text to prevent copying text to clipboard.
* Eliminated the need to specify box-sizing CSS in external CSS file.
* Fixed accessibility focus bugs.

#### Version 0.42.0_rc.3 of reactxp - _26 Apr 2017_
* Added onLongPress prop for Link.
* Fixed accessibility bug relating to Modal dialogs.

#### Version 0.42.0_rc.2 of reactxp - _18 Apr 2017_
* Added missing box-sizing CSS directives for web.
* Fixed bug in native implementation of View related to accessibility.

#### Version 0.1.0 of reactxp-imagesvg - _26 Apr 2017_
* Published first version of reactxp-imagesvg extension.

#### Version 0.42.0_rc.1 of reactxp - _9 Apr 2017_
* Updated project to use recent versions of React (15.5.3) and React Native (0.42.3).

#### Version 0.34.3 of reactxp - _7 Apr 2017_
* Added new props to ScrollView. Updated package.json to properly reflect peerDependencies on react and react-native.

#### Version 0.34.1 of reactxp - _6 Apr 2017_
* This is the initial public release of the ReactXP core library. It is built against React Native 0.34. We are working on updating it to a newer version of React Native, and this will be released shortly.
