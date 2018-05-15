---
id: components/textinput
title: TextInput
layout: docs
category: Components
permalink: docs/components/textinput.html
next: components/view
---

This component provides basic text input capabilities.

It can be used in one of two modes. In the first mode, the contents of the text input are static and are specified by the `value` prop. Any attempt to modify the value will result in `onChangeText`, which allows the owning component to re-render with an updated `value`. In the second mode, `value` is unspecified, and the text input value is allowed to be modified as long as it remains mounted. In this mode, the caller can specify an optional `defaultValue` prop to specify the initial value.

## Props
In addition to the [common accessibility props](/reactxp/docs/accessibility.html), the following props are supported.

``` javascript
// Text to be used by screen readers
accessibilityLabel: boolean = false;

// It is hard or impossible to tell by a reference to an instance of a component
// from where this component has been instantiated. You can assign this property
// and check instance.props.accessibilityId. For example accessibilityId is used
// in View's FocusArbitrator callback.
accessibilityId: string = undefined;

// Should fonts be scaled according to system setting?
allowFontScaling: boolean = true; // Android and iOS only

// Auto-capitalization mode
autoCapitalize: 'none' | 'sentences' | 'words' | 'characters';

// Should auto-correction be applied to contents?
autoCorrect: boolean = true;

// Should be focused when the component is mounted, see also View's arbitrateFocus
// property.
// WARNING: autoFocus=true means that this TextInput's requestFocus() method will be
// called, however calling requestFocus() might have no effect (for example the
// input is disabled), the application has to handle this either while setting this
// property or in the View's FocusArbitrator callback.
autoFocus: boolean = false;

// Should focus be lost after submitting?
blurOnSubmit: boolean = false;

// Initial value that will change when the user starts typing
defaultValue: string = undefined;

// Disable full screen editor mode?
disableFullscreenUI: boolean = false; // Android-specific

// Can text be edited by the user?
editable: boolean = true;

// iOS-only prop for controlling the keyboard appearance
keyboardAppearance: 'default' | 'light' | 'dark';

// On-screen keyboard type to display
keyboardType: 'default' | 'numeric' | 'email-address' | 'number-pad';

// Should the scale multiplier be capped when allowFontScaling is
// set to true? Possible values include the following:
// null/undefined (default) - inheret from parent/global default
// 0 - no max
// >= 1 - sets the maxContentSizeMultiplier of this node to this value
// Note: Older versions of React Native don’t support this interface.
maxContentSizeMultiplier: number = null; // Android and iOS only

// Maximum character count
maxLength: number = undefined;

// Should the control support multiple lines of text?
multiline: boolean = false;

// Called when the control loses focus
onBlur: () => void = undefined;

// Called when the text value changes
onChangeText: (newValue: string) => void = undefined;

// Called when the control obtains focus
onFocus: () => void = undefined;

// Called on a key event
onKeyPress: (e: KeyboardEvent) => void = undefined;

// Called when text is pasted into the control
onPaste: (e: ClipboardEvent) => void = undefined;

// Called when the selection scrolls due to overflow
onScroll: (newScrollLeft: number, newScrollTop: number) => void = undefined;

// Called when the selection range or insertion point location changes
onSelectionChange: (start: number, end: number) => void = undefined;

// Called when the text input submit button is pressed; invalid if
// multiline is true
onSubmitEditing: () => void = undefined;

// Placeholder text to dislpay when input is empty
placeholder: string = undefined;

// Color of placeholder text
placeholderTextColor: color = '#ccc';

// iOS and android prop for controlling return key type
returnKeyType: 'done' | 'go' | 'next' | 'search' | 'send';

// Obscure the text input (for passwords)?
secureTextEntry: boolean = false;

// Should spell checking be applied to contents?
spellCheck: boolean = [value of autoCorrect];

// See below for supported styles
style: TextInputStyleRuleSet | TextInputStyleRuleSet[] = [];


// If defined, the control value is forced to match this value;
// if undefined, control value can be modified by the user
value: string = undefined;
```

## Styles
[**Text Styles**](/reactxp/docs/styles.html#text-style-attributes)

[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods
``` javascript
// Forces the control to give up focus
blur(): void;

// Gives the control focus. For mobile, use setAccessibilityFocus()
// for setting screen reader focus
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

// Gives the control accessibility-only focus
// E.g. screen reader focus is needed, but popping up of native
// keyboard is undesirable
setAccessibilityFocus(): void;

// Does control currently have focus?
isFocused(): boolean;

// Extends selection to include all contents
selectAll(): void;

// Selects a range of text
selectRange(start: number, end: number): void;

// Returns the current selection range
getSelectionRange(): { start: number, end: number };

// Sets the current value
setValue(value: string): void;
```


