/**
* ActivityIndicator.tsx
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Control to display an animated activity indicator.
*/

import React = require('react');

import RX = require('../common/Interfaces');
import Types = require('../common/Types');

const _activityIndicatorCss = `
.rx-activity {
  position: relative;
  width: 100px;
  height: 100px;
}
.rx-activity .layer-1-translate,
.rx-activity .layer-3-translate,
.rx-activity .layer-5-translate,
.rx-activity .layer-7-translate {
  -webkit-transform: translate(50px, 50px);
          transform: translate(50px, 50px);
}
.rx-activity .layer-2-translate,
.rx-activity .layer-4-translate,
.rx-activity .layer-6-translate,
.rx-activity .layer-8-translate {
  -webkit-transform: translate(0px, -40px);
          transform: translate(0px, -40px);
}
.rx-activity .layer-2-content,
.rx-activity .layer-4-content,
.rx-activity .layer-6-content,
.rx-activity .layer-8-content {
  width: 100px;
  height: 100px;
}
.rx-activity .layer-2-content .shape-0,
.rx-activity .layer-4-content .shape-0,
.rx-activity .layer-6-content .shape-0,
.rx-activity .layer-8-content .shape-0 {
  position: absolute;
  left: -7.5px;
  top: -7.5px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
.rx-activity div {
  position: absolute;
  width: 0;
  height: 0;
}
.rx-activity .animation {
  -webkit-animation-duration: 1.4s;
          animation-duration: 1.4s;
  -webkit-animation-timing-function: linear;
          animation-timing-function: linear;
  -webkit-animation-direction: normal;
          animation-direction: normal;
  -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
  -webkit-animation-delay: 0s;
          animation-delay: 0s;
}
.rx-activity .layer-1-rotate {
  -webkit-animation-name: rx-activity-layer-1-rotate;
          animation-name: rx-activity-layer-1-rotate;
}
.rx-activity .layer-2-scale {
  -webkit-animation-name: rx-activity-layer-2-scale;
          animation-name: rx-activity-layer-2-scale;
}
.rx-activity .layer-3-rotate {
  -webkit-animation-name: rx-activity-layer-3-rotate;
          animation-name: rx-activity-layer-3-rotate;
}
.rx-activity .layer-4-scale {
  -webkit-animation-name: rx-activity-layer-4-scale;
          animation-name: rx-activity-layer-4-scale;
}
.rx-activity .layer-5-rotate {
  -webkit-animation-name: rx-activity-layer-5-rotate;
          animation-name: rx-activity-layer-5-rotate;
}
.rx-activity .layer-6-scale {
  -webkit-animation-name: rx-activity-layer-6-scale;
          animation-name: rx-activity-layer-6-scale;
}
.rx-activity .layer-7-rotate {
  -webkit-animation-name: rx-activity-layer-7-rotate;
          animation-name: rx-activity-layer-7-rotate;
}
.rx-activity .layer-8-scale {
  -webkit-animation-name: rx-activity-layer-8-scale;
          animation-name: rx-activity-layer-8-scale;
}
.rx-activity .shape-0 {
  background-color: white;
}
.rx-activity.hidden {
  visibility: hidden;
}
.rx-activity-extra-small {
  width: 16px;
  height: 16px;
}
.rx-activity-extra-small .layer-1-translate,
.rx-activity-extra-small .layer-3-translate,
.rx-activity-extra-small .layer-5-translate,
.rx-activity-extra-small .layer-7-translate {
  -webkit-transform: translate(8px, 8px);
          transform: translate(8px, 8px);
}
.rx-activity-extra-small .layer-2-translate,
.rx-activity-extra-small .layer-4-translate,
.rx-activity-extra-small .layer-6-translate,
.rx-activity-extra-small .layer-8-translate {
  -webkit-transform: translate(0px, -6.4px);
          transform: translate(0px, -6.4px);
}
.rx-activity-extra-small .layer-2-content,
.rx-activity-extra-small .layer-4-content,
.rx-activity-extra-small .layer-6-content,
.rx-activity-extra-small .layer-8-content {
  width: 16px;
  height: 16px;
}
.rx-activity-extra-small .layer-2-content .shape-0,
.rx-activity-extra-small .layer-4-content .shape-0,
.rx-activity-extra-small .layer-6-content .shape-0,
.rx-activity-extra-small .layer-8-content .shape-0 {
  position: absolute;
  left: -2px;
  top: -2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
}
.rx-activity-small {
  width: 20px;
  height: 20px;
}
.rx-activity-small .layer-1-translate,
.rx-activity-small .layer-3-translate,
.rx-activity-small .layer-5-translate,
.rx-activity-small .layer-7-translate {
  -webkit-transform: translate(10px, 10px);
          transform: translate(10px, 10px);
}
.rx-activity-small .layer-2-translate,
.rx-activity-small .layer-4-translate,
.rx-activity-small .layer-6-translate,
.rx-activity-small .layer-8-translate {
  -webkit-transform: translate(0px, -8px);
          transform: translate(0px, -8px);
}
.rx-activity-small .layer-2-content,
.rx-activity-small .layer-4-content,
.rx-activity-small .layer-6-content,
.rx-activity-small .layer-8-content {
  width: 20px;
  height: 20px;
}
.rx-activity-small .layer-2-content .shape-0,
.rx-activity-small .layer-4-content .shape-0,
.rx-activity-small .layer-6-content .shape-0,
.rx-activity-small .layer-8-content .shape-0 {
  position: absolute;
  left: -3px;
  top: -3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.rx-activity-medium {
  width: 36px;
  height: 36px;
}
.rx-activity-medium .layer-1-translate,
.rx-activity-medium .layer-3-translate,
.rx-activity-medium .layer-5-translate,
.rx-activity-medium .layer-7-translate {
  -webkit-transform: translate(18px, 18px);
          transform: translate(18px, 18px);
}
.rx-activity-medium .layer-2-translate,
.rx-activity-medium .layer-4-translate,
.rx-activity-medium .layer-6-translate,
.rx-activity-medium .layer-8-translate {
  -webkit-transform: translate(0px, -14.4px);
          transform: translate(0px, -14.4px);
}
.rx-activity-medium .layer-2-content,
.rx-activity-medium .layer-4-content,
.rx-activity-medium .layer-6-content,
.rx-activity-medium .layer-8-content {
  width: 36px;
  height: 36px;
}
.rx-activity-medium .layer-2-content .shape-0,
.rx-activity-medium .layer-4-content .shape-0,
.rx-activity-medium .layer-6-content .shape-0,
.rx-activity-medium .layer-8-content .shape-0 {
  position: absolute;
  left: -4.5px;
  top: -4.5px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
@-webkit-keyframes rx-activity-layer-1-rotate {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-animation-timing-function: cubic-bezier(1, 0.2, 0.25, 0.76);
            animation-timing-function: cubic-bezier(1, 0.2, 0.25, 0.76);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@keyframes rx-activity-layer-1-rotate {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-animation-timing-function: cubic-bezier(1, 0.2, 0.25, 0.76);
            animation-timing-function: cubic-bezier(1, 0.2, 0.25, 0.76);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@-webkit-keyframes rx-activity-layer-2-scale {
  0% {
    -webkit-transform: scale(0.96);
            transform: scale(0.96);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  14.29% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  47.62% {
    -webkit-transform: scale(0.35);
            transform: scale(0.35);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  66.67% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  72.62% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
            animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
  }
  100% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@keyframes rx-activity-layer-2-scale {
  0% {
    -webkit-transform: scale(0.96);
            transform: scale(0.96);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  14.29% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  47.62% {
    -webkit-transform: scale(0.35);
            transform: scale(0.35);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  66.67% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  72.62% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
            animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
  }
  100% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@-webkit-keyframes rx-activity-layer-3-rotate {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-animation-timing-function: cubic-bezier(0.88, 0.21, 0.25, 0.76);
            animation-timing-function: cubic-bezier(0.88, 0.21, 0.25, 0.76);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@keyframes rx-activity-layer-3-rotate {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-animation-timing-function: cubic-bezier(0.88, 0.21, 0.25, 0.76);
            animation-timing-function: cubic-bezier(0.88, 0.21, 0.25, 0.76);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@-webkit-keyframes rx-activity-layer-4-scale {
  0% {
    -webkit-transform: scale(0.96);
            transform: scale(0.96);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  9.52% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  42.86% {
    -webkit-transform: scale(0.35);
            transform: scale(0.35);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  61.9% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  72.62% {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
    -webkit-animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
            animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
  }
  100% {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@keyframes rx-activity-layer-4-scale {
  0% {
    -webkit-transform: scale(0.96);
            transform: scale(0.96);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  9.52% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  42.86% {
    -webkit-transform: scale(0.35);
            transform: scale(0.35);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  61.9% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  72.62% {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
    -webkit-animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
            animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
  }
  100% {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@-webkit-keyframes rx-activity-layer-5-rotate {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-animation-timing-function: cubic-bezier(0.76, 0.21, 0.25, 0.76);
            animation-timing-function: cubic-bezier(0.76, 0.21, 0.25, 0.76);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@keyframes rx-activity-layer-5-rotate {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-animation-timing-function: cubic-bezier(0.76, 0.21, 0.25, 0.76);
            animation-timing-function: cubic-bezier(0.76, 0.21, 0.25, 0.76);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@-webkit-keyframes rx-activity-layer-6-scale {
  0% {
    -webkit-transform: scale(0.96);
            transform: scale(0.96);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  4.76% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  38.1% {
    -webkit-transform: scale(0.35);
            transform: scale(0.35);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  57.14% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  72.62% {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
    -webkit-animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
            animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
  }
  100% {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@keyframes rx-activity-layer-6-scale {
  0% {
    -webkit-transform: scale(0.96);
            transform: scale(0.96);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  4.76% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  38.1% {
    -webkit-transform: scale(0.35);
            transform: scale(0.35);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  57.14% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  72.62% {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
    -webkit-animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
            animation-timing-function: cubic-bezier(0.17, 0, 0.83, 1);
  }
  100% {
    -webkit-transform: scale(0.8);
            transform: scale(0.8);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@-webkit-keyframes rx-activity-layer-7-rotate {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-animation-timing-function: cubic-bezier(0.65, 0.21, 0.25, 0.76);
            animation-timing-function: cubic-bezier(0.65, 0.21, 0.25, 0.76);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@keyframes rx-activity-layer-7-rotate {
  0% {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-animation-timing-function: cubic-bezier(0.65, 0.21, 0.25, 0.76);
            animation-timing-function: cubic-bezier(0.65, 0.21, 0.25, 0.76);
  }
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@-webkit-keyframes rx-activity-layer-8-scale {
  0% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  33.33% {
    -webkit-transform: scale(0.35);
            transform: scale(0.35);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 1, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 1, 1);
  }
  52.38% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.8, 0, 0.78, 1);
            animation-timing-function: cubic-bezier(0.8, 0, 0.78, 1);
  }
  72.62% {
    -webkit-transform: scale(1.15);
            transform: scale(1.15);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0, 1);
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
@keyframes rx-activity-layer-8-scale {
  0% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0.67, 1);
  }
  33.33% {
    -webkit-transform: scale(0.35);
            transform: scale(0.35);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 1, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 1, 1);
  }
  52.38% {
    -webkit-transform: scale(0.45);
            transform: scale(0.45);
    -webkit-animation-timing-function: cubic-bezier(0.8, 0, 0.78, 1);
            animation-timing-function: cubic-bezier(0.8, 0, 0.78, 1);
  }
  72.62% {
    -webkit-transform: scale(1.15);
            transform: scale(1.15);
    -webkit-animation-timing-function: cubic-bezier(0.33, 0, 0, 1);
            animation-timing-function: cubic-bezier(0.33, 0, 0, 1);
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
  }
}
`;

export interface ActivityIndicatorState {
    isVisible?: boolean;
}

export class ActivityIndicator extends React.Component<Types.ActivityIndicatorProps, ActivityIndicatorState> {
    private static _isStyleSheetInstalled: boolean = false;
    private _isMounted = false;

    private static _installStyleSheet() {
        // Have we installed the style sheet already?
        if (ActivityIndicator._isStyleSheetInstalled) {
            return;
        }

        // We set the CSS style sheet here to avoid the need
        // for users of this class to carry along another CSS
        // file.
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style') as any;

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = _activityIndicatorCss;
        } else {
            style.appendChild(document.createTextNode(_activityIndicatorCss));
        }

        head.appendChild(style);
    }

    constructor(props: Types.ActivityIndicatorProps) {
        super(props);

        ActivityIndicator._installStyleSheet();

        this.state = { isVisible: false };
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.deferTime && this.props.deferTime > 0) {
            window.setTimeout(() => {
                if (this._isMounted) {
                    this.setState({ isVisible: true });
                }
            }, this.props.deferTime);
        } else {
            this.setState({ isVisible: true });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        var colorStyle = {
            backgroundColor: this.props.color
        };

        let spinnerClasses = ['rx-activity'];
        if (this.props.size === 'tiny') {
            spinnerClasses.push('rx-activity-extra-small');
        } else if (this.props.size === 'small') {
            spinnerClasses.push('rx-activity-small');
        } else if (this.props.size === 'medium') {
            spinnerClasses.push('rx-activity-medium');
        }

        if (!this.state.isVisible) {
            spinnerClasses.push('hidden');
        }

        return (
            <div className={ spinnerClasses.join(' ') }>
                <div className='layer-7'>
                    <div className='layer-7-translate'>
                        <div className='layer-7-rotate animation'>
                            <div className='layer-8'>
                                <div className='layer-8-translate'>
                                    <div className='layer-8-scale animation'>
                                        <div className='layer-8-content '>
                                            <div className='shape shape-0' style={ colorStyle }></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='layer-5'>
                    <div className='layer-5-translate'>
                        <div className='layer-5-rotate animation'>
                            <div className='layer-6'>
                                <div className='layer-6-translate'>
                                    <div className='layer-6-scale animation'>
                                        <div className='layer-6-content '>
                                            <div className='shape shape-0' style={ colorStyle }></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='layer-3'>
                    <div className='layer-3-translate'>
                        <div className='layer-3-rotate animation'>
                            <div className='layer-4'>
                                <div className='layer-4-translate'>
                                    <div className='layer-4-scale animation'>
                                        <div className='layer-4-content '>
                                            <div className='shape shape-0' style={ colorStyle }></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='layer-1'>
                    <div className='layer-1-translate'>
                        <div className='layer-1-rotate animation'>
                            <div className='layer-2'>
                                <div className='layer-2-translate'>
                                    <div className='layer-2-scale animation'>
                                        <div className='layer-2-content '>
                                            <div className='shape shape-0' style={ colorStyle }></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ActivityIndicator;
