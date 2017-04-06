/*
* window.ts
* Copyright: Microsoft 2017
*
* Window module to enable easy mocking.
*/

export = typeof(window) !== 'undefined' ? window : <Window>{};
