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

#### Version 0.42.0_rc.22 of reactxp
_Released 30 July 2017_

On RN platforms, initialProps is now passed to the main view.
Added new PopupOptions field preventDismissOnPress that prevents the popup from being dismissed implicitly when the user clicks or taps outside of the popup or the anchor.
Fixed bug in web implementation of TextInput where border styling was not honored.
Fixed bug on Android that allowed presses to background of Modal to go through.

#### Version 0.42.0_rc.20 of reactxp
_Released 15 July 2017_

Updated to TypeScript 2.4, which caught several bugs in the ReactXP code.
Made Styles.combine much more flexible - it now supports arbitrarily nested arrays of styles.
Changed Network API namespace for detecting network type so it's consistent with other ReactXP APIs. Added documentation.

#### Version 0.1.6 of reactxp-video
_Released 15 July 2017_

Updated to TypeScript 2.4 and made changes to work with latest ReactXP core.

#### Version 0.2.4 of reactxp-imagesvg
_Released 15 July 2017_

Updated to TypeScript 2.4 and made changes to work with latest ReactXP core.

#### Version 0.42.0_rc.18 of reactxp
_Released 13 July 2017_

Fixed runtime crash when running web implementation in Electron.
Added a way to provide screen reader focus to TextInput on web.

#### Version 0.42.0_rc.17 of reactxp
_Released 4 July 2017_

Added ability to set accessibility focus for text input controls.
Added support for iOS-specific ActivationState for RN extensions.

#### Version 0.42.0_rc.16 of reactxp
_Released 30 June 2017_

Fixed another bug in handling of default border width on web.
Added setFocusRestricted and setFocusLimited methods and support for nested keyboard focus on web.
Added isNavigatingWithKdyboard method and keyboardNavigationEvent.


#### Version 0.42.0_rc.12 of reactxp
_Released 16 June 2017_

Added support for new limitFocusWidth prop for constraining keyboard focus.
Fixed bug in handling of mailto URLs on web in the Link component.
Added support for flexGrow, flexShrink, and flexBasis props.


#### Version 0.42.0_rc.11 of reactxp
_Released 13 June 2017_

Fixed bugs in web implementation of focus manager.
Added new API (enableTouchLatencyEvents) and event (touchLatencyEvent) in UserInterface namespace for detecting delays in touch event handling.
Fixed crash in native implementation of Link component that resulted in uncaught exception for some types of links.
Fixed flexDirection style default for web implementation in Image component.
Fixed inconsistency in handling of borders between web and RN when borderStyle is not specified.


#### Version 0.42.0_rc.10 of reactxp
_Released 25 May 2017_

Added new International API namespace for controlling right-to-left mirroring behavior.


#### Version 0.1.2 of reactxp-virtualistview
_Released 23 May 2017_

Republished because index files were missing in previous publish.


#### Version 0.42.0_rc.9 of reactxp
_Released 17 May 2017_

Fixed bug in Navigator that caused crash in hello-world sample.


#### Version 0.42.0_rc.8 of reactxp
_Released 16 May 2017_

Removed Profiling API namespace and dependency on react-addons-perf.


#### Version 0.1.1 of reactxp-virtualistview
_Released 11 May 2017_

Republished because "dist" directory was missing in previous publish.


#### Version 0.1.2 of reactxp-video
_Released 11 May 2017_

Published first version of reactxp-video extension.


#### Version 0.2.0 of reactxp-imagesvg
_Released 10 May 2017_

Switched from old version of react-native-art-svg to latest version of react-native-svg.


#### Version 0.42.0_rc.5 of reactxp
_Released 10 May 2017_

Fixed incorrect import path (using wrong case).
Fixed bug in native View implementation - was using stale props.
Added importantForLayout prop on View (web specific).
Fixed bug in native NavigatorExperimentalDelegate - was using wrong props.


#### Version 0.42.0_rc.4 of reactxp
_Released 27 Apr 2017_

Changed web implementation of Text to prevent copying text to clipboard.
Eliminated the need to specify box-sizing CSS in external CSS file.
Fixed accessibility focus bugs.


#### Version 0.42.0_rc.3 of reactxp
_Released 26 Apr 2017_

Added onLongPress prop for Link.
Fixed accessibility bug relating to Modal dialogs.


#### Version 0.42.0_rc.2 of reactxp
_Released 18 Apr 2017_

Added missing box-sizing CSS directives for web.
Fixed bug in native implementation of View related to accessibility. 


#### Version 0.1.0 of reactxp-imagesvg
_Released 26 Apr 2017_

Published first version of reactxp-imagesvg extension.


#### Version 0.42.0_rc.1 of reactxp
_Released 9 Apr 2017_

Updated project to use recent versions of React (15.5.3) and React Native (0.42.3).


#### Version 0.34.3 of reactxp
_Released 7 Apr 2017_

Added new props to ScrollView. Updated package.json to properly reflect peerDependencies on react and react-native.


#### Version 0.34.1 of reactxp
_Released 6 Apr 2017_

This is the initial public release of the ReactXP core library. It is built against React Native 0.34. We are working on updating it to a newer version of React Native, and this will be released shortly.
