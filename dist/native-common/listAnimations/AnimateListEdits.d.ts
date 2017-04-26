import React = require('react');
import RN = require('react-native');
export interface AnimateListEditsProps extends RN.ViewProps {
    animateChildEnter?: boolean;
    animateChildLeave?: boolean;
    animateChildMove?: boolean;
}
export declare class AnimateListEdits extends React.Component<AnimateListEditsProps, {}> {
    private _childrenKeys;
    private _childrenEdited(prevChildrenKeys, nextChildrenKeys);
    componentWillUpdate(nextProps: AnimateListEditsProps, nextState: {}): void;
    render(): JSX.Element;
    setNativeProps(nativeProps: AnimateListEditsProps): void;
}
export default AnimateListEdits;
