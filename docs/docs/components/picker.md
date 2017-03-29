---
id: components/picker
title: Picker
layout: docs
category: Components
permalink: docs/components/picker.html
next: components/scrollview
---

This component displays a control that allows the user to pick from a list of items.

## Classes
``` javascript
interface PickerPropsItem {
    label: string;
    value: string;
}
```

## Props
``` javascript
// List of items to be displayed in the picker
items: PickerPropsItem[] = [];

// Initially-selected item
selectedValue: string;

// Invoked when the selected value changes
onValueChange: (itemValue: string, itemPosition: number) => void;

style?: PickerStyleRuleSet | PickerStyleRuleSet[];
```

## Styles

``` javascript
**Text Color**
color: 'string';
```

[**Flexbox Styles**](/reactxp/docs/styles.html#flexbox-style-attributes)

[**View Styles**](/reactxp/docs/styles.html#view-style-attributes)

[**Transform Styles**](/reactxp/docs/styles.html#transform-style-attributes)

## Methods

No methods