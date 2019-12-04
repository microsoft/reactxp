/**
 * assert
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 */
const assert = (cond: any, message?: string | undefined): void => {
    if (!cond) {
        throw new Error(message || 'Assertion Failed');
    }
};

export default assert;
