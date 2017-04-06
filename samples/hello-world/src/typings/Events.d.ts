/**
 * Events.ts
 * Author: Adrian Potra
 * Copyright: Microsoft 2015
 *
 * Event sources and subscriptions.
 */

declare module 'events' {
    // Defines the interface for event sources
    export interface Source<E, D> {
        subscribe(event: E, callback: Callback<D>): Subscription;
    }

    // Defines the interface for managing the subscription lifetime
    export interface Subscription {
        dispose(): void;
    }

    interface Callback<D> {
        (eventData: D): void;
    }
}