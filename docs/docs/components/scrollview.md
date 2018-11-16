---
id: components/scrollview
title: ScrollView
layout: docs
category: Components
permalink: docs/components/scrollview.html
next: components/text
---

Like a View, this component is a container for other components. However, it supports scrolling (panning) and zooming so it is possible to view larger contents.

ScrollViews must have a bounded height (or width, if it scrolls horizontally) since its children are of unbounded height (or width). To bound the dimensions of a ScrollView, either set the height/width directly or make sure that its parent's height/width is bounded.

## Props
``` javascript
// Should scroll bar bounce when user hits the bounds?
bounces: boolean = true; // iOS only

// Does it support scrolling in the horizontal and/or vertical directions?
horizontal: boolean = false;
vertical: boolean = true;

// When the user scrolls the view, how should the on-screen keyboard react?
keyboardDismissMode: 'none' | 'interactive' | 'on-drag'; // Native only

// Should the on-screen keyboard remain visible when the user taps
// the scroll view?
keyboardShouldPersistTaps: boolean = false; // Native only

// Invoked when the contents of the scroll view change
onContentSizeChange: (width: number, height: number) => void = undefined;

// Focus Events
onFocus: (e: FocusEvent) => void = undefined;
onBlur: (e: FocusEvent) => void = undefined;

// Keyboard Events
onKeyPress: (e: KeyboardEvent) => void = undefined;

// Invoked when view dimensions or position changes
onLayout: (e: ViewOnLayoutEvent) => void = undefined;

// Called when the scroll position changes
onScroll: (newScrollTop: number, newScrollLeft: number) => void = undefined;

// Called when the user starts or stops scrolling (touch-based systems only)
onScrollBeginDrag: () => void = undefined;
onScrollEndDrag: () => void = undefined;

// Animation helpers to allow usage of the RN.Animated.Event system through ReactXP.
// AnimatedValue objects hooked up to either (or both) of these properties will be automatically
// hooked into the onScroll handler of the scrollview and .setValue() will be called on them
// with the updated values.  On supported platforms, it will use RN.Animated.event() to do
// a native-side/-backed coupled animation.
scrollXAnimatedValue?: RX.Types.AnimatedValue;
scrollYAnimatedValue?: RX.Types.AnimatedValue;

// Android only property to control overScroll mode
overScrollMode?: 'auto' | 'always' | 'never';

// Snap to page boundaries?
pagingEnabled: boolean = false; // Android & iOS only
snapToInterval: number = undefined; // iOS only

// Is scrolling enabled?
scrollEnabled: boolean = true;

// Minimum duration (in milliseconds) between scroll events
scrollEventThrottle: number = undefined;

// Inset (in pixels) of scroll indicator from top/bottom (vertical)
// or left/right (horizontal)
scrollIndicatorInsets: ScrollIndicatorInsets = undefined;

// If true, this scroll bar scrolls to the top when the user
// taps on the status bar.
scrollsToTop: boolean = false; // iOS only

// Should the indicator be displayed?
showsHorizontalScrollIndicator: boolean = [same as horizontal];
showsVerticalScrollIndicator: boolean = [same as horizontal];

// See below for supported styles
style: ViewStyleRuleSet | ViewStyleRuleSet[] = [];

// Windows-only property to control tab navigation inside the view
tabNavigation?: 'local' | 'cycle' | 'once';

// ID that can be used to identify the instantiated element for testing purposes.
testId: string = undefined;
```

## Styles
[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Sets the accessibility focus to the component.
focus(): void;

// Sets the absolute top or left position (measured in pixels) of the
// viewport within the scroll view. Optionally animates from the current
// position.
setScrollLeft(scrollLeft: number, animate: boolean): void;
setScrollTop(scrollTop: number, animate: boolean): void;
```


