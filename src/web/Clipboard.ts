/**
* Clipboard.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Clipboard abstraction.
*/

import RX = require('../common/Interfaces');
import SyncTasks = require('synctasks');

export class Clipboard extends RX.Clipboard {
    public setText(text: string) {
        let node = Clipboard._createInvisibleNode();
        // Replace carriage return /r with /r/n, so that pasting outside browser environment
        // (eg in a native app) preserves this new line
        text = text.replace(/\r/g, '\r\n');
        node.innerHTML = text;
        document.body.appendChild(node);
        Clipboard._copyNode(node);
        document.body.removeChild(node);
    }

    public getText(): SyncTasks.Promise<string> {
        // Not supported in web platforms. This should can be only handled in the paste event handlers
       return SyncTasks.Rejected<string>('Not supported on web');
    }

    private static _createInvisibleNode(): HTMLTextAreaElement {
        const node = document.createElement('textarea');
        node.style.position = 'absolute';
        node.style.left = '-10000px';

        const style = node.style as CSSStyleDeclaration & { userSelect?: string; MozUserSelect?: string; };

        // Explicitly mark the node as selectable.
        if (style['userSelect'] !== undefined) {
            style['userSelect'] = 'text';
        }

        if (style['msUserSelect'] !== undefined) {
            style['msUserSelect'] = 'text';
        }

        if (style['webkitUserSelect'] !== undefined) {
            style['webkitUserSelect'] = 'text';
        }

        if (style['MozUserSelect'] !== undefined) {
            style['MozUserSelect'] = 'text';
        }

        return node;
    }

    private static _copyNode(node: HTMLTextAreaElement) {
        const selection = getSelection();
        selection.removeAllRanges();

        node.select();

        document.execCommand('copy');
        selection.removeAllRanges();
    }
}

export default new Clipboard();
