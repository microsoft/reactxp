/**
* Accessibility.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web wrapper for subscribing or querying the current state of the
* screen reader.
*/
import { Accessibility as CommonAccessibility } from '../common/Accessibility';
export declare class Accessibility extends CommonAccessibility {
    isScreenReaderEnabled(): boolean;
}
declare var _default: Accessibility;
export default _default;
