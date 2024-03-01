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
// Should fonts be scaled according to system setting?
allowFontScaling: boolean = true; // Android and iOS only

// When numberOfLines is set, this prop defines how text will be truncated.
// head: The line is displayed so that the end fits in the container and
//   the missing text at the beginning of the line is indicated by an
//   ellipsis glyph. e.g., "...wxyz"
// middle: The line is displayed so that the beginning and end fit in
//   the container and the missing text in the middle is indicated by an
//   ellipsis glyph. "ab...yz"
// tail: The line is displayed so that the beginning fits in the container
//   and the missing text at the end of the line is indicated by an ellipsis
//   glyph. e.g., "abcd..."
ellipsizeMode: 'head' | 'middle' | 'tail'; // Android & iOS only

// Specifies a unique id for an HTML element.
// NOTE: This property may be going away in future versions.
id: string = undefined; // Web only

// Expose the element and/or its children as accessible to Screen readers
importantForAccessibility: ImportantForAccessibility =
    ImportantForAccessibility.Yes;

// It is hard or impossible to tell by a reference to an instance of a component
// from where this component has been instantiated. You can assign this property
// and check instance.props.accessibilityId. For example accessibilityId is used
// in View's FocusArbitrator callback.
accessibilityId: string = undefined;

// Should be focused when the component is mounted, see also View's arbitrateFocus
// property.
// WARNING: autoFocus=true means that this Text's requestFocus() method will be
// called, however calling requestFocus() for Text might make sense only on mobile
// for the accessibility reasons, on web it has no effect, the application has to
// handle this either while setting this property or in the View's FocusArbitrator
// callback.
autoFocus: boolean = false;

// For non-zero values, truncates with ellipsis if necessary. Web platform
// doesn't support values greater than 1. Web platform may also not truncate
// properly if text contains line breaks, so it may be necessary to replace
// line breaks before rendering.
numberOfLines: number = 0;

// Mouse & Touch Events
onPress?: (e: SyntheticEvent) => void = undefined;
onContextMenu?: (e: SyntheticEvent) => void = undefined;

// Is the text selectable (affects mouse pointer and copy command)
// iOS doesn't support partial selections.
selectable: boolean = false;

// See below for supported styles
style: TextStyleRuleSet | TextStyleRuleSet[] = [];

// ID that can be used to identify the instantiated element for testing purposes.
testId: string = undefined;
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

// The preferable way to focus the component. When requestFocus() is called,
// the actual focus() will be deferred, and if requestFocus() has been
// called for several components, only one of those components will actually
// get a focus() call. By default, last component for which requestFocus() is
// called will get a focus() call, but you can specify arbitrateFocus property
// of a parent View and provide the callback to decide which one of that View's
// descendants should be focused. This is useful for the accessibility: when
// consecutive focus() calls happen one after another, the next one interrupts
// the screen reader announcement for the previous one and the user gets
// confused. autoFocus property of focusable components also uses requestFocus().
requestFocus(): void;

// Blurs the component.
blur(): void;

// When selection is enabled, retrieves the selected text.
getSelectedText(): string; // Windows only
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

