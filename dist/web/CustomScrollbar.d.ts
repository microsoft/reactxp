export interface ScrollbarOptions {
    horizontal?: boolean;
    vertical?: boolean;
}
export declare class Scrollbar {
    private _container;
    private _verticalBar;
    private _horizontalBar;
    private _viewport;
    private _dragging;
    private _dragIsVertical;
    private _scrollingVisible;
    private _hasHorizontal;
    private _hasVertical;
    private _stopDragCallback;
    private _startDragVCallback;
    private _startDragHCallback;
    private _handleDragCallback;
    private _handleWheelCallback;
    private _handleMouseDownCallback;
    private _updateCallback;
    static getNativeScrollbarWidth(): number;
    static _installStyleSheet(): void;
    constructor(container: HTMLElement);
    private _tryLtrOverride();
    private _prevent(e);
    private _updateSliders();
    private _handleDrag(e);
    private _startDrag(dragIsVertical, e);
    private _stopDrag();
    private _handleWheel(e);
    private _handleMouseDown(e);
    private _normalizeDelta(e);
    private _addListeners();
    private _removeListeners();
    private _createDivWithClass(className);
    private _addScrollBar(scrollbarInfo, railClass, hasBoth);
    private _addScrollbars();
    private _removeScrollbars();
    private _calcNewBarSize(bar, newSize, newScrollSize, hasBoth);
    private _resize();
    update(): void;
    show(): void;
    hide(): void;
    init(options?: ScrollbarOptions): void;
    dispose(): void;
}
export default Scrollbar;
