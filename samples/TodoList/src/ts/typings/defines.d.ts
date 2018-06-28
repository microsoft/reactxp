/**
* defines.d.ts
* Copyright: Microsoft 2018
*
* Global symbols that are filled in at compile time. We define them
* here to make TypeScript happy while editing.
*/

// Indicates that this is a local dev build
declare var __DEV__: boolean;

// Indicates that this is a unit test build
declare var __TEST__: boolean;

// Flags for specific platforms
declare var __WEB__: boolean;
declare var __IOS__: boolean;
declare var __ANDROID__: boolean;
declare var __WINDOWS__: boolean;
declare var __MACOS__: boolean;
