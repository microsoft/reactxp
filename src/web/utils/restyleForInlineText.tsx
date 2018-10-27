/**
 * restyleForInlineText.tsx
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * When a ReactXP component appears as a child of an RX.Text, it needs to be styled
 * specially so that it appears inline with the text rather than introducing line
 * breaks.
 *
 * This utility restyles the component that is passed to it as inline so it flows
 * with the text. When a ReactXP component is a child of a text, pass the return value
 * of its render method to this utility. See RX.View for an example.
 */

import * as assert from 'assert';
import * as React from 'react';

import { assign } from './../utils/lodashMini';

function restyleForInlineText(reactElement: React.ReactElement<any>) {
    const style = reactElement.props.style;
    assert(
        style &&
        style.width !== undefined &&
        style.height !== undefined,
        'Children of an <RX.Text> must have a defined height and width'
    );

    /*
      We'll use display: inline-block for inline element because
      inline-flex will introduce new lines into the text that is
      copied to the clipboard. In most our use-cases inline-block
      is fine and should behave same as inline-flex.

      Example:
        <flex>
          <inline> // InlineView
            <inline text node>
            <inline-flex> // set by this function - will introduce new line when copied
              <inline transparent text with emoticon text representation>
              <inline-block sprite clipping element>
                <inline-block sprite background texture>
            <inline text node>

        result into selection: "[text node][transparent text][new line][text node]"
        with inline-block this will properly resolve as "[text node][transparent text][text node]"
    */

    return React.cloneElement(reactElement, {
        style: assign({}, style, {
            display: 'inline-block',

            // Reset the line height so the value from outside
            // the inlined item doesn't cascade into this element.
            lineHeight: 'normal'
        })
    });
}

export default restyleForInlineText;
