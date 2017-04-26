/**
* Interfaces.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Defines the template for the ReactXP interface that needs to be
* implemented for each platform.
*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var AppConfig_1 = require("./AppConfig");
var SubscribableEvent = require("./SubscribableEvent");
var Types = require("./Types");
exports.Types = Types;
var ActivityIndicator = (function (_super) {
    __extends(ActivityIndicator, _super);
    function ActivityIndicator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ActivityIndicator;
}(React.Component));
exports.ActivityIndicator = ActivityIndicator;
var Alert = (function () {
    function Alert() {
    }
    return Alert;
}());
exports.Alert = Alert;
var AnimatedComponent = (function (_super) {
    __extends(AnimatedComponent, _super);
    function AnimatedComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedComponent;
}(React.Component));
exports.AnimatedComponent = AnimatedComponent;
var AnimatedImage = (function (_super) {
    __extends(AnimatedImage, _super);
    function AnimatedImage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedImage;
}(AnimatedComponent));
exports.AnimatedImage = AnimatedImage;
var AnimatedText = (function (_super) {
    __extends(AnimatedText, _super);
    function AnimatedText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedText;
}(AnimatedComponent));
exports.AnimatedText = AnimatedText;
var AnimatedTextInput = (function (_super) {
    __extends(AnimatedTextInput, _super);
    function AnimatedTextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedTextInput;
}(AnimatedComponent));
exports.AnimatedTextInput = AnimatedTextInput;
var AnimatedView = (function (_super) {
    __extends(AnimatedView, _super);
    function AnimatedView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AnimatedView;
}(AnimatedComponent));
exports.AnimatedView = AnimatedView;
var AnimatedValue = (function () {
    function AnimatedValue(val) {
        // No-op
    }
    return AnimatedValue;
}());
exports.AnimatedValue = AnimatedValue;
var Profiling = (function () {
    function Profiling() {
    }
    return Profiling;
}());
exports.Profiling = Profiling;
var App = (function () {
    function App() {
        this.activationStateChangedEvent = new SubscribableEvent.SubscribableEvent();
        // Memory Warnings
        this.memoryWarningEvent = new SubscribableEvent.SubscribableEvent();
    }
    // Initialization
    App.prototype.initialize = function (debug, development) {
        AppConfig_1.default.setAppConfig(debug, development);
    };
    return App;
}());
exports.App = App;
var UserInterface = (function () {
    function UserInterface() {
        this.contentSizeMultiplierChangedEvent = new SubscribableEvent.SubscribableEvent();
    }
    return UserInterface;
}());
exports.UserInterface = UserInterface;
var Modal = (function () {
    function Modal() {
    }
    return Modal;
}());
exports.Modal = Modal;
var Popup = (function () {
    function Popup() {
    }
    return Popup;
}());
exports.Popup = Popup;
var Linking = (function () {
    function Linking() {
        this.deepLinkRequestEvent = new SubscribableEvent.SubscribableEvent();
    }
    return Linking;
}());
exports.Linking = Linking;
var Accessibility = (function () {
    function Accessibility() {
        this.screenReaderChangedEvent = new SubscribableEvent.SubscribableEvent();
    }
    return Accessibility;
}());
exports.Accessibility = Accessibility;
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Button;
}(React.Component));
exports.Button = Button;
var Picker = (function (_super) {
    __extends(Picker, _super);
    function Picker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Picker;
}(React.Component));
exports.Picker = Picker;
var Component = (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Component;
}(React.Component));
exports.Component = Component;
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Image;
}(React.Component));
exports.Image = Image;
var Clipboard = (function () {
    function Clipboard() {
    }
    return Clipboard;
}());
exports.Clipboard = Clipboard;
var Link = (function (_super) {
    __extends(Link, _super);
    function Link() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Link;
}(React.Component));
exports.Link = Link;
var Storage = (function () {
    function Storage() {
    }
    return Storage;
}());
exports.Storage = Storage;
var Location = (function () {
    function Location() {
    }
    return Location;
}());
exports.Location = Location;
var Navigator = (function (_super) {
    __extends(Navigator, _super);
    function Navigator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Navigator;
}(React.Component));
exports.Navigator = Navigator;
var DeviceNetworkType;
(function (DeviceNetworkType) {
    DeviceNetworkType[DeviceNetworkType["UNKNOWN"] = 0] = "UNKNOWN";
    DeviceNetworkType[DeviceNetworkType["NONE"] = 1] = "NONE";
    DeviceNetworkType[DeviceNetworkType["WIFI"] = 2] = "WIFI";
    DeviceNetworkType[DeviceNetworkType["MOBILE_2G"] = 3] = "MOBILE_2G";
    DeviceNetworkType[DeviceNetworkType["MOBILE_3G"] = 4] = "MOBILE_3G";
    DeviceNetworkType[DeviceNetworkType["MOBILE_4G"] = 5] = "MOBILE_4G";
})(DeviceNetworkType = exports.DeviceNetworkType || (exports.DeviceNetworkType = {}));
var Network = (function () {
    function Network() {
        this.connectivityChangedEvent = new SubscribableEvent.SubscribableEvent();
    }
    return Network;
}());
exports.Network = Network;
var Platform = (function () {
    function Platform() {
    }
    return Platform;
}());
exports.Platform = Platform;
var Input = (function () {
    function Input() {
        this.backButtonEvent = new SubscribableEvent.SubscribableEvent();
        this.keyDownEvent = new SubscribableEvent.SubscribableEvent();
        this.keyUpEvent = new SubscribableEvent.SubscribableEvent();
    }
    return Input;
}());
exports.Input = Input;
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ScrollView;
}(React.Component));
exports.ScrollView = ScrollView;
var StatusBar = (function () {
    function StatusBar() {
    }
    return StatusBar;
}());
exports.StatusBar = StatusBar;
var Styles = (function () {
    function Styles() {
    }
    return Styles;
}());
exports.Styles = Styles;
var Text = (function (_super) {
    __extends(Text, _super);
    function Text() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Text;
}(React.Component));
exports.Text = Text;
var TextInput = (function (_super) {
    __extends(TextInput, _super);
    function TextInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TextInput;
}(React.Component));
exports.TextInput = TextInput;
var UserPresence = (function () {
    function UserPresence() {
        this.userPresenceChangedEvent = new SubscribableEvent.SubscribableEvent();
    }
    return UserPresence;
}());
exports.UserPresence = UserPresence;
var ViewBase = (function (_super) {
    __extends(ViewBase, _super);
    function ViewBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ViewBase;
}(React.Component));
exports.ViewBase = ViewBase;
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return View;
}(ViewBase));
exports.View = View;
var GestureView = (function (_super) {
    __extends(GestureView, _super);
    function GestureView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GestureView;
}(ViewBase));
exports.GestureView = GestureView;
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WebView;
}(ViewBase));
exports.WebView = WebView;
