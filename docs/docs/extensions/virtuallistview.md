---
id: extensions/virtuallistview
title: VirtualListView
layout: docs
category: Extensions
permalink: docs/extensions/virtuallistview.html
---

This components supports a vertical list of items within a scrolling area. The visible portion of the list is referred to as the "view port". The list is virtualized, which means that items are rendered only when they are within the view port (or just above or below the view port).

Unlike other list views (such as the ListView provided in React Native), this component supports lists of heterogeneous items with different heights and completely different types.

Each item in the list is described by a VirtualListViewItemInfo object. The list of items is specified by an ordered list passed in the itemList prop. When an item comes into view, it is rendered through the use of the renderItem callback. Additional fields can be added to the VirtualListViewItemInfo by the caller as it sees fit. For example, it is sometimes useful to include additional identifying information such as an item type or an item-specific render method.

A height must be specified for each item. By default, this height is assumed to be accurate and constant. If you do not know the height of the object or it may change, the height can be measured at runtime. This option is expensive, so it should be avoided if possible.

It optionally supports animation of items when they are added, removed or moved within the list.

When items are added before or after the visible region, it attempts to maintain the current position of the visible items, adjusting the scroll position and list height as necessary.

To install: ```npm install reactxp-virtuallistview```

## Performance Techniques

The VirtualListView employs a number of tricks to improve performance.

It uses a technique called "cell recycling" to minimize the number of mounts and unmounts. A cell is a container for a list item. When a cell is no longer visible, it can be temporarily hidden and then reused for the next item that becomes visible. This optimization is most effective when the recycled cell and its contents are used for an item that is similar in content. For this reason, callers need to specify a "template" field to identify similar items.

It also supports "overdraw" to render items above and below the view port. This minimizes chances that the user will scroll to a new portion of the list before new items can be rendered in that area. Overdraw is employed only after the view port is initially filled. This reduces the performance impact of rendering.

It also limits the number of items it renders each time to avoid consuming too many cycles on the javascript thread.

It supports a special mode where items are re-rendered only if the corresponding VirtualListViewItemInfo changes. This mode requires that the renderItem method use only information within this object. To use this mode, set the skipRenderIfItemUnchanged prop to true.

## Example
``` javascript
import { VirtualListView, VirtualListViewItemInfo }
    from 'reactxp-virtuallistview';

// Extend VirtualListViewItemInfo to include display text
interface FruitListItemInfo extends VirtualListViewItemInfo {
    text: string;
}

interface FruitListState {
    items: FruitListItemInfo[];
}

const _headerItemHeight = 20;
const _fruitItemHeight = 32;
const _headerItemTemplate = 'header';
const _fruitItemTemplate = 'fruit';

class FruitListView extends RX.Component<null, FruitListState> {
    constructor() {
        super();

        this.state = {
            items: [{
                key: 'header1',
                height: _headerItemHeight,
                text: 'Domstic Fruits',
                template: _headerItemTemplate
            }, {
                key: 'bannana',
                height: _fruitItemHeight,
                text: 'Banana',
                template: _fruitItemTemplate
            }, {
                key: 'apple',
                height: _fruitItemHeight,
                text: 'Apple',
                template: _fruitItemTemplate
            }]
        };
    }

    render() {
        return (
            <VirtualListView
                itemList={ this.state.items }
                renderItem={ this._renderItem }
                animateChanges={ true }
                skipRenderIfItemUnchanged={ true }
            />
        );
    }

    private _renderItem(item: FruitListItemInfo, hasFocus?: boolean) {
        const viewStyle = RX.Styles.createViewStyle({
            height: item.height,
            backgroundColor: item.template === _headerItemTemplate ?
                '#ddd' : '#fff',
            alignItems: 'center'
        }, false);
        
        return (
            <RX.View style={ viewStyle }>
                <RX.Text>
                    { item.text }
                </RX.Text>
            </RX.View>
        );
    }
}
```


## Interfaces
``` javascript
interface VirtualListViewItemInfo {
    // A string that uniquely identifies this item.
    key: string;

    // Specifies the known height of the item or a best guess if the
    // height isn't known.
    height: number;

    // Specifies that the height is not known and needs to be measured
    // dynamically. This has a big perf overhead because it requires a
    // double layout (once offscreen to measure the item). It also 
    // disables cell recycling. Wherever possible, it should be avoided,
    // especially for perf-critical views.
    measureHeight?: boolean;

    // Specify the same "template" string for items that are rendered
    // with identical or similar view hierarchies. When a template is
    // specified, the list view attempts to recycle cells whose templates
    // match. When an item scrolls off the screen and others appear on
    // screen, the contents of the cell are simply updated rather than
    // torn down and rebuilt.
    template: string;

    // Is the item navigable by keyboard or through accessibility
    // mechanisms?
    isNavigable?: boolean;
}
```

## Props
``` javascript
    // Ordered list of descriptors for items to display in the list.
    itemList: VirtualListViewItemInfo[];

    // Callback for rendering item when it becomes visible within view port.
    renderItem: (item: VirtualListViewItemInfo, hasFocus?: boolean) =>
        JSX.Element | JSX.Element[];

    // Optional padding around the scrolling content within the list.
    padding?: number;

    // If true, allows each item to overflow its visible cell boundaries;
    // by default, item contents are clipped to cell boundaries.
    showOverflow?: boolean;

    // Should the list animate additions, removals and moves within the list?
    animateChanges?: boolean;

    // By default, VirtualListView re-renders every item during the render.
    // Setting this flag to true allows the list view to re-render only
    // items from itemList whose descriptor has changed, thus avoiding
    // unnecessary rendering. It uses _.isEqual to perform this check. In
    // this mode, renderItem should not depend on any external state, only
    // on VirtualListViewItemInfo, to render item.
    skipRenderIfItemUnchanged?: boolean;

    // Pass-through properties for scroll view.
    keyboardDismissMode?: 'none' | 'interactive' | 'on-drag';
    keyboardShouldPersistTaps?: boolean;
    disableScrolling?: boolean;
    scrollsToTop?: boolean; // iOS only, scroll to top on status bar tap
    disableBouncing?: boolean; // iOS only, bounce override
    scrollIndicatorInsets?: { top: number, left: number,
        bottom: number, right: number }; // iOS only
    onScroll?: (scrollTop: number, scrollLeft: number) => void;

    // Logging callback to debug issues related to the VirtualListView.
    logInfo?: (textToLog: string) => void;
```

## Methods
``` javascript
// Scrolls the view to the specified top value (specified in pixels).
scrollToTop(animated = true, top = 0);
```

