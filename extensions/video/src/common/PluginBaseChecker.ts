/*
 * PluginBaseChecker.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Type check all the pluginbase exports against the desired interface.
 */

import * as AndroidPlugin from '../android/PluginBase';
import * as iOSPlugin from '../ios/PluginBase';
import * as macOSPlugin from '../macos/PluginBase';
import * as WebPlugin from '../web/PluginBase';
import * as WindowsPlugin from '../windows/PluginBase';

import * as Interfaces from './Interfaces';

const _typeCheckerAndroid: Interfaces.PluginInterface = AndroidPlugin;
const _typeCheckeriOS: Interfaces.PluginInterface = iOSPlugin;
const _typeCheckermacOS: Interfaces.PluginInterface = macOSPlugin;
const _typeCheckerWeb: Interfaces.PluginInterface = WebPlugin;
const _typeCheckerWindows: Interfaces.PluginInterface = WindowsPlugin;
