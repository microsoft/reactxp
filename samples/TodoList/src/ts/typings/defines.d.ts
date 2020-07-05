/**
* defines.d.ts
* Copyright: Microsoft 2018
*
* Global symbols that are filled in at compile time. We define them
* here to make TypeScript happy while editing.
*/

// Indicates that this is a local dev build
declare let __DEV__: boolean;

// Indicates that this is a unit test build
declare let __TEST__: boolean;

// Flags for specific platforms
declare let __WEB__: boolean;
declare let __IOS__: boolean;
declare let __ANDROID__: boolean;
declare let __WINDOWS__: boolean;
declare let __MACOS__: boolean;
