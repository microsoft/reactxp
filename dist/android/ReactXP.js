/**
* ReactXP.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Wrapper for all ReactXP functionality. Users of ReactXP should import just this
* file instead of internals.
*/
"use strict";
var React = require("react");
var RXInterface = require("../common/Interfaces");
var RXTypes = require("../common/Types");
var AnimatedImpl = require("./Animated");
// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.
var Accessibility_1 = require("../native-common/Accessibility");
var ActivityIndicator_1 = require("../native-common/ActivityIndicator");
var Alert_1 = require("../native-common/Alert");
var App_1 = require("../native-common/App");
var Button_1 = require("./Button");
var Picker_1 = require("../native-common/Picker");
var Image_1 = require("./Image");
var Clipboard_1 = require("../native-common/Clipboard");
var GestureView_1 = require("./GestureView");
var Input_1 = require("../native-common/Input");
var Link_1 = require("../native-common/Link");
var Linking_1 = require("../native-common/Linking");
var Location_1 = require("../common/Location");
var Modal_1 = require("../native-common/Modal");
var Navigator_1 = require("../native-common/Navigator");
var Network_1 = require("../native-common/Network");
var Platform_1 = require("../native-common/Platform");
var Popup_1 = require("../native-common/Popup");
var ScrollView_1 = require("../native-common/ScrollView");
var StatusBar_1 = require("./StatusBar");
var Storage_1 = require("../native-common/Storage");
var Styles_1 = require("../native-common/Styles");
var Text_1 = require("./Text");
var TextInput_1 = require("../native-common/TextInput");
var Profiling_1 = require("../native-common/Profiling");
var UserInterface_1 = require("../native-common/UserInterface");
var UserPresence_1 = require("../native-common/UserPresence");
var View_1 = require("./View");
var WebView_1 = require("../native-common/WebView");
var ViewBase_1 = require("../native-common/ViewBase");
// Initialize the Android default view style. This is should not be required because RN for
// Android defaults to overflow 'hidden'. But we are running into issues with removing it
// (probably because it's used for both rendering and layout).
var _defaultViewStyle = Styles_1.default.createViewStyle({
    overflow: 'hidden'
});
ViewBase_1.default.setDefaultViewStyle(_defaultViewStyle);
// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.
var ReactXP;
(function (ReactXP) {
    ReactXP.Accessibility = Accessibility_1.default;
    ReactXP.Animated = AnimatedImpl.Animated;
    ReactXP.ActivityIndicator = ActivityIndicator_1.ActivityIndicator;
    ReactXP.Alert = Alert_1.default;
    ReactXP.App = App_1.default;
    ReactXP.Button = Button_1.default;
    ReactXP.Picker = Picker_1.default;
    ReactXP.Clipboard = Clipboard_1.default;
    ReactXP.GestureView = GestureView_1.default;
    ReactXP.Image = Image_1.default;
    ReactXP.Input = Input_1.default;
    ReactXP.Link = Link_1.default;
    ReactXP.Linking = Linking_1.default;
    ReactXP.Location = Location_1.default;
    ReactXP.Modal = Modal_1.default;
    ReactXP.Navigator = Navigator_1.default;
    ReactXP.Network = Network_1.default;
    ReactXP.Platform = Platform_1.default;
    ReactXP.Popup = Popup_1.default;
    ReactXP.Profiling = Profiling_1.default;
    ReactXP.ScrollView = ScrollView_1.default;
    ReactXP.StatusBar = StatusBar_1.default;
    ReactXP.Storage = Storage_1.default;
    ReactXP.Styles = Styles_1.default;
    ReactXP.Text = Text_1.default;
    ReactXP.TextInput = TextInput_1.default;
    ReactXP.UserInterface = UserInterface_1.default;
    ReactXP.UserPresence = UserPresence_1.default;
    ReactXP.View = View_1.default;
    ReactXP.WebView = WebView_1.default;
    ReactXP.Types = RXTypes;
    ReactXP.Component = React.Component;
    ReactXP.createElement = React.createElement;
    ReactXP.Children = React.Children;
    ReactXP.__spread = React.__spread;
    ReactXP.DeviceNetworkType = RXInterface.DeviceNetworkType;
})(ReactXP || (ReactXP = {}));
// -- STRANGE THINGS GOING ON HERE --
// See web/ReactXP.tsx for more details.
/* tslint:disable:no-unused-variable */
var _rxImplementsRxInterface = ReactXP;
module.exports = ReactXP;
/* tslint:enable:no-unused-variable */
/*
var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
