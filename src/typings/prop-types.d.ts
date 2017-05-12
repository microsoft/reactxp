declare module 'prop-types' {
    // Type definitions for prop-types 15.5
    // Project: https://github.com/reactjs/prop-types
    // Definitions by: DovydasNavickas <https://github.com/DovydasNavickas>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
    // TypeScript Version: 2.2

    export type Validator<T> = (object: T, key: string, componentName: string, ...rest: any[]) => Error | null;

    // psegalen: modified original declaration because of
    // "error TS2312: An interface may only extend a class or another interface."
    export interface Requireable<T> {
        isRequired: Validator<T>;
    }

    export type ValidationMap<T> = {[K in keyof T]?: Validator<T> };

    export const any: Requireable<any> & Validator<any>;
    export const array: Requireable<any> & Validator<any>;
    export const bool: Requireable<any> & Validator<any>;
    export const func: Requireable<any> & Validator<any>;
    export const number: Requireable<any> & Validator<any>;
    export const object: Requireable<any> & Validator<any>;
    export const string: Requireable<any> & Validator<any>;
    export const node: Requireable<any> & Validator<any>;
    export const element: Requireable<any> & Validator<any>;
    export function instanceOf(expectedClass: {}): Requireable<any> & Validator<any>;
    export function oneOf(types: any[]): Requireable<any> & Validator<any>;
    export function oneOfType(types: Array<Validator<any>>): Requireable<any> & Validator<any>;
    export function arrayOf(type: Validator<any>): Requireable<any> & Validator<any>;
    export function objectOf(type: Validator<any>): Requireable<any> & Validator<any>;
    export function shape(type: ValidationMap<any>): Requireable<any> & Validator<any>;
}