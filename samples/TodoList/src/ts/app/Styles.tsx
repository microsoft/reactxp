/**
* Styles.tsx
* Copyright: Microsoft 2018
*
* Shared style information used throughout the application.
*/

import { default as FontRefs } from 'modules/fonts';
import * as RX from 'reactxp';

export const enum Colors {
    black = '#000000',

    white = '#fff',
    gray66 = '#666',
    grayEE = '#eee',
    grayF8 = '#f8f8f8',
    transparent = 'rgba(0, 0, 0, 0)',

    headerBackground = 'white',
    contentBackground = 'white',
    logoColor = '#339933',

    borderSeparator = '#ccc',
    borderSeparatorLight = '#eee',
    separator = '#eee',
    menuText = '#666',
    menuTextSelected = '#225577',
    menuTextDisabled = '#bbb',
    menuTextHover = '#000',
    menuItemHover = '#eee',
    menuBackground = '#fff',
    menuBorder = '#bbb',
    listItemHover = '#f8f8ff',
    listItemSelected = '#ddeeff',
    buttonTextColor = '#666',
    buttonTextHover = '#000',
    simpleButtonBackground = '#fff',
    simpleButtonBackgroundHover = '#eee',
    simpleButtonBorder = '#999',
    simpleButtonText = '#666',
    simpleButtonTextHover = '#000',
    simpleDialogBackground = '#fff',
    simpleDialogBorder = '#ddd',
    simpleDialogText = '#666',
    simpleDialogBehind = 'rgba(0, 0, 0, 0.05)'
}

export const enum FontSizes {
    size12 = 12,
    size14 = 14,
    size16 = 16,
    size20 = 20,
    size32 = 32,

    menuItem = 16
}

// Font infos
export class Fonts {
    static monospace: RX.Types.FontInfo = {
        fontFamily: FontRefs.monospace
    };

    static displayLight: RX.Types.FontInfo = {
        fontFamily: FontRefs.displayLight
    };

    static displayRegular: RX.Types.FontInfo = {
        fontFamily: FontRefs.displayRegular,
        fontWeight: '400'
    };

    static displaySemibold: RX.Types.FontInfo = {
        fontFamily: FontRefs.displaySemibold,
        fontWeight: '600'
    };

    static displayBold: RX.Types.FontInfo = {
        fontFamily: FontRefs.displayBold,
        fontWeight: '700'
    };
}

// Styles
export class Styles {
    static statusBarTopMargin = RX.Styles.createViewStyle({
        marginTop: RX.StatusBar.isOverlay() ? 20 : 0
    });
}
