---
id: components/incremental
title: Incremental
layout: docs
category: Components
permalink: docs/components/incremental.html
next: components/link
---

This component handles the incremental rendering of child views. This reduces the amount of rendering that needs to take place at once, keeping the app responsive during the rending of complex views.

To use, enclose multiple Incremental components within an IncrementalGroup.

## IncrementalGroup Props
``` javascript
// Invoked once all of the enclosed Incremental items have been rendered
onDone: () => void;
```

## Styles
No specialized styles

## Methods
No methods

## Sample Usage
``` javascript
// Wrap each list item in an Incremental
let listItems = _.map(people, person => {
    render (
        <Incremental key={ person.id }>
            <Image src={ person.avatarUrl }/>
            <Text>
                { person.name }
            </Text>
        </Incremental>
    );
});

return (
    // Wrap the entire list in an IncrementalGroup
    <IncrementalGroup>
        { listItems }
    </IncrementalGroup>
);
```


