/**
* KeysCodes.ts
* Copyright: Microsoft 2018
*
* Key codes for key press events.
*/

import * as RX from 'reactxp';

let _isInitialized = false;
let _isReactNative = false;

function isReactNative(): boolean {
    if (!_isInitialized) {
        const platform = RX.Platform.getType();
        _isReactNative = platform !== 'web';
    }

    return _isReactNative;
}

enum Keys {
    // ROMAN ALPHA
    A = 65, B = 66, C = 67, D = 68,
    E = 69, F = 70, G = 71, H = 72,
    I = 73, J = 74, K = 75, L = 76,
    M = 77, N = 78, O = 79, P = 80,
    Q = 81, R = 82, S = 83, T = 84,
    U = 85, V = 86, W = 87, X = 88,
    Y = 89, Z = 90,

    // ARROW KEYS
    LeftArrow = isReactNative() ? 21 : 37,
    UpArrow = isReactNative() ? 19 : 38,
    RightArrow = isReactNative() ? 22 : 39,
    DownArrow = isReactNative() ? 20 : 40,

    // NUMERALS
    Zero = 48, One = 49, Two = 50,
    Three = 51, Four = 52, Five = 53,
    Six = 54, Seven = 55, Eight = 56,
    Nine = 57,

    // OTHER
    Tab = 9, Shift = 16, Escape = 27,
    Return = 13, Enter = 13,
    Alt = 18, Option = 18,
    Command = 224, Control = 17,
    Delete = 8, Space = 32,
    PageUp = isReactNative() ? 92 : 33,
    PageDown = isReactNative() ? 93 : 34,
    Insert = 45,
    Comma = 188
}

export default Keys;
