/**
* SubscribableEvent.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* A simple strongly-typed pub/sub/fire eventing system.
*/

import _ = require('./lodashMini');

export class SubscriptionToken {
    constructor(private _event: SubscribableEvent<any>, 
        private _callback: (...args: any[]) => boolean|void) {
    }
    
    unsubscribe() {
        this._event.unsubscribe(this._callback);
    }
}

export class SubscribableEvent<F extends { (...args: any[]): boolean|void }> {
    private _subscribers: Function[];

    constructor() {
        this._subscribers = [];
    }

    dispose() {
        this._subscribers = [];
    }

    subscribe(callback: F): SubscriptionToken {
        this._subscribers.push(callback);
        
        return new SubscriptionToken(this, callback);
    }

    unsubscribe(callback: F) {
        _.pull(this._subscribers, callback);
    }

    fire: F = <any> ((...args: any[]) => {
        // Clone the array so original can be modified by handlers.
        const subs = _.clone(this._subscribers);

        // Execute handlers in the reverse order in which they
        // were registered.
        for (let i = subs.length - 1; i >= 0; i--) {
            if (subs[i].apply(null, args)) {
                // If the value was handled, early out.
                return true;
            }
        }

        return false;
    });
}
