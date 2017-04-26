import React = require('react');
import Types = require('../common/Types');
export interface RootViewProps {
    mainView?: React.ReactNode;
    modal?: React.ReactElement<Types.ViewProps>;
    activePopupOptions?: Types.PopupOptions;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
    onDismissPopup?: () => void;
    keyBoardFocusOutline?: string;
    mouseFocusOutline?: string;
}
export interface RootViewState {
    isMeasuringPopup?: boolean;
    popupWidth?: number;
    popupHeight?: number;
    anchorPosition?: Types.PopupPosition;
    anchorOffset?: number;
    popupTop?: number;
    popupLeft?: number;
    constrainedPopupWidth?: number;
    constrainedPopupHeight?: number;
    isMouseInPopup?: boolean;
    focusClass?: string;
    announcementText?: string;
}
export declare class RootView extends React.Component<RootViewProps, RootViewState> {
    private _hidePopupTimer;
    private _respositionPopupTimer;
    private _clickHandlerInstalled;
    private _lockForContextMenu;
    private _keyboardHandlerInstalled;
    private _lockTimeout;
    private _newAnnouncementEventChangedSubscription;
    constructor(props: RootViewProps);
    private _getInitialState();
    componentWillReceiveProps(prevProps: RootViewProps): void;
    componentDidUpdate(prevProps: RootViewProps, prevState: RootViewState): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private _tryClosePopup;
    private _determineIfClickOnElement(elementReference, eventSource);
    private _onMouseDown;
    private _onKeyDown;
    private _onKeyUp;
    private _onMouseEnter(e);
    private _onMouseLeave(e);
    private _startHidePopupTimer();
    private _stopHidePopupTimer();
    private _dismissPopup();
    private _startRepositionPopupTimer();
    private _stopRepositionPopupTimer();
    private _recalcPosition();
    private _recalcInnerPosition(anchorRect, newState);
}
export default RootView;
