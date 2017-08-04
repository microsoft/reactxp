---
id: apis/popup
title: Popup
layout: docs
category: Interfaces
permalink: docs/apis/popup.html
next: apis/statusbar
---

A popup is not technically a component. Rather, it's a collection of methods on the ReactXP.App namespace that allow the app to display a view that overlays a portion of the screen. Popups can be "anchored" to mounted components and follow them as they move around the screen (e.g. in reaction to scroll events).

When a popup is displayed, the caller specifies a PopupOptions structure that includes several callbacks, including a renderPopup method.

Popups by default will not act like a toggle. When Popup.show is called, it will always show the Popup. If a Popup is required to act like a toggle, PopupOptions.dismissIfShown should be set to true. In this case, if Popup.show is called once for a component, it will show the popup. A subsequent call from the same component will dismiss the popup and so on. 

The overall dimensions of a popup are assumed to remain constant for the lifetime of the popup. This allows the dimensions to be measured once, and the popup can then be positioned relative to the anchor. 

Popups are identified by a caller-specified ID that should be unique.

## Types
``` javascript
type PopupPosition  = 'top' | 'right' | 'bottom' | 'left';

interface PopupOptions {
    // Returns a mounted component instance that serves as the
    // "anchor" for the popup. Often a button.
    getAnchor: () => React.Component<any, any>;

    // Renders the contents of the popup.
    renderPopup: (anchorPosition: PopupPosition, anchorOffset: number,
        popupWidth: number, popupHeight: number) => ReactNode;

    // Returns a mounted component instance that controls the triggering of the popup.
    // In the majority of cases, "anchor" of popup has handlers to control when the popup
    // will be seen and this function is not required. In a few cases, where anchor is
    // not the same as the whole component that triggers when the popup wil be seen,
    // this can be used. For instance, a button combined with a chevron icon, which on
    // click triggers a popup below the chevron icon. In this example,
    // getElementTriggeringPopup() can return the container with button and chevron icon.
    getElementTriggeringPopup?: () => React.Component<any, any>;

    // Called when the popup is dismissed.
    onDismiss?: () => void;

    // Prioritized order of positions. Popup is positioned
    // relative to the anchor such that it remains on screen.
    // Default is ['bottom', 'right', 'top', 'left'].
    positionPriorities?: string[];

    // Position the popup inside its anchor.
    // In this mode only the first position priority will be used.
    useInnerPositioning?: boolean;

    // On pressed handler to notify whoever wanted to create the popup that its
    // anchor has been pressed.
    // IMPORTANT NOTE: This handler may be called when the component is
    // already unmounted as it uses a time delay accommodate 
    // fade-out animations.
    onAnchorPressed?: (e: SyntheticEvent) => void;

    // Determines if the anchor invoking the popup should behave like a toggle. 
    // If true, calling Popup.show will show the popup. A subsequent call
    // will hide the popup. If false or undefined (default), calling Popup.show 
    // will always show the popup.
     dismissIfShown?: boolean;

    // By default, clicks or taps outside of a popup (unless they are on the
    // anchor) will not dismiss the active popup. If true, this overrides the
    // default behavior, in which case the popup must be dismissed explicitly.
     preventDismissOnPress?: boolean
}
```

## Methods

``` javascript
// Dismisses an already-displayed popup after a specified number of milliseconds
autoDismiss(popupId: string, dismissDelay: number = 0): void;

// Dismisses an already-displayed popup immediately
dismiss(popupId: string): void;

// Displays a popup
show(options: PopupOptions, popupId: string, showDelay: number = 0);
```

## Sample Usage

``` javascript
const _popupId = 'myPopup';
let _popupDisplayed = false;

onHoverStart() {
    if (!this._popupDisplayed) {
        this.displayPopup();
    }
};

onHoverEnd() {
    RX.Popup.autoDismiss(_popupId, 2000);
};

displayPopup() {
    let popupOptions: RX.Types.PopupOptions = {
        getAnchor: () => {
            return this.refs['myButton'];
        },
        renderPopup: (anchorPosition: Types.PopupPosition, anchorOffset: number,
                popupWidth: number, popupHeight: number) => {
            return this._renderPopupView(anchorPosition,
                anchorOffset, popupWidth, popupHeight);
        },
        positionPriorities: ['right', 'left', 'bottom', 'top'],
        onDismiss: () => {
            this._popupDisplayed = false;
        }
    };

    RX.Popup.show(popupOptions, _popupId, 500);
    this._popupDisplayed = true;
}
```

