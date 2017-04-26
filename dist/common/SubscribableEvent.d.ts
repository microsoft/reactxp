export declare class SubscriptionToken {
    private _event;
    private _callback;
    constructor(_event: SubscribableEvent<any>, _callback: (...args: any[]) => boolean | void);
    unsubscribe(): void;
}
export declare class SubscribableEvent<F extends {
    (...args: any[]): boolean | void;
}> {
    private _subscribers;
    constructor();
    dispose(): void;
    subscribe(callback: F): SubscriptionToken;
    unsubscribe(callback: F): void;
    fire: F;
}
