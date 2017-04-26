/**
* Scrollbar.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Custom scrollbar implementation for web.
*/
'use strict';
var UNIT = 'px';
var SCROLLER_MIN_SIZE = 15;
var SCROLLER_NEGATIVE_MARGIN = 30;
var LTR_OVERRIDE_CLASS = 'ltroverride';
var NEUTRAL_OVERRIDE_CLASS = 'neutraloverride';
var _nativeSrollBarWidth = -1;
var _isStyleSheetInstalled = false;
var _customScrollbarCss = "\n    .rxCustomScroll .scrollViewport > * {\n        box-sizing: border-box;\n        display: block;\n    }\n    .rxCustomScroll .rail {\n        position: absolute;\n        border-radius: 4px;\n        opacity: 0;\n        background-color: transparent;\n        transition-delay: 0, 0;\n        transition-duration: .2s, .2s;\n        transition-property: background-color, opacity;\n        transition-timing-function: linear, linear;\n        display: none;\n        box-sizing: border-box;\n    }\n    .rxCustomScroll .rail:hover {\n        background-color: #EEE;\n        border-color: #EEE;\n        opacity: .9;\n        border-radius: 6px;\n    }\n    .rxCustomScroll .rail:hover .slider {\n        border-radius: 6px;\n    }\n    .rxCustomScroll .rail .slider {\n        position: absolute;\n        border-radius: 4px;\n        background: #555;\n        box-sizing: border-box;\n        border: 1px solid #555;\n    }\n    .rxCustomScroll:not(.neutraloverride) > .scrollViewportV > * {\n        margin-right: em(-17px) !important;\n    }\n    .rxCustomScroll .railV {\n        top: 0;\n        bottom: 0;\n        right: 3px;\n        width: 8px;\n    }\n    .rxCustomScroll .railV .slider {\n        top: 10px;\n        width: 8px;\n        min-height: 15px;\n    }\n    .rxCustomScroll .railV.railBoth {\n        bottom: 15px;\n    }\n    .rxCustomScroll .railH {\n        left: 0;\n        right: 0;\n        bottom: 3px;\n        height: 8px;\n    }\n    .rxCustomScroll .railH .slider {\n        left: 10px;\n        top: -1px;\n        height: 8px;\n        min-width: 15px;\n    }\n    .rxCustomScroll .railH.railBoth {\n        right: 15px;\n    }\n    .rxCustomScroll.active .rail {\n        display: block;\n    }\n    .rxCustomScroll:hover .rail {\n        opacity: .6;\n    }\n    .rxCustomScroll:hover .rail .slider {\n        background: #AAA;\n        border-color: #AAA;\n    }\n    .rxCustomScroll.rxCustomScrollH {\n        width: auto;\n    }\n    .rxCustomScroll.rxCustomScrollV {\n        width: 100%;\n    }\n    .rxCustomScroll.scrolling .rail {\n        background-color: #EEE;\n        border-color: #EEE;\n        opacity: .9;\n        border-radius: 6px;\n    }\n    .rxCustomScroll.scrolling .rail .slider {\n        border-radius: 6px;\n        background: #AAA;\n        border-color: #AAA;\n    }\n    .rxCustomScroll.scrolling .scrollViewport > * {\n        pointer-events: none !important;\n    }\n    .rxCustomScroll.scrolling .railV {\n        width: 12px;\n    }\n    .rxCustomScroll.scrolling .railV .slider {\n        width: 12px;\n    }\n    .rxCustomScroll.scrolling .railH {\n        height: 12px;\n    }\n    .rxCustomScroll.scrolling .railH .slider {\n        height: 12px;\n    }\n    .rxCustomScroll .railV:hover {\n        width: 12px;\n    }\n    .rxCustomScroll .railV:hover .slider {\n        width: 12px;\n    }\n    .rxCustomScroll .railH:hover {\n        height: 12px;\n    }\n    .rxCustomScroll .railH:hover .slider {\n        height: 12px;\n    }\n";
var Scrollbar = (function () {
    function Scrollbar(container) {
        this._verticalBar = {};
        this._horizontalBar = {};
        this._dragging = false;
        this._scrollingVisible = false;
        this._hasHorizontal = false;
        this._hasVertical = true;
        this._stopDragCallback = this._stopDrag.bind(this);
        this._startDragVCallback = this._startDrag.bind(this, true);
        this._startDragHCallback = this._startDrag.bind(this, false);
        this._handleDragCallback = this._handleDrag.bind(this);
        this._handleWheelCallback = this._handleWheel.bind(this);
        this._handleMouseDownCallback = this._handleMouseDown.bind(this);
        this._updateCallback = this.update.bind(this);
        if (!container) {
            throw new Error('Container must not be null');
        }
        this._container = container;
    }
    Scrollbar.getNativeScrollbarWidth = function () {
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
    };
    Scrollbar._installStyleSheet = function () {
        // Have we installed the style sheet already?
        if (_isStyleSheetInstalled) {
            return;
        }
        // We set the CSS style sheet here to avoid the need
        // for users of this class to carry along another CSS
        // file.
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = _customScrollbarCss;
        }
        else {
            style.appendChild(document.createTextNode(_customScrollbarCss));
        }
        head.appendChild(style);
    };
    Scrollbar.prototype._tryLtrOverride = function () {
        var rtlbox = document.createElement('div');
        rtlbox.style.cssText = 'position: absolute; overflow-y: scroll; width: 30px; visibility: hidden;';
        rtlbox.innerHTML = '<div class="probe"></div>';
        this._container.appendChild(rtlbox);
        var probe = rtlbox.querySelector('.probe'), rtlboxRect = rtlbox.getBoundingClientRect(), probeRect = probe.getBoundingClientRect(), isLeftBound = rtlboxRect.left === probeRect.left, isRightBound = rtlboxRect.right === probeRect.right, isNeutral = isLeftBound && isRightBound;
        this._container.classList.remove(NEUTRAL_OVERRIDE_CLASS);
        this._container.classList.remove(LTR_OVERRIDE_CLASS);
        if (isNeutral) {
            this._container.classList.add(NEUTRAL_OVERRIDE_CLASS);
        }
        else if (isLeftBound) {
            this._container.classList.add(LTR_OVERRIDE_CLASS);
        }
        rtlbox.innerHTML = '';
        this._container.removeChild(rtlbox);
    };
    Scrollbar.prototype._prevent = function (e) {
        e.preventDefault();
    };
    Scrollbar.prototype._updateSliders = function () {
        if (this._hasHorizontal) {
            // Read from DOM before we write back
            var newSliderWidth = this._horizontalBar.sliderSize + UNIT;
            var newSliderLeft = this._viewport.scrollLeft * this._horizontalBar.scroll2Slider + UNIT;
            this._horizontalBar.slider.style.width = newSliderWidth;
            this._horizontalBar.slider.style.left = newSliderLeft;
        }
        if (this._hasVertical) {
            // Read from DOM before we write back
            var newSliderHeight = this._verticalBar.sliderSize + UNIT;
            var newSliderTop = this._viewport.scrollTop * this._verticalBar.scroll2Slider + UNIT;
            this._verticalBar.slider.style.height = newSliderHeight;
            this._verticalBar.slider.style.top = newSliderTop;
        }
    };
    Scrollbar.prototype._handleDrag = function (e) {
        if (this._dragIsVertical) {
            this._viewport.scrollTop = (e.pageY - this._verticalBar.dragOffset) * this._verticalBar.slider2Scroll;
        }
        else {
            this._viewport.scrollLeft = (e.pageX - this._horizontalBar.dragOffset) * this._horizontalBar.slider2Scroll;
        }
    };
    Scrollbar.prototype._startDrag = function (dragIsVertical, e) {
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
    };
    Scrollbar.prototype._stopDrag = function () {
        this._container.classList.remove('scrolling');
        window.removeEventListener('mouseup', this._stopDragCallback);
        window.removeEventListener('mousemove', this._handleDragCallback);
        this._dragging = false;
    };
    Scrollbar.prototype._handleWheel = function (e) {
        // Always prefer the vertical axis if present. User can override with the control key.
        if (this._hasVertical) {
            this._viewport.scrollTop = this._normalizeDelta(e) + this._viewport.scrollTop;
        }
        else if (this._hasHorizontal) {
            this._viewport.scrollLeft = this._normalizeDelta(e) + this._viewport.scrollLeft;
        }
    };
    Scrollbar.prototype._handleMouseDown = function (e) {
        this._prevent(e);
    };
    Scrollbar.prototype._normalizeDelta = function (e) {
        if (e.deltaY) {
            return e.deltaY > 0 ? 100 : -100;
        }
        var originalEvent = e.originalEvent;
        if (originalEvent && originalEvent.wheelDelta) {
            return originalEvent.wheelDelta;
        }
        return 0;
    };
    Scrollbar.prototype._addListeners = function () {
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
    };
    Scrollbar.prototype._removeListeners = function () {
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
    };
    Scrollbar.prototype._createDivWithClass = function (className) {
        var div = document.createElement('div');
        div.className = className;
        return div;
    };
    Scrollbar.prototype._addScrollBar = function (scrollbarInfo, railClass, hasBoth) {
        var slider = this._createDivWithClass('slider');
        scrollbarInfo.rail = this._createDivWithClass('rail ' + railClass + (hasBoth ? ' railBoth' : ''));
        scrollbarInfo.slider = slider;
        scrollbarInfo.rail.appendChild(slider);
        this._container.appendChild(scrollbarInfo.rail);
    };
    Scrollbar.prototype._addScrollbars = function () {
        var containerClass = this._hasVertical ? 'rxCustomScrollV' : 'rxCustomScrollH';
        if (this._hasVertical) {
            this._addScrollBar(this._verticalBar, 'railV', this._hasHorizontal);
        }
        if (this._hasHorizontal) {
            this._addScrollBar(this._horizontalBar, 'railH', this._hasVertical);
        }
        this._container.classList.add(containerClass);
        this._container.classList.add('rxCustomScroll');
        this._viewport = this._container.querySelector('.scrollViewport');
    };
    Scrollbar.prototype._removeScrollbars = function () {
        if (this._hasVertical) {
            this._verticalBar.rail.innerHTML = '';
            this._container.removeChild(this._verticalBar.rail);
        }
        if (this._hasHorizontal) {
            this._horizontalBar.rail.innerHTML = '';
            this._container.removeChild(this._horizontalBar.rail);
        }
    };
    Scrollbar.prototype._calcNewBarSize = function (bar, newSize, newScrollSize, hasBoth) {
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
                var railRange = newSize - SCROLLER_MIN_SIZE + bar.sliderSize;
                bar.scroll2Slider = railRange / newScrollSize;
                bar.slider2Scroll = newScrollSize / railRange;
            }
            else {
                bar.slider2Scroll = newScrollSize / newSize;
            }
        }
    };
    Scrollbar.prototype._resize = function () {
        if (this._hasHorizontal) {
            this._calcNewBarSize(this._horizontalBar, this._viewport.offsetWidth, this._viewport.scrollWidth, this._hasVertical);
        }
        if (this._hasVertical) {
            this._calcNewBarSize(this._verticalBar, this._viewport.offsetHeight, this._viewport.scrollHeight, this._hasHorizontal);
        }
    };
    Scrollbar.prototype.update = function () {
        this._resize();
        // We add one below to provide a small fudge factor because browsers round their scroll and offset values to the
        // nearest integer, and IE sometimes ends up returning a scroll and offset value that are off by one.
        if ((this._verticalBar && this._verticalBar.scrollSize > this._verticalBar.size + 1) ||
            (this._horizontalBar && this._horizontalBar.scrollSize > this._horizontalBar.size + 1)) {
            this.show();
            this._updateSliders();
        }
        else {
            this.hide();
        }
    };
    Scrollbar.prototype.show = function () {
        if (!this._scrollingVisible) {
            this._container.classList.add('active');
            this._addListeners();
            this._scrollingVisible = true;
        }
    };
    Scrollbar.prototype.hide = function () {
        if (this._scrollingVisible) {
            this._container.classList.remove('active');
            this._removeListeners();
            this._scrollingVisible = false;
        }
    };
    Scrollbar.prototype.init = function (options) {
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
    };
    Scrollbar.prototype.dispose = function () {
        this._stopDrag();
        this._container.removeEventListener('mouseenter', this._updateCallback);
        this.hide();
        this._removeScrollbars();
        // release DOM nodes
        this._container = null;
        this._viewport = null;
        this._verticalBar = null;
        this._horizontalBar = null;
    };
    return Scrollbar;
}());
exports.Scrollbar = Scrollbar;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Scrollbar;
