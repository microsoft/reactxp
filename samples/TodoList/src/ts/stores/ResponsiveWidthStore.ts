/**
* ResponsiveWidthStore.ts
* Copyright: Microsoft 2018
*
* Singleton store to hold the responsive width property for the app.
*/

import * as RX from 'reactxp';
import { AutoSubscribeStore, autoSubscribeWithKey, disableWarnings, StoreBase } from 'resub';

import { ResponsiveWidth, WidthBreakPoints } from '../models/ResponsiveWidthModels';

export enum TriggerKeys {
    ResponsiveWidth,
    Width,
    Height
}

const MainWindowId = 'MainWindowId';

@AutoSubscribeStore
class ResponsiveWidthStore extends StoreBase {
    private _rawWidth: { [index: string]: number } = { [MainWindowId]: 0 };
    private _rawHeight: { [index: string]: number } = { [MainWindowId]: 0 };
    private _responsiveWidth: { [index: string]: ResponsiveWidth } = { [MainWindowId]: ResponsiveWidth.Medium };

    constructor() {
        super();

        // Conditionally seed the window size when it isn't already set.
        if (!this._rawWidth[MainWindowId] || !this._rawHeight[MainWindowId]) {
            const { width, height } = RX.UserInterface.measureWindow();
            this.putWindowSize(width, height);
        }
    }

    static responsiveWidthForWidth(width: number): ResponsiveWidth {
        if (width < WidthBreakPoints.tiny) {
            return ResponsiveWidth.Tiny;
        } else if (width >= WidthBreakPoints.tiny && width < WidthBreakPoints.small) {
            return ResponsiveWidth.Small;
        } else if (width >= WidthBreakPoints.small && width < WidthBreakPoints.medium) {
            return ResponsiveWidth.Medium;
        } else {
            return ResponsiveWidth.Large;
        }
    }

    @disableWarnings
    putWindowSize(width: number, height: number, rootViewId: string = MainWindowId) {
        const triggers: TriggerKeys[] = [];

        // No need to re-calc when the width is unchanged
        const widthUpdated = this._rawWidth[rootViewId] !== width;
        if (widthUpdated) {
            this._rawWidth[rootViewId] = width;
            triggers.push(TriggerKeys.Width);

            const responsiveWidth = ResponsiveWidthStore.responsiveWidthForWidth(width);
            if (this._responsiveWidth[rootViewId] !== responsiveWidth) {
                this._responsiveWidth[rootViewId] = responsiveWidth;
                triggers.push(TriggerKeys.ResponsiveWidth);
            }
        }

        // No need to re-calc when the height is unchanged
        if (this._rawHeight[rootViewId] !== height) {
            this._rawHeight[rootViewId] = height;
            triggers.push(TriggerKeys.Height);
        }

        // Trigger all changes at once.
        this.trigger(triggers);
    }

    @autoSubscribeWithKey(TriggerKeys.Width)
    getWidth(rootViewId: string = MainWindowId): number {
        return this._rawWidth[rootViewId];
    }

    @disableWarnings
    getWidthNoSubscription(rootViewId: string = MainWindowId): number  {
        return this._rawWidth[rootViewId];
    }

    @autoSubscribeWithKey(TriggerKeys.Height)
    getHeight(rootViewId: string = MainWindowId): number  {
        return this._rawHeight[rootViewId];
    }

    @disableWarnings
    getHeightNoSubscription(rootViewId: string = MainWindowId): number {
        return this._rawHeight[rootViewId];
    }

    @autoSubscribeWithKey(TriggerKeys.ResponsiveWidth)
    getResponsiveWidth(rootViewId: string = MainWindowId): number {
        return this._responsiveWidth[rootViewId];
    }

    @autoSubscribeWithKey(TriggerKeys.ResponsiveWidth)
    isSmallOrTinyScreenSize(rootViewId: string = MainWindowId): boolean {
        return this._responsiveWidth[rootViewId] <= ResponsiveWidth.Small;
    }

    @autoSubscribeWithKey(TriggerKeys.ResponsiveWidth)
    isTinyWidth(rootViewId: string = MainWindowId): boolean {
        return this._responsiveWidth[rootViewId] <= ResponsiveWidth.Tiny;
    }

    @disableWarnings
    isHeightSmallerThanThresholdNoSubscription(threshold: number, rootViewId: string = MainWindowId): boolean {
        const size = this.getWindowDimensionsNoSubscription(rootViewId);
        return size.height <= threshold;
    }

    @disableWarnings
    isWidthSmallerThanThresholdNoSubscription(threshold: number, rootViewId: string = MainWindowId): boolean {
        const size = this.getWindowDimensionsNoSubscription(rootViewId);
        return size.width <= threshold;
    }

    @disableWarnings
    getWindowDimensionsNoSubscription(rootViewId: string = MainWindowId): RX.Types.Dimensions {
        return RX.UserInterface.measureWindow(rootViewId === MainWindowId ? undefined : rootViewId);
    }
}

export default new ResponsiveWidthStore();
