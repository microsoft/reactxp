/**
* Link.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Web-specific implementation of the cross-platform Link abstraction.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var RX = require("../common/Interfaces");
var Styles_1 = require("./Styles");
var _styles = {
    defaultStyle: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',
        overflowWrap: 'break-word',
        msHyphens: 'auto'
    },
    ellipsis: {
        position: 'relative',
        display: 'inline',
        flexDirection: 'column',
        flex: '0 0 auto',
        overflow: 'hidden',
        alignItems: 'stretch',
        whiteSpace: 'pre',
        textOverflow: 'ellipsis'
    }
};
var Link = (function (_super) {
    __extends(Link, _super);
    function Link() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._onClick = function (e) {
            e.stopPropagation();
            if (_this.props.onPress) {
                e.preventDefault();
                _this.props.onPress();
            }
        };
        return _this;
    }
    Link.prototype.render = function () {
        // SECURITY WARNING:
        //   Note the use of rel='noreferrer'
        //   Destroy the back-link to this window. Otherwise the (untrusted) URL we are about to load can redirect OUR window.
        //   See: https://mathiasbynens.github.io/rel-noopener/
        return (React.createElement("a", { style: this._getStyles(), title: this.props.title, href: this.props.url, target: '_blank', rel: 'noreferrer', onClick: this._onClick, onMouseEnter: this.props.onHoverStart, onMouseLeave: this.props.onHoverEnd }, this.props.children));
    };
    Link.prototype._getStyles = function () {
        // There's no way in HTML to properly handle numberOfLines > 1,
        // but we can correctly handle the common case where numberOfLines is 1.
        var combinedStyles = Styles_1.default.combine(this.props.numberOfLines === 1 ? _styles.ellipsis : _styles.defaultStyle, this.props.style);
        // Handle cursor styles
        if (this.props.selectable) {
            combinedStyles['userSelect'] = 'text';
            combinedStyles['WebkitUserSelect'] = 'text';
            combinedStyles['MozUserSelect'] = 'text';
            combinedStyles['msUserSelect'] = 'text';
        }
        combinedStyles['cursor'] = 'pointer';
        return combinedStyles;
    };
    return Link;
}(RX.Link));
exports.Link = Link;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Link;
