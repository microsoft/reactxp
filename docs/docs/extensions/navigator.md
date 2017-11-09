---
id: extensions/navigator
title: Navigator
layout: docs
category: Extensions
permalink: docs/extensions/navigator.html
next: extensions/restclient
---

This component provides a way for the app to present a virtual stack of "cards", allowing the user to push or pop those cards onto the stack in an animated manner. The caller can control the animation type and direction.

When a new card is presented, the Navitator calls the renderScene method, allowing the caller to render the contents. Cards are identified by "routes", which contain a unique ID and configuration parameters that control the behavior of the transition.

When a Navigator is first mounted, the stack is empty. The caller must wait for the mount to complete, then specify the list of routes to present.

The current implementation of Navitator on React Native makes use of the deprecated "Navigator Experimental". We will look at moving away from this implementation to the now-recommended "react-navigation" in the near future. Some of the more advanced interfaces may need to change. These are listed at the end of this article. Use these with caution.

To install: ```npm install reactxp-navigator```

## Types
``` javascript
// Specifies the behavior when transitioning from one
// card to another within the stack.
enum NavigatorSceneConfigType {
    FloatFromRight,
    FloatFromLeft,
    FloatFromBottom,
    Fade,
    FadeWithSlide
}

// Provides information about a card and how it should
// be presented when pushed onto the stack or popped
// off the stack.
interface NavigatorRoute {
    // Uniquely identifies the card
    routeId: number;

    // Animation parameter
    sceneConfigType: NavigatorSceneConfigType;

    // Optional gesture response distance override;
    // 0 is equivalent to disabling gestures;
    // works only on React Native platforms
    gestureResponseDistance?: number;

    // Optional custom scene config;
    // works only on React Native platforms
    customSceneConfig?: CustomNavigatorSceneConfig;
}
```

## Props
``` javascript
// Style to apply to the card
cardStyle: ViewStyleRuleSet = undefined;

// Called to render the specified scene
renderScene: (route: NavigatorRoute) => JSX.Element = undefined;

// Called when a transition between cards is complete
transitionCompleted: () => void = undefined;
```

## Methods
``` javascript
// Returns the current list of routes
getCurrentRoutes(): Types.NavigatorRoute[];

// Replaces the current list of routes with a new list
immediatelyResetRouteStack(
    nextRouteStack: Types.NavigatorRoute[]): void;

// Pops the top route off the stack
pop(): void;

// Pops zero or more routes off the top of the stack until
// the specified route is top-most
popToRoute(route: Types.NavigatorRoute): void;

// Pops all routes off the stack except for the last
// remaining item in the stack
popToTop(): void;

// Push a new route onto the stack
push(route: Types.NavigatorRoute): void;

// Replaces the top-most route with a new route
replace(route: Types.NavigatorRoute): void;

// Replaces an existing route (identified by index) with
// a new route
replaceAtIndex(route: Types.NavigatorRoute, index: number): void;

// Replaces the next-to-top-most route with a new route
replacePrevious(route: Types.NavigatorRoute): void;
```

## Sample Usage

This sample demonstrates how an app can use Navigator to present a two-card stack, allowing the user to navigate between them. It omits some details for brevity. For a full working example, check out the hello-world sample app.

``` javascript
enum NavigationRouteId {
    MainPanel,
    SecondPanel
};

class App extends RX.Component<null, null> {
    private _navigator: RX.Navigator;

    componentDidMount() {
        // Now that the app is mounted, specify the initial
        // navigator route.
        this._navigator.immediatelyResetRouteStack([{
            routeId: NavigationRouteId.MainPanel,
            sceneConfigType: RX.Types.NavigatorSceneConfigType.Fade
        }]);
    }

    render() {
        return (
            <RX.Navigator
                ref={ this._onNavigatorRef }
                renderScene={ this._renderScene }
            />
        );
    }

    private _onNavigatorRef = (naviator: RX.Navigator) => {
        // Stash away a reference to the mounted navigator
        this._navigator = navigator;
    }

    private _renderScene = (route: NavigatorRoute) => {
        switch (navigatorRoute.routeId) {
            case NavigationRouteId.MainPanel:
                return (
                    <MainPanel
                        onPressNavigate={ this._onPressNavigate }
                    />
                );

            case NavigationRouteId.SecondPanel:
                return (
                    <SecondPanel
                        onNavigateBack={ this._onPressBack }
                    />
                );
        }

        return null;
    }

    // Called when the user presses a button on the MainPanel
    // to navigate to the SecondPanel.
    private _onPressNavigate = () => {
        this._navigator.push({
            routeId: NavigationRouteId.SecondPanel,
            sceneConfigType:
                RX.Types.NavigatorSceneConfigType.FloatFromRight,
            customSceneConfig: {
                hideShadow: true
            }
        });
    }

    // Called when the user presses a back button on the
    // SecondPanel to navigate back to the MainPanel.
    private _onPressBack = () => {
        this._navigator.pop();
    }
}
```


## Experimental Types

These types apply only to React Native platforms, and they currently rely on the soon-to-be-deprecated "Experimental Navigator". Some or all of these types may be deprecated in the near future, so use with caution.

``` javascript
// Additional options that affect card transitions
type CustomNavigatorSceneConfig = {
  // Optional transition styles
  transitionStyle?: (sceneIndex: number, 
    sceneDimensions: Dimensions) =>
    NavigationTransitionStyleConfig;

  // Optional overrides for duration, easing, and timing
  transitionSpec?: NavigationTransitionSpec;
 
  // Optional cardStyle override
  cardStyle?: ViewStyleRuleSet;
 
  // Optionally hide drop shadow
  hideShadow?: boolean;
 
  // Optionally flip the visual order of the last two scenes
  presentBelowPrevious?: boolean;
};

// Parameters to control transition animations
type NavigationTransitionSpec = {
    duration?: number;
    easing?: Animated.EasingFunction;
};

// Parameters to control transition appearance
type NavigationTransitionStyleConfig = {
  // By default, input range is defined as [index - 1, index, index + 1];
  // Input and output ranges must contain the same number of elements
  inputRange?: number[];
  opacityOutput: number | number[];
  scaleOutput: number | number[];
  translateXOutput: number | number[];
  translateYOutput: number | number[];
};
```

## Experimental Props

These props apply only to React Native platforms, and they currently rely on the soon-to-be-deprecated "Experimental Navigator". Some or all of these props may be deprecated in the near future, so use with caution.

``` javascript
// Called after the user swipes back in the stack and the transition
// is complete
navigateBackCompleted: () => void;

// Called when a transition begins; works only
// on native 
transitionStarted: (progress?: RX.AnimatedValue,
    toRouteId?: string, fromRouteId?: string,
    toIndex?: number, fromIndex?: number) => void = undefined;
```

