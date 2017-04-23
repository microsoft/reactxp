/*
* PluginBaseChecker.ts
* Copyright: Microsoft 2017
*
* Type check all the pluginbase exports against the desired interface.
*/

import Interfaces = require('./Interfaces');

import AndroidPlugin = require('../android/PluginBase');
import iOSPlugin = require('../ios/PluginBase');
import WebPlugin = require('../web/PluginBase');
import WindowsPlugin = require('../windows/PluginBase');

/* tslint:disable:no-unused-variable */
const _typeCheckerAndroid: Interfaces.PluginInterface = AndroidPlugin;
const _typeCheckeriOS: Interfaces.PluginInterface = iOSPlugin;
const _typeCheckerWeb: Interfaces.PluginInterface = WebPlugin;
const _typeCheckerWindows: Interfaces.PluginInterface = WindowsPlugin;
/* tslint:enable:no-unused-variable */
