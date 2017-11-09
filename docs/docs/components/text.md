---
id: components/text
title: Text
layout: docs
category: Components
permalink: docs/components/text.html
next: components/textinput
---

This component displays basic text. Its children must be a string literal or a series of children that are either Text components or View components with a fixed height and width.

Unlike other ReactXP components, some of the style attributes for an Text cascade to its children. In the following example, the title and body both inherit the styles from their parent RX.Text component, but they can also override specific style elements.

Another difference between Text and other components is that Text children are not layed out according to flexbox layout rules. Instead, an inline text layout is used.

## Props

``` javascript
// Alternate text to display if the image cannot be loaded
// or by screen readers
accessibilityLabel: string = undefined;

// Hide the component from screen readers?
accessibilityHidden: boolean = false;

// Traits used to hint screen readers, etc.
accessibilityTraits: AccessibilityTrait | AccessibilityTrait[] = undefined;

// Region for accessibility mechanisms
accessibilityLiveRegion: AccessibilityLiveRegion =
    undefined; // Android and web only

// Should fonts be scaled according to system setting?
allowFontScaling: boolean = true; // Android and iOS only

// Specifies a unique id for an HTML element
id: string = undefined; // Web only

// Should the scale multiplier be capped when allowFontScaling is set to true?
// Possible values include the following:
// null/undefined (default) - inheret from parent/global default
// 0 - no max
// >= 1 - sets the maxContentSizeMultiplier of this node to this value
// Note: Older versions of React Native don’t support this interface. 
maxContentSizeMultiplier: number = null; // Android and iOS only

// For non-zero values, truncates with ellipsis if necessary
numberOfLines: number = 0;

// Is the text selectable (affects mouse pointer and copy command)
selectable: boolean = false;

// Mouse & Touch Events
onPress?: (e: SyntheticEvent) => void = undefined;
onContextMenu?: (e: SyntheticEvent) => void = undefined;

// See below for supported styles
style: TextStyleRuleSet | TextStyleRuleSet[] = [];

// Keyboard tab order
tabIndex: number = undefined;
```

## Styles

[**Text Styles**](/reactxp/docs/styles.html#text-style-attributes)

[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Sets the accessibility focus to the component.
focus(): void;
```

## Sample Usage

``` javascript
    <RX.Text style={ _styles.defaultText }>
        <RX.Text style={ _styles.titleText }>
            { this.props.title }
        </RX.Text>
        <RX.Text style={ _styles.bodyText }>
            { this.props.body }
        </RX.Text>
    </RX.Text>
```

``` javascript
    static _styles = {
        redBox: RX.Styles.createViewStyle({
            width: 10,
            height: 10,
            backgroundColor: 'red'
        })
    }

    <RX.Text style={ _styles.defaultText } numberOfLines={ 1 }>
        <RX.Text> { 'Red box ' } </RX.Text>
        <RX.View style={ _styles.redBox } />
        <RX.Text> { ' inlined view example' } </RX.Text>
    </RX.Text>
```

