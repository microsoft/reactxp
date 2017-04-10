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
accessibilityHidden: boolean = false;

// Hide the component from screen readers?
accessibilityHidden: boolean = false;

// Traits used to hint screen readers, etc.
accessibilityTraits: AccessibilityTrait | AccessibilityTrait[] = undefined;

// Region for accessibility mechanisms
accessibilityLiveRegion?: AccessibilityLiveRegion = undefined; // Android and web only

// Keyboard tab order
tabIndex: number = undefined;

// Should fonts be scaled according to system setting?
allowFontScaling: boolean = true; // Android and iOS only

// For non-zero values, truncates with ellipsis if necessary
numberOfLines: number = 0;

// Is the text selectable (affects mouse pointer and copy command)
selectable: boolean = false;

// See below for supported styles
style: TextStyleRuleSet | TextStyleRuleSet[] = [];
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

