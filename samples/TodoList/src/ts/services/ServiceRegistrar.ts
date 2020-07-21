/**
* ServiceRegistrar.tsx
* Copyright: Microsoft 2018
*
* Registers all services (long-running singleton objects) with the
* ServiceManager. Should be called at app launch time.
*/

import AppConfig from '../app/AppConfig';

import TodosStore from '../stores/TodosStore';

import PageUrlService from './PageUrlService';
import ServiceManager from './ServiceManager';

export default class ServiceRegistrar {
    static init() {
        ServiceManager.registerService(TodosStore, 'TodosStore');

        // Web-specific services
        if (AppConfig.getPlatformType() === 'web') {
            ServiceManager.registerService(PageUrlService, 'PageUrlService');
        }
    }
}
