---
id: components/picker
title: Picker
layout: docs
category: Components
permalink: docs/components/picker.html
next: components/scrollview
---

This component displays a control that allows the user to pick from a list of items.

## Types
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

style: PickerStyleRuleSet | PickerStyleRuleSet[] = [];

// Android only.
// 'dialog': Show a modal dialog. This is the default.
// 'dropdown': Shows a dropdown anchored to the picker view
mode: 'dialog' | 'dropdown';
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


## Sample Usage

``` javascript
const pickerItems: RX.Types.PickerPropsItem[] = [
    {
        label: 'Cool',
        value: 'cool'
    },
    {
        label: 'Super',
        value: 'super'
    },
    {
        label: 'Great',
        value: 'great'
    }
];

class MyComponent extends RX.Component<null, { selectedValue: string }> {
    constructor() {
        super();

        this.state = {
            selectedValue: 'cool'
        }
    }

    render(): JSX.Element {
        return (
            <RX.Text numberOfLines={ 1 }>
                <RX.Text> { 'How are you feeling? ' } </RX.Text>
                <RX.Picker
                    items={ pickerItems }
                    selectedValue={ this.state.selectedValue }
                    onValueChange={ this._onValueChange }
                />
            </RX.Text>
        );
    }

    private _onValueChange = (itemValue: string, itemIndex: number) => {
        this.setState({ selectedValue: itemValue });
    }
}
```
