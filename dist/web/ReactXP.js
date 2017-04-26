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
var AnimatedImpl = require("./Animated");
var RXInterface = require("../common/Interfaces");
var RXTypes = require("../common/Types");
// -- STRANGE THINGS GOING ON HERE --
//
// 1) 'export var Foo = Foo;'
//    TypeScript will get confused if (in the module RX below) you try to create a var with the same name as an import.
//    To avoid this problem, the imports are renamed to 'FooImpl'.
//
// 2) 'import { default as FooImpl }... export var foo = FooImpl;'
//    The way we generate RX.d.ts has extra rules around having the name of the type in scope.
//    This is not a problem if the class was imported directly (regardless of renames). However, the 'default' import is not sufficient as
//    a type name. In order to generate the type of 'foo', the actual 'Foo' class needs to be imported. Of course, the same naming problem
//    exists as (1) so it is imported as 'FooType'. Note: you will see 'FooType' in the generated RX.d.ts ('export var Foo: FooType').
var Accessibility_1 = require("./Accessibility");
var ActivityIndicator_1 = require("./ActivityIndicator");
var Alert_1 = require("./Alert");
var App_1 = require("./App");
var Button_1 = require("./Button");
var Picker_1 = require("./Picker");
var Image_1 = require("./Image");
var Clipboard_1 = require("./Clipboard");
var GestureView_1 = require("./GestureView");
var Input_1 = require("./Input");
var Link_1 = require("./Link");
var Linking_1 = require("./Linking");
var Location_1 = require("../common/Location");
var Modal_1 = require("./Modal");
var Navigator_1 = require("./Navigator");
var Network_1 = require("./Network");
var Platform_1 = require("./Platform");
var Popup_1 = require("../web/Popup");
var ScrollView_1 = require("./ScrollView");
var StatusBar_1 = require("./StatusBar");
var Storage_1 = require("./Storage");
var Styles_1 = require("./Styles");
var Text_1 = require("./Text");
var TextInput_1 = require("./TextInput");
var Profiling_1 = require("../common/Profiling");
var UserInterface_1 = require("./UserInterface");
var UserPresence_1 = require("./UserPresence");
var View_1 = require("./View");
var ViewBase_1 = require("./ViewBase");
var WebView_1 = require("./WebView");
// -- STRANGE THINGS GOING ON HERE --
//
// 1) 'export type Foo = FooImpl; export var Foo = FooImpl;'
//    If the var 'Foo' was exported alone then the name 'RX.Foo' would not be valid in a type position: 'function takesFoo(foo: RX.Foo)'.
//    To avoid this problem, the type information is also exported. TypeScript will merge the var and type together (if the types match).
var ReactXP;
(function (ReactXP) {
    ReactXP.Accessibility = Accessibility_1.default;
    ReactXP.Animated = AnimatedImpl;
    ReactXP.ActivityIndicator = ActivityIndicator_1.ActivityIndicator;
    ReactXP.Alert = Alert_1.default;
    ReactXP.App = App_1.default;
    ReactXP.Button = Button_1.Button;
    ReactXP.Picker = Picker_1.Picker;
    ReactXP.Clipboard = Clipboard_1.default;
    ReactXP.GestureView = GestureView_1.GestureView;
    ReactXP.Image = Image_1.Image;
    ReactXP.Input = Input_1.default;
    ReactXP.Link = Link_1.Link;
    ReactXP.Linking = Linking_1.default;
    ReactXP.Location = Location_1.default;
    ReactXP.Modal = Modal_1.default;
    ReactXP.Navigator = Navigator_1.Navigator;
    ReactXP.Network = Network_1.default;
    ReactXP.Platform = Platform_1.default;
    ReactXP.Popup = Popup_1.default;
    ReactXP.Profiling = Profiling_1.default;
    ReactXP.ScrollView = ScrollView_1.ScrollView;
    ReactXP.StatusBar = StatusBar_1.default;
    ReactXP.Storage = Storage_1.default;
    ReactXP.Styles = Styles_1.default;
    ReactXP.Text = Text_1.Text;
    ReactXP.TextInput = TextInput_1.TextInput;
    ReactXP.UserInterface = UserInterface_1.default;
    ReactXP.UserPresence = UserPresence_1.default;
    ReactXP.View = View_1.default;
    ReactXP.WebView = WebView_1.WebView;
    ReactXP.Types = RXTypes;
    ReactXP.Component = React.Component;
    ReactXP.createElement = React.createElement;
    ReactXP.Children = React.Children;
    ReactXP.__spread = React.__spread;
    ReactXP.DeviceNetworkType = RXInterface.DeviceNetworkType;
})(ReactXP || (ReactXP = {}));
ViewBase_1.ViewBase.setActivationState(App_1.default.getActivationState());
App_1.default.activationStateChangedEvent.subscribe(function (newState) {
    ViewBase_1.ViewBase.setActivationState(newState);
});
// -- STRANGE THINGS GOING ON HERE --
//
// 1) Unused variable
//    This forces TypeScript to type-check the above RX module against the common RX interface. Missing/incorrect types will cause errors.
//    Note: RX must be a module so 'RX.Foo' can be a valid value ('new RX.Foo') and valid type ('var k: RX.Foo'), but modules cannot
//    implement an interface. If RX was a class or variable then it could directly check this, but then 'RX.Foo' would not be a valid type.
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
