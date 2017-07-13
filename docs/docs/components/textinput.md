---
id: components/textinput
title: TextInput
layout: docs
category: Components
permalink: docs/components/textinput.html
next: components/view
---

This component provides basic text input capabilities.

## Props
In addition to the [common accessibility props](/reactxp/docs/accessibility.html), the following props are supported.

``` javascript
// Should fonts be scaled according to system setting?
allowFontScaling: boolean = true; // Android and iOS only

// Auto-capitalization mode
autoCapitalize: 'none' | 'sentences' | 'words' | 'characters';

// Should auto-correction be applied to contents?
autoCorrect: boolean = true;

// Should focus be applied to text input on componentDidMount?
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

// Should the scale multiplier be capped when allowFontScaling is set to true?
// Possible values include the following:
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
onScroll: (newScrollTop: number, newScrollLeft: number) => void = undefined;

// Called when the selection range or insertion point location changes
onSelectionChange: (start: number, end: number) => void = undefined;

// Called when the text input submit button is pressed; invalid if multiline is true
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

// Alignment of text within the input box.
textAlign: 'auto' | 'left' | 'right' | 'center' | 'justify';


// If defined, the control value is forced to match this value; if undefined, control value can be modified by the user
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

// Gives the control focus. For mobile, use setAccessibilityFocus() for setting screen reader focus
focus(): void;

// Gives the control accessibility-only focus
// E.g. screen reader focus is needed, but popping up of native keyboard is undesirable 
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


