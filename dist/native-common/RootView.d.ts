/**
* RootView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* The top-most view that's used for proper layering or modals and popups.
*/
import React = require('react');
import RN = require('react-native');
export interface RootViewState {
    mainView?: RN.ReactElement<any>;
    announcementText?: string;
}
export declare class RootView extends React.Component<{}, RootViewState> {
    private _changeListener;
    private _frontLayerViewChangedSubscription;
    private _newAnnouncementEventChangedSubscription;
    constructor();
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private _onChange();
    private _getStateFromStore();
}
export default RootView;
