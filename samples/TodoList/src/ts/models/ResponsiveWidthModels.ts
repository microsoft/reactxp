/**
* ResponsiveWidthModels.ts
* Copyright: Microsoft 2018
*
* Constants and enumerations used for establishing responsive break points.
*/

export enum ResponsiveWidth {
    // <= 450
    Tiny,
    // 451 - 799
    Small,
    // 800 - 1279
    Medium,
    // >= 1280
    Large
}

export const WidthBreakPoints = {
    tiny: 451,
    small: 800,
    medium: 1280,
};
