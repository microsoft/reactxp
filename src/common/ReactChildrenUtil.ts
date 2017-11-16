/**
* ReactChildrenUtil.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Utility functions which compliment the React.Children API.
*/

import React = require('react');

/**
 * Returns true if any child or sub-child has a type matching @param searchingType.
 * Comparison is done using the ReactElement 'type' property.
 */
export function deepHasChildOfType(children: React.ReactNode, searchingType: any) {
    return deepTestForCondition(children, child => child.type === searchingType);
}

/**
 * Recursively checks all children and sub-children to find if any matches the @param condition. 
 * Returns 'true' upon the first child satisfying the condition, otherwise 'false' when all children have been tested.
 */
export function deepTestForCondition(children: React.ReactNode, condition: (child: any) => boolean): boolean {
    for (let child of React.Children.toArray(children)) {
        if (!React.isValidElement(child)) {
            continue;
        }

        if (condition(child) || ('children' in child.props && deepTestForCondition((child.props as any)['children'], condition))) {
            return true;
        }
    }

    return false;
}
