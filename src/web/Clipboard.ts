/**
 * Clipboard.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Clipboard abstraction.
 */

import * as RX from '../common/Interfaces';

export class Clipboard extends RX.Clipboard {
    setText(text: string): void {
        const node = Clipboard._createInvisibleNode();
        node.value = text;

        document.body.appendChild(node);
        Clipboard._copyNode(node);
        document.body.removeChild(node);
    }

    getText(): Promise<string> {
        // Not supported in web platforms. This should can be only handled
        // in the paste event handlers.
        return Promise.reject<string>('Not supported on web');
    }

    private static _createInvisibleNode(): HTMLTextAreaElement {
        const node = document.createElement('textarea');
        node.style.position = 'absolute';
        node.style.left = '-10000px';
        node.style.width = '10px';

        // Use the same vertical position as the current page
        // to avoid scrolling on iOS Safari.
        const yPosition = window.pageYOffset || document.documentElement.scrollTop;
        node.style.top = yPosition + 'px';

        node.readOnly = true;

        return node;
    }

    private static _copyNode(node: HTMLTextAreaElement): void {
        node.select();
        node.setSelectionRange(0, node.value.length);

        document.execCommand('copy');

        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
    }
}

export default new Clipboard();
