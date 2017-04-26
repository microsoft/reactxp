import React = require('react');
import Types = require('../common/Types');
export interface PopupContainerViewProps extends Types.CommonProps {
    activePopupOptions: Types.PopupOptions;
    anchorHandle: number;
    onDismissPopup?: () => void;
}
export interface PopupContainerViewState {
    isMeasuringPopup?: boolean;
    popupWidth?: number;
    popupHeight?: number;
    anchorPosition?: Types.PopupPosition;
    anchorOffset?: number;
    popupTop?: number;
    popupLeft?: number;
    constrainedPopupWidth?: number;
    constrainedPopupHeight?: number;
}
export declare class PopupContainerView extends React.Component<PopupContainerViewProps, PopupContainerViewState> {
    private _isMounted;
    private _viewHandle;
    private _respositionPopupTimer;
    constructor(props: PopupContainerViewProps);
    private _getInitialState();
    componentWillReceiveProps(prevProps: PopupContainerViewProps): void;
    componentDidUpdate(prevProps: PopupContainerViewProps, prevState: PopupContainerViewState): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private _recalcPosition();
    private _recalcPositionFromLayoutData(anchorRect, popupRect);
    private _recalcInnerPosition(anchorRect, newState);
    private _dismissPopup();
    private _startRepositionPopupTimer();
    private _stopRepositionPopupTimer();
}
export default PopupContainerView;
