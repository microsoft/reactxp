/**
* StyleLeakDetector.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Detects style memory-leaks in react-native.
* To fix warning you could:
*  - use not cached styles by providing cacheStyle == falst to Style.create... method
*  - for colors you could use StylesRegestry component
*  - for rx component you could temporary disable validation by calling pause method and restore by calling resume,
*    but please make sure that it doesn't leaks first please
*/

import _ = require('./lodashMini');

import AppConfig from './AppConfig';

import Types = require('../common/Types');

export class StyleLeakDetector {
    private _fingerprintRegistry: {[key: string]: string} = {};

    private _getFingerprint<T extends Types.ViewAndImageCommonStyle>(object: T): string {
        return JSON.stringify(this._sortAny(object));
    }

    /**
     * We need to sort objects before using JSON.stringify as otherwise objects
     * {a: 1, b: 2} and {b: 2, a: 1} would have a different fingerprints
     */
    private _sortAny(object: any): any {
        if (object instanceof Array) {
            return this._sortArray(object);
        } else if (object instanceof Object) {
            return this._sortObject(object);
        } else {
            return object;
        }
    }

    private _sortObject(object: _.Dictionary<any>) {
        let result: _.Dictionary<any> = {};
        let keys: string [] = [];
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        keys = _.sortBy(keys);
        const keysLength = keys.length;
        for (let i: number = 0; i < keysLength; i++) {
            let key: any = keys[i];
            let value: any = object[key];
            result[key] = this._sortAny(value);
        }

        return result;
    }

    private _sortArray(object: any[]): any[] {
        const length = object.length;
        for (let i: number = 0; i < length; i++) {
            object[i] = this._sortAny(object[i]);
        }

        return object;
    }

    protected isDisabled(): boolean {
        return false;
    }

    detectLeaks<T extends Types.ViewAndImageCommonStyle>(style: T): void {
        if (AppConfig.isDevelopmentMode() && !this.isDisabled()) {
            const error: any = new Error();
            // we detect leaks on chrome and firefox only, other browser have now this member
            const stack = error.stack;
            if (stack) {
                const styleAllocationId = stack + this._getFingerprint(style);
                const firstAllocation = this._fingerprintRegistry[styleAllocationId];
                if (firstAllocation) {
                    console.warn('Possible style leak of: ', style, 'first allocation: ', firstAllocation);
                } else {
                    this._fingerprintRegistry[styleAllocationId] = stack;
                }
            }
        }
    }
}

var instance = new StyleLeakDetector();
export default instance;
