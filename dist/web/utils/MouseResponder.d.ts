import Types = require('../../common/Types');
export interface MouseResponderConfig {
    id: number;
    target: HTMLElement;
    shouldBecomeFirstResponder?: (event: MouseEvent, gestureState: Types.PanGestureState) => boolean;
    onMove?: (event: MouseEvent, gestureState: Types.PanGestureState) => void;
    onTerminate?: (event: MouseEvent, gestureState: Types.PanGestureState) => void;
}
export interface MouseResponderSubscription {
    dispose(): void;
}
export default class MouseResponder {
    private static _currentResponder;
    private static _pendingGestureState;
    private static _initialized;
    private static _responders;
    static create(config: MouseResponderConfig): MouseResponderSubscription;
    private static _initializeEventHandlers();
    private static _removeEventHandlers();
    private static _onMouseDown;
    private static _onMouseMove;
    private static _onMouseUp;
    private static _calcVelocity;
}
