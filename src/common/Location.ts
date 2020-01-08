/**
 * Location.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Methods to fetch the user's location.
 */

import * as RX from './Interfaces';
import { Defer } from './utils/PromiseDefer';

export class Location extends RX.Location {
    setConfiguration(config: RX.LocationConfiguration): void {
        if (this.isAvailable()) {
            // Work around the fact "geolocation" type definition in ES6 lib
            // doesn't declare the RN-specific setRNConfiguration setter.
            const configSetter: (config: RX.LocationConfiguration) => void =
                (navigator.geolocation as any).setRNConfiguration;
            if (configSetter) {
                configSetter(config);
            }
        }
    }

    // Check if a geolocation service is available.
    isAvailable(): boolean {
        return !!('geolocation' in navigator);
    }

    // Get the current location of the user. This method returns a promise that either
    // resolves to the position or rejects with an error code.
    getCurrentPosition(options?: PositionOptions): Promise<Position> {
        if (!this.isAvailable()) {
            const error: PositionError = {
                code: RX.Types.LocationErrorType.PositionUnavailable,
                message: 'Position unavailable because device does not support it.',
                PERMISSION_DENIED: 0,
                POSITION_UNAVAILABLE: 1,
                TIMEOUT: 0,
            };
            return Promise.reject(error);
        }

        const deferred = new Defer<Position>();
        let reportedError = false;

        navigator.geolocation.getCurrentPosition((position: Position) => {
            deferred.resolve(position);
        }, (error: PositionError) => {
            // We need to protect against a known bug on some platforms where
            // a timeout error is reported after other types of errors (e.g.
            // the user hasn't granted access).
            if (!reportedError) {
                deferred.reject(error);
                reportedError = true;
            }
        }, options);

        return deferred.promise();
    }

    // Get the current location of the user on a repeating basis. This method returns
    // a promise that resolves to a watcher id or rejects with an error code. If resolved,
    // future locations and errors will be piped through the provided callbacks.
    watchPosition(successCallback: RX.Types.LocationSuccessCallback, errorCallback?: RX.Types.LocationFailureCallback,
            options?: PositionOptions): Promise<RX.Types.LocationWatchId> {
        if (!this.isAvailable()) {
            return Promise.reject<RX.Types.LocationWatchId>(RX.Types.LocationErrorType.PositionUnavailable);
        }

        const watchId = navigator.geolocation.watchPosition((position: Position) => {
            successCallback(position);
        }, (error: PositionError) => {
            if (errorCallback) {
                errorCallback(error.code as RX.Types.LocationErrorType);
            }
        }, options);

        return Promise.resolve<RX.Types.LocationWatchId>(watchId);
    }

    // Clears a location watcher from watchPosition.
    clearWatch(watchID: RX.Types.LocationWatchId): void {
        navigator.geolocation.clearWatch(watchID);
    }
}

export default new Location();
