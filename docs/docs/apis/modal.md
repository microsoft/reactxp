---
id: apis/modal
title: Modal
layout: docs
category: Interfaces
permalink: docs/apis/modal.html
next: apis/network
---

This interface displays a view that overlays all other views rendered by the app, preventing any direct user interaction with the overlayed views.

A modal is identified by a caller-supplied "modal ID". These should be unique.

Only one modal can be displayed at a time. If a modal is already displayed, a newly-displayed modal is pushed onto the modal stack. When a modal is dismissed, it is popped off the stack, and the next modal becomes visible.

A modal can be displayed and dismissed using methods within the ReactXP.App namespace.

A modal covers the entire screen but is transparent. Its children define the visible contents and their position on the screen.

## Types
``` javascript
interface ModalOptions {
    // Android & iOS only.
    // The id of the root view this modal is associated with.
    // Defaults to the view set by UserInterface.setMainView();
    rootViewId?: string;
}
```

## Methods
``` javascript
// Removes the modal from the modal stack, unmounting it if it's currently
// on the top of the stack and showing the next modal in the stack.
dismiss(modalId: string);

// Removes all modals from the modal stack.
dismissAll();

// Indicates whether the specified modal is in the modal stack.
isDisplayed(modalId: string): boolean;

// Pushes the modal onto the modal stack.
show(modal: React.ReactElement<ViewProps>, modalId: string, options?: ModalOptions);
```

## Sample Usage

``` javascript
const _modalId = 'ErrorDialog';

showDialog() {
    let dialog = (
        <RX.View style={ _styles.errorDialog }>
            <RX.Text style={ _styles.descriptionText }>
                'An error occurred'
            </RX.Text>
            <RX.Button style={ _styles.button }
                    onPress={ this._onOkButtonPress }>
                <RX.Text style={ _styles.buttonText }>
                    'OK'
                </RX.Text>
            </RX.Button>
        </RX.View>
    );

    RX.Modal.show(dialog, _modalId);
}

private _onOkButtonPress = (e: RX.Types.SyntheticEvent) => {
    RX.Modal.dismiss(_modalId);
};
```


