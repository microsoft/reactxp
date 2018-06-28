/**
* index.native.ts
* Copyright: Microsoft 2018
*
* Native implementation of "images" module.
*/

import { ImageSourceBase } from './Images';

// The React Native bundler handles resource paths at build time, so they need
// to be specified as full string literals (as opposed to being constructed
// programmatically in a helper method).

// We use accessors and "require" calls to defer loading of these images into
// memory until they are actually used. If we were to require them upfront,
// app launch times would increase substantially.
class ImageSource implements ImageSourceBase {
    get todoLogo() { return require('../../../images/todo-logo.png'); }
    get todoSmall() { return require('../../../images/todo-small.png'); }
}

export default new ImageSource();
