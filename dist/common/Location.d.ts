/**
* Location.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Methods to fetch the user's location.
*/
import RX = require('../common/Interfaces');
import SyncTasks = require('synctasks');
import Types = require('../common/Types');
export declare class Location extends RX.Location {
    setConfiguration(config: RX.LocationConfiguration): void;
    isAvailable(): boolean;
    getCurrentPosition(options?: PositionOptions): SyncTasks.Promise<Position>;
    watchPosition(successCallback: Types.LocationSuccessCallback, errorCallback?: Types.LocationFailureCallback, options?: PositionOptions): SyncTasks.Promise<Types.LocationWatchId>;
    clearWatch(watchID: Types.LocationWatchId): void;
}
declare var _default: Location;
export default _default;
