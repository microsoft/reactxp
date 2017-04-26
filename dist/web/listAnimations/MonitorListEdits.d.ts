import React = require('react');
export interface IAddEdit {
    element: React.Component<any, any> | Element;
}
export interface IMoveEdit {
    element: React.Component<any, any> | Element;
    leftDelta: number;
    topDelta: number;
}
export interface IRemoveEdit {
    element: React.Component<any, any> | Element;
    leftDelta: number;
    topDelta: number;
}
export interface IEdits {
    added: IAddEdit[];
    moved: IMoveEdit[];
    removed: IRemoveEdit[];
}
export interface MonitorListEditsProps extends React.HTMLAttributes {
    componentWillAnimate: (edits: IEdits, done: () => void) => void;
}
export declare class MonitorListEdits extends React.Component<MonitorListEditsProps, {}> {
    private _itemRefs;
    private _refReplacementCache;
    private _isMounted;
    private _childrenKeys;
    private _childrenMap;
    private _childrenToRender;
    private _phase;
    private _willAnimatePhaseInfo;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(): boolean;
    componentWillUpdate(nextProps: MonitorListEditsProps): void;
    render(): JSX.Element;
    componentDidUpdate(prevProps: MonitorListEditsProps): void;
    private _saveRef(reactElement, refValue);
}
