/**
 * Clipboard.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Web-specific implementation of the cross-platform Clipboard abstraction.
 */
import escape = require('lodash/escape');
import * as SyncTasks from 'synctasks';

import * as RX from '../common/Interfaces';

export class Clipboard extends RX.Clipboard {
    setText(text: string) {
        const node = Clipboard._createInvisibleNode();
        // Replace carriage returns or newlines with br, so that pasting outside browser environment
        // (eg in a native app) preserves this new line
        // tslint:disable-next-line
        node.innerHTML = escape(text).replace(/\r\n?|\n/g, '<br />');
        document.body.appendChild(node);
        Clipboard._copyNode(node);
        document.body.removeChild(node);
    }

    getText(): SyncTasks.Promise<string> {
        // Not supported in web platforms. This should can be only handled in the paste event handlers
       return SyncTasks.Rejected<string>('Not supported on web');
    }

    private static _createInvisibleNode(): HTMLSpanElement {
        const node = document.createElement('span');
        node.style.position = 'absolute';
        node.style.left = '-10000px';

        const style = node.style as CSSStyleDeclaration & { userSelect?: string; MozUserSelect?: string };

        // Explicitly mark the node as selectable.
        if (style.userSelect !== undefined) {
            style.userSelect = 'text';
        }

        if (style.msUserSelect !== undefined) {
            style.msUserSelect = 'text';
        }

        if (style.webkitUserSelect !== undefined) {
            style.webkitUserSelect = 'text';
        }

        if (style.MozUserSelect !== undefined) {
            style.MozUserSelect = 'text';
        }

        return node;
    }

    private static _copyNode(node: HTMLSpanElement) {
        const selection = getSelection();
        selection.removeAllRanges();

        const range = document.createRange();
        range.selectNodeContents(node);
        selection.addRange(range);

        document.execCommand('copy');
        selection.removeAllRanges();
    }
}

export default new Clipboard();
