---
id: styles
title: Styles
layout: docs
category: Overview
permalink: docs/styles.html
next: animations
---

Each component type supports a predefined set of style attributes. ReactXP defines strongly-typed style objects for each base component. This allows for compile-time checking and IntelliSense. Styles must be allocated using the provided RX.Styles methods. These methods also perform validation of values and simple platform-specific or browser-specific transforms. Here are a few examples:

``` javascript
const myViewStyle = RX.Styles.createViewStyle({
    backgroundColor: 'green'
});

const myTextStyle = RX.Styles.createTextStyle({
    fontSize: 36,
    fontWeight: 'bold'
});
```

Many base components share common subsets of style attributes. For example, almost every base component supports the flexbox attributes. See below for some of these common attribute sets.

## Combining Styles

All of the base components support a *style* prop that can accept a single style or an array of styles. If an array of styles is provided, the styles are combined in such a way that styles with larger indices override styles with smaller indices. Falsy values (false, null, undefined) can also be specified in a style array. This allows for the following common pattern. 

``` javascript
    let buttonTextStyles = [_styles.baseText, this.state.hovering && _styles.hoverText];
```

Here is another variant that does the same thing -- a little more verbose but arguably easier to read.

``` javascript
let buttonTextStyles = [_styles.baseText];
if (this.state.hovering) {
    buttonTextStyles.push(_styles.hoverText);
}
```

Within a style array, you can also pass nested arrays. This allows easy manipulation of composite styles.

``` javascript
// this.props.style might be undefined, a single style, or a (potentially-nested)
// array of styles.
<RX.View style={ [_styles.defaultStyle, this.props.style] } />
```


## Style Caching

By default, styles allocated by ReactXP are cached. This allows callers to refer to the style by a handle rather than rebuilding a full style structure each time it is used. For styles that depend on dynamic parameters or are allocated in non-static code paths, it is important to disable caching. Failing to do so will result in memory leaks. To disable caching, specify false as a second parameter to the creation method.

``` javascript
let dynamicViewStyle = RX.Styles.createViewStyle({
    backgroundColor: userColor
}, false);
```

## Style Documentation Conventions

For each style attribute, the type and default value is specified. For enumerated values, the first item in the enumeration is the default value.

Color values are specified as strings. They can be specified as color names (e.g. 'red'), three-digit or six-digit hex values (e.g. '#444' or '#ff00ee'), or rgb or rgba values (e.g. 'rgb(255, 0, 67)' or 'rgba(255, 0, 67, 0.5)').

## Flexbox Style Attributes
ReactXP adopts the simplified flexbox rules and defaults defined by React Native. It differs somewhat from the flexbox standard in CSS in the following ways.

+ All components follow flex rules by default (with the notable exception of Text). Unlike CSS, there is no need to specify "display: flex".

+ Widths, heights, and other measurements are assumed to be pixel values. Other units (including percentages) are not supported.

+ While it is possible to specify flexGrow, flexShrink and flexBasis values independently, it is more common to specify the flex parameters using a shortcut called "flex". It accepts an integer value and covers the following common cases.
    * "flex: 0" implies "flex: 0 0 auto"
    * "flex: n" (where n is negative) implies "flex: 0 n auto"
    * "flex: p" (where p is positive) implies "flex: n 1 auto"

+ The default flexDirection is 'column' rather than 'row'.

+ The default position for all elements is 'relative' rather than 'auto'.

+ The default justifyContent for buttons is 'center' rather than 'flex-start'.

**Container layout**
```javascript
flex: number = 0;
alignSelf: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
```

**Child layout**
```javascript
alignContent: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch';
alignItems: 'stretch' | 'flex-start' | 'flex-end' | 'center';
flexWrap: 'wrap' | 'nowrap';
flexDirection: 'column' | 'row' | 'column-reverse' | 'row-reverse';
justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' |
    'space-around';
```

**Size Overrides**
```javascript
height: number = undefined; // Can be animated
width: number = undefined; // Can be animated
maxHeight: number = undefined;
maxWidth: number = undefined;
minHeight: number = undefined;
minWidth: number = undefined;
```

**Position Overrides**
```javascript
position: 'absolute' | 'relative';
top: number = undefined; // Can be animated
right: number = undefined; // Can be animated
bottom: number = undefined; // Can be animated
left: number = undefined; // Can be animated
```

**Margins**
```javascript
margin: number; // Sets all four margin attributes
marginHorizontal: number; // Sets left and right
marginVertical: number; // Sets top and bottom
marginTop: number = 0;
marginRight: number = 0;
marginBottom: number = 0;
marginLeft: number = 0;
```

**Padding**
```javascript
padding: number; // Sets all four padding attributes
paddingHorizontal: number; // Sets left and right
paddingVertical: number; // Sets top and bottom
paddingTop: number = 0;
paddingRight: number = 0;
paddingBottom: number = 0;
paddingLeft: number = 0;
```

## View Style Attributes

**Color & Opacity**
```javascript
backgroundColor: color = undefined; // Value is animatable
opacity: number = 1.0; // Value is animatable
acrylicOpacityUWP: number = 1.0; // UWP only
acrylicSourceUWP: 'host' | 'app'; // UWP only
acrylicTintColorUWP: string = undefined; // UWP only; default = backgroundColor
```

**Overflow**
```javascript
overflow: 'hidden' | 'visible';
```

**Borders**
```javascript
borderWidth: number;
borderColor: color;
borderStyle: 'solid' | 'dotted' | 'dashed' | 'none';
borderRadius: number;  // Sets all four border radius attributes; value is animatable
borderTopRightRadius: number = 0;
borderBottomRightRadius: number = 0;
borderBottomLeftRadius: number = 0;
borderTopLeftRadius: number = 0;
```

**Shadows**
```javascript
shadowOffset: { height: number; width: number } = { 0, 0 };
shadowRadius: number = 0;
shadowColor: color = 'black';
elevation: number; // Android only
```

**Miscellaneous**
```javascript
wordBreak: 'break-all' | 'break-word'; // Web only
appRegion: 'drag' | 'no-drag'; // Web only
cursor: 'pointer' | 'default'; // Web only
```

## Transform Style Attributes

**Transforms**
```javascript
transform: {
    // All transform values are animatable
    perspective: string = undefined;
    rotate: string = undefined;
    rotateX: string = undefined;
    rotateY: string = undefined;
    rotateZ: string = undefined;
    scale: number = 0;
    scaleX: number = 0;
    scaleY: number = 0;
    scaleY: number = 0;
    translateX: number = 0;
    translateY: number = 0;
}
```

## Text Style Attributes

**Font Information**
```javascript
// Attributes in this group cascade to child RX.Text components
fontFamily: string = undefined;
fontStyle: 'normal' | 'italic';
fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' |
    '600' | '700' | '800' | '900';
fontSize: number = undefined;

// Shortcut that sets all three font attributes
font: {
    family: string = undefined;
    style: 'normal' | 'italic';
    weight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' |
        '600' | '700' | '800' | '900';
}
```

**Text Color**
```javascript
// Attributes in this group cascade to child RX.Text components
color: color = 'black'; // Value is animatable
```

**Spacing Overrides**
```javascript
// Attributes in this group cascade to child RX.Text components
letterSpacing: number = 1;
lineHeight: number = 1;
```

**Alignment**
```javascript
textAlign: 'auto' | 'left' | 'right' | 'center' | 'justify';
textAlignVertical: 'auto' | 'top' | 'bottom' | 'center'; // Android specific
```

**Text Decoration**
```javascript
textDecorationLine: 'none' | 'underline' | 'line-through' |
    'underline line-through';
textDecorationStyle: 'solid' | 'double' | 'dotted' | 'dashed';
textDecorationColor: string = 'black';
```

**Writing Direction**
```javascript
writingDirection?: 'auto' | 'ltr' | 'rtl';
```

**Miscellaneous**
```javascript
includeFontPadding: boolean = true; // Android specific
```
