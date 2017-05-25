/**
* Scrollbar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Custom scrollbar implementation for web.
*/

'use strict';

import React = require('react');

var UNIT = 'px';
var SCROLLER_MIN_SIZE = 15;
var SCROLLER_NEGATIVE_MARGIN = 30;
var LTR_OVERRIDE_CLASS = 'ltroverride';
var NEUTRAL_OVERRIDE_CLASS = 'neutraloverride';

interface IScrollbarInfo {
    size?: number;
    scrollSize?: number;
    scroll2Slider?: number;
    slider2Scroll?: number;
    sliderSize?: number;
    dragOffset?: number;
    rail?: HTMLElement;
    slider?: HTMLElement;
}

export interface ScrollbarOptions {
    horizontal?: boolean;
    vertical?: boolean;
}

var _nativeSrollBarWidth: number = -1;
var _isStyleSheetInstalled: boolean = false;
const _customScrollbarCss = `
    .rxCustomScroll .scrollViewport > * {
        box-sizing: border-box;
        display: block;
    }
    .rxCustomScroll .rail {
        position: absolute;
        border-radius: 4px;
        opacity: 0;
        background-color: transparent;
        transition-delay: 0, 0;
        transition-duration: .2s, .2s;
        transition-property: background-color, opacity;
        transition-timing-function: linear, linear;
        display: none;
        box-sizing: border-box;
    }
    .rxCustomScroll .rail:hover {
        background-color: #EEE;
        border-color: #EEE;
        opacity: .9;
        border-radius: 6px;
    }
    .rxCustomScroll .rail:hover .slider {
        border-radius: 6px;
    }
    .rxCustomScroll .rail .slider {
        position: absolute;
        border-radius: 4px;
        background: #555;
        box-sizing: border-box;
        border: 1px solid #555;
    }
    .rxCustomScroll:not(.neutraloverride) > .scrollViewportV > * {
        margin-right: em(-17px) !important;
    }
    .rxCustomScroll .railV {
        top: 0;
        bottom: 0;
        right: 3px;
        width: 8px;
    }
    .rxCustomScroll .railV .slider {
        top: 10px;
        width: 8px;
        min-height: 15px;
    }
    .rxCustomScroll .railV.railBoth {
        bottom: 15px;
    }
    .rxCustomScroll .railH {
        left: 0;
        right: 0;
        bottom: 3px;
        height: 8px;
    }
    .rxCustomScroll .railH .slider {
        left: 10px;
        top: -1px;
        height: 8px;
        min-width: 15px;
    }
    .rxCustomScroll .railH.railBoth {
        right: 15px;
    }
    .rxCustomScroll.active .rail {
        display: block;
    }
    .rxCustomScroll:hover .rail {
        opacity: .6;
    }
    .rxCustomScroll:hover .rail .slider {
        background: #AAA;
        border-color: #AAA;
    }
    .rxCustomScroll.rxCustomScrollH {
        width: auto;
    }
    .rxCustomScroll.rxCustomScrollV {
        width: 100%;
    }
    .rxCustomScroll.scrolling .rail {
        background-color: #EEE;
        border-color: #EEE;
        opacity: .9;
        border-radius: 6px;
    }
    .rxCustomScroll.scrolling .rail .slider {
        border-radius: 6px;
        background: #AAA;
        border-color: #AAA;
    }
    .rxCustomScroll.scrolling .scrollViewport > * {
        pointer-events: none !important;
    }
    .rxCustomScroll.scrolling .railV {
        width: 12px;
    }
    .rxCustomScroll.scrolling .railV .slider {
        width: 12px;
    }
    .rxCustomScroll.scrolling .railH {
        height: 12px;
    }
    .rxCustomScroll.scrolling .railH .slider {
        height: 12px;
    }
    .rxCustomScroll .railV:hover {
        width: 12px;
    }
    .rxCustomScroll .railV:hover .slider {
        width: 12px;
    }
    .rxCustomScroll .railH:hover {
        height: 12px;
    }
    .rxCustomScroll .railH:hover .slider {
        height: 12px;
    }
`;

export class Scrollbar {
    private _container: HTMLElement;
    private _verticalBar: IScrollbarInfo = {};
    private _horizontalBar: IScrollbarInfo = {};
    private _viewport: HTMLElement;
    private _dragging = false;
    private _dragIsVertical: boolean;
    private _scrollingVisible = false;
    private _hasHorizontal = false;
    private _hasVertical = true;
    private _stopDragCallback = this._stopDrag.bind(this);
    private _startDragVCallback = this._startDrag.bind(this, true);
    private _startDragHCallback = this._startDrag.bind(this, false);
    private _handleDragCallback = this._handleDrag.bind(this);
    private _handleWheelCallback = this._handleWheel.bind(this);
    private _handleMouseDownCallback = this._handleMouseDown.bind(this);
    private _updateCallback = this.update.bind(this);

    static getNativeScrollbarWidth() {
        // Have we cached the value alread?
        if (_nativeSrollBarWidth >= 0) {
            return _nativeSrollBarWidth;
        }

        var inner = document.createElement('p');
        inner.style.width = '100%';
        inner.style.height = '100%';

        var outer = document.createElement('div');
        outer.style.position = 'absolute';
        outer.style.top = '0';
        outer.style.left = '0';
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.height = '100px';
        outer.style.overflow = 'hidden';
        outer.appendChild(inner);

        document.body.appendChild(outer);

        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 === w2) {
            w2 = outer.clientWidth;
        }

        document.body.removeChild(outer);

        _nativeSrollBarWidth = w1 - w2;

        return _nativeSrollBarWidth;
    }

    static _installStyleSheet() {
        // Have we installed the style sheet already?
        if (_isStyleSheetInstalled) {
            return;
        }

        // We set the CSS style sheet here to avoid the need
        // for users of this class to carry along another CSS
        // file.
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style') as any;

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = _customScrollbarCss;
        } else {
            style.appendChild(document.createTextNode(_customScrollbarCss));
        }

        head.appendChild(style);
    }

    constructor(container: HTMLElement) {
        if (!container) {
            throw new Error('Container must not be null');
        }

        this._container = container;
    }

    private _tryLtrOverride() {
        var rtlbox = document.createElement('div');
        rtlbox.style.cssText = 'position: absolute; overflow-y: scroll; width: 30px; visibility: hidden;';
        rtlbox.innerHTML = '<div class="probe"></div>';
        this._container.appendChild(rtlbox);
        var probe = rtlbox.querySelector('.probe'),
            rtlboxRect = rtlbox.getBoundingClientRect(),
            probeRect = probe.getBoundingClientRect(),
            isLeftBound = rtlboxRect.left === probeRect.left,
            isRightBound = rtlboxRect.right === probeRect.right,
            isNeutral = isLeftBound && isRightBound;

        this._container.classList.remove(NEUTRAL_OVERRIDE_CLASS);
        this._container.classList.remove(LTR_OVERRIDE_CLASS);

        if (isNeutral) {
            this._container.classList.add(NEUTRAL_OVERRIDE_CLASS);
        } else if (isLeftBound) {
            this._container.classList.add(LTR_OVERRIDE_CLASS);
        }

        rtlbox.innerHTML = '';
        this._container.removeChild(rtlbox);
    }

    private _prevent(e: React.SyntheticEvent) {
        e.preventDefault();
    }

    private _updateSliders() {
        if (this._hasHorizontal) {
            // Read from DOM before we write back
            const newSliderWidth = this._horizontalBar.sliderSize + UNIT;
            const newSliderLeft = this._viewport.scrollLeft * this._horizontalBar.scroll2Slider + UNIT;
            this._horizontalBar.slider.style.width = newSliderWidth;
            this._horizontalBar.slider.style.left = newSliderLeft;
        }

        if (this._hasVertical) {
            // Read from DOM before we write back
            const newSliderHeight = this._verticalBar.sliderSize + UNIT;
            const newSliderTop = this._viewport.scrollTop * this._verticalBar.scroll2Slider + UNIT;
            this._verticalBar.slider.style.height = newSliderHeight;
            this._verticalBar.slider.style.top = newSliderTop;
        }
    }

    private _handleDrag(e: React.MouseEvent) {
        if (this._dragIsVertical) {
            this._viewport.scrollTop = (e.pageY - this._verticalBar.dragOffset) * this._verticalBar.slider2Scroll;
        } else {
            this._viewport.scrollLeft = (e.pageX - this._horizontalBar.dragOffset) * this._horizontalBar.slider2Scroll;
        }
    }

    private _startDrag(dragIsVertical: boolean, e: React.MouseEvent) {
        if (!this._dragging) {
            window.addEventListener('mouseup', this._stopDragCallback);
            window.addEventListener('mousemove', this._handleDragCallback);
            this._container.classList.add('scrolling');
            if (this._hasHorizontal) {
                this._horizontalBar.dragOffset = e.pageX - this._horizontalBar.slider.offsetLeft;
            }
            if (this._hasVertical) {
                this._verticalBar.dragOffset = e.pageY - this._verticalBar.slider.offsetTop;
            }
            this._dragging = true;
            this._dragIsVertical = dragIsVertical;
        }
        this._prevent(e);
    }

    private _stopDrag() {
        this._container.classList.remove('scrolling');
        window.removeEventListener('mouseup', this._stopDragCallback);
        window.removeEventListener('mousemove', this._handleDragCallback);
        this._dragging = false;
    }

    private _handleWheel(e: React.WheelEvent) {
        // Always prefer the vertical axis if present. User can override with the control key.
        if (this._hasVertical) {
            this._viewport.scrollTop = this._normalizeDelta(e) + this._viewport.scrollTop;
        } else if (this._hasHorizontal) {
            this._viewport.scrollLeft = this._normalizeDelta(e) + this._viewport.scrollLeft;
        }
    }

    private _handleMouseDown(e: React.MouseEvent) {
        this._prevent(e);
    }

    private _normalizeDelta(e: React.WheelEvent) {
        if (e.deltaY) {
            return e.deltaY > 0 ? 100 : -100;
        }
        var originalEvent = (e as any).originalEvent;
        if (originalEvent && originalEvent.wheelDelta) {
            return originalEvent.wheelDelta;
        }
        return 0;
    }

    private _addListeners() {
        if (this._hasVertical) {
            this._verticalBar.slider.addEventListener('mousedown', this._startDragVCallback);
            this._verticalBar.rail.addEventListener('wheel', this._handleWheelCallback);
            this._verticalBar.rail.addEventListener('mousedown', this._handleMouseDownCallback);
        }

        if (this._hasHorizontal) {
            this._horizontalBar.slider.addEventListener('mousedown', this._startDragHCallback);
            this._horizontalBar.rail.addEventListener('wheel', this._handleWheelCallback);
            this._horizontalBar.rail.addEventListener('mousedown', this._handleMouseDownCallback);
        }
    }

    private _removeListeners() {
        if (this._hasVertical) {
            this._verticalBar.slider.removeEventListener('mousedown', this._startDragVCallback);
            this._verticalBar.rail.removeEventListener('wheel', this._handleWheelCallback);
            this._verticalBar.rail.removeEventListener('mousedown', this._handleMouseDownCallback);
        }

        if (this._hasHorizontal) {
            this._horizontalBar.slider.removeEventListener('mousedown', this._startDragHCallback);
            this._horizontalBar.rail.removeEventListener('wheel', this._handleWheelCallback);
            this._horizontalBar.rail.removeEventListener('mousedown', this._handleMouseDownCallback);
        }
    }

    private _createDivWithClass(className: string): HTMLElement {
        const div = document.createElement('div');
        div.className = className;
        return div;
    }

    private _addScrollBar(scrollbarInfo: IScrollbarInfo, railClass: string, hasBoth: boolean) {
        const slider = this._createDivWithClass('slider');

        scrollbarInfo.rail = this._createDivWithClass('rail ' + railClass + (hasBoth ? ' railBoth' : ''));
        scrollbarInfo.slider = slider;
        scrollbarInfo.rail.appendChild(slider);

        this._container.appendChild(scrollbarInfo.rail);
    }

    private _addScrollbars() {
        let containerClass = this._hasVertical ? 'rxCustomScrollV' : 'rxCustomScrollH';

        if (this._hasVertical) {
            this._addScrollBar(this._verticalBar, 'railV', this._hasHorizontal);
        }

        if (this._hasHorizontal) {
            this._addScrollBar(this._horizontalBar, 'railH', this._hasVertical);
        }

        this._container.classList.add(containerClass);
        this._container.classList.add('rxCustomScroll');
        this._viewport = this._container.querySelector('.scrollViewport') as HTMLElement;
    }

    private _removeScrollbars() {
        if (this._hasVertical) {
            this._verticalBar.rail.innerHTML = '';
            this._container.removeChild(this._verticalBar.rail);
        }

        if (this._hasHorizontal) {
            this._horizontalBar.rail.innerHTML = '';
            this._container.removeChild(this._horizontalBar.rail);
        }
    }

    private _calcNewBarSize(bar: IScrollbarInfo, newSize: number, newScrollSize: number, hasBoth: boolean) {
        if (hasBoth) {
            newSize -= SCROLLER_NEGATIVE_MARGIN;
            newScrollSize -= SCROLLER_NEGATIVE_MARGIN - Scrollbar.getNativeScrollbarWidth();
        }

        if (newScrollSize !== bar.scrollSize || newSize !== bar.size) {
            bar.size = newSize;
            bar.scrollSize = newScrollSize;
            bar.scroll2Slider = newSize / newScrollSize;
            bar.sliderSize = newSize * bar.scroll2Slider;

            // Don't allow the sliders to overlap.
            if (hasBoth) {
                bar.sliderSize = Math.max(bar.sliderSize - SCROLLER_NEGATIVE_MARGIN + Scrollbar.getNativeScrollbarWidth(), 0);
            }

            if (bar.sliderSize < SCROLLER_MIN_SIZE) {
                const railRange = newSize - SCROLLER_MIN_SIZE + bar.sliderSize;
                bar.scroll2Slider = railRange / newScrollSize;
                bar.slider2Scroll = newScrollSize / railRange;
            } else {
                bar.slider2Scroll = newScrollSize / newSize;
            }
        }
    }

    private _resize() {
        if (this._hasHorizontal) {
            this._calcNewBarSize(this._horizontalBar, this._viewport.offsetWidth, this._viewport.scrollWidth, this._hasVertical);
        }

        if (this._hasVertical) {
            this._calcNewBarSize(this._verticalBar, this._viewport.offsetHeight, this._viewport.scrollHeight, this._hasHorizontal);
        }
    }

    update () {
        this._resize();

        // We add one below to provide a small fudge factor because browsers round their scroll and offset values to the
        // nearest integer, and IE sometimes ends up returning a scroll and offset value that are off by one.
        if ((this._verticalBar && this._verticalBar.scrollSize > this._verticalBar.size + 1) ||
                (this._horizontalBar && this._horizontalBar.scrollSize > this._horizontalBar.size + 1)) {
            this.show();
            this._updateSliders();
        } else {
            this.hide();
        }
    }

    show() {
        if (!this._scrollingVisible) {
            this._container.classList.add('active');
            this._addListeners();
            this._scrollingVisible = true;
        }
    }

    hide() {
        if (this._scrollingVisible) {
            this._container.classList.remove('active');
            this._removeListeners();
            this._scrollingVisible = false;
        }
    }

    init(options?: ScrollbarOptions) {
        if (options) {
            this._hasHorizontal = options.horizontal;

            // Only if vertical is explicitly false as opposed to null, set it to false (default is true)
            if (options.vertical === false) {
                this._hasVertical = options.vertical;
            }
        }
        Scrollbar._installStyleSheet();
        this._tryLtrOverride();
        this._addScrollbars();
        this.show();
        this.update();
        this._container.addEventListener('mouseenter', this._updateCallback);
    }

    dispose() {
        this._stopDrag();
        this._container.removeEventListener('mouseenter', this._updateCallback);
        this.hide();
        this._removeScrollbars();
        // release DOM nodes
        this._container = null;
        this._viewport = null;
        this._verticalBar = null;
        this._horizontalBar = null;
    }
}

export default Scrollbar;
