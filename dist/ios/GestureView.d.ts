/**
* GestureView.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* iOS-specific implementation of GestureView component.
*/
import { GestureView as BaseGestureView } from '../native-common/GestureView';
import Types = require('../common/Types');
export declare class GestureView extends BaseGestureView {
    constructor(props: Types.GestureViewProps);
    protected _getPreferredPanRatio(): number;
    protected _getEventTimestamp(e: Types.TouchEvent): number;
}
export default GestureView;
