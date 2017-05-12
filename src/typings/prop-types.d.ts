declare module 'prop-types' {
    import React = require('react');

    export const bool: {
        isRequired: React.Validator<any>
    }
}