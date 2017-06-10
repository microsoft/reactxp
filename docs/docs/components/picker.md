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

Below is an example of a `Picker` which stores the picked value in the `RX.Component`'s [`state`](/reactxp/docs/react_concepts.html#state) and updates based on the users selected choice. The code produce content visually similar to this HTML version:

<!-- HTML version NOT the ReactRX compiled form -->
<div style="margin: 20px">
    <span>How do you feel about ReactXP? ;) Is it: </span>
    <select>
        <option value="Cool" selected>Cool</option>
        <option value="Super Cool">Super Cool</option>
        <option value="Great">Great</option>
    </select>
</div>

``` javascript
import RX = require('reactxp');

// Pickable items
const pickerItems: RX.Types.PickerPropsItem[] = [
    {
        label: "Cool",
        value: "Cool",
    },
    {
        label: "Super Cool",
        value: "Super Cool",
    },
    {
        label: "Great",
        value: "Great",
    }
];

class App extends RX.Component<null, { selectedValue: string }> {
    constructor() {
        super();

        // Setup the starting state
        this.state = {
            selectedValue: "Cool",
        }
    }

    render(): JSX.Element {
        return (
            <RX.Text numberOfLines={ 1 }>
                <RX.Text> { 'How do you feel about ReactXP? ;) Is it: ' } </RX.Text>
                <RX.Picker items={pickerItems}
                    selectedValue={this.state.selectedValue}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ selectedValue: itemValue });
                    }} />
            </RX.Text>
        );
    }
}

export = App;
```
