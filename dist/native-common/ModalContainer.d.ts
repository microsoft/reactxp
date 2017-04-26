/**
* ModalContainer.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* RN-specific implementation of the cross-platform Modal abstraction.
*/
import React = require('react');
import Types = require('../common/Types');
export interface ModalContainerProps extends Types.CommonProps {
}
export declare class ModalContainer extends React.Component<ModalContainerProps, null> {
    constructor(props: ModalContainerProps);
    render(): JSX.Element;
}
export default ModalContainer;
