/**
* ServiceManager.tsx
* Copyright: Microsoft 2018
*
* Coordinates startup of all services. A service is any long-running
* singleton object. Services may depend on other services. The service
* manager will guarantee that all dependent services are started before
* the startup method is called for a service.
*/

import * as assert from 'assert';

import * as _ from 'lodash';
import * as SyncTasks from 'synctasks';

export interface Service {
    startup(): SyncTasks.Thenable<void>;
}

interface ServiceInfo {
    service: Service;
    name: string;
    dependencies: Service[];
    startupPromise: SyncTasks.Promise<void>|undefined;
    hasBegunStartingUp: boolean;
    isComplete: boolean;
}

export default class ServiceManager {
    private static _serviceInfos: ServiceInfo[] = [];

    static registerService(service: Service, name: string, dependencies: Service[] = []) {
        if (_.find(ServiceManager._serviceInfos, info => info.service === service)) {
            assert.ok(false, 'Duplicate startup registration for object: ' + ServiceManager._getName(service));
            return;
        }

        const serviceInfo: ServiceInfo = {
            service,
            name,
            dependencies,
            startupPromise: undefined,
            hasBegunStartingUp: false,
            isComplete: false,
        };
        ServiceManager._serviceInfos.push(serviceInfo);
    }

    static hasStarted(startupable: Service): boolean {
        const startupInfo = _.find(ServiceManager._serviceInfos, info => info.service === startupable);
        assert.ok(startupInfo, 'Service not found in hasStarted: ' + ServiceManager._getName(startupable));
        return startupInfo.isComplete;
    }

    static ensureStarted(services: Service[]): SyncTasks.Promise<void> {
        return SyncTasks.all(_.map(services, service =>
            ServiceManager.ensureStartedSingle(service))).then(_.noop);
    }

    static ensureStartedSingle(service: Service): SyncTasks.Promise<void> {
        const foundInfo = _.find(ServiceManager._serviceInfos, info => info.service === service);
        if (!foundInfo) {
            assert.ok(false, 'Service not registered for startup: ' + ServiceManager._getName(service));
            return SyncTasks.Rejected<void>('Service not registered for startup: ' +
                ServiceManager._getName(service));
        }
        const startupInfo = foundInfo;
        startupInfo.hasBegunStartingUp = true;

        if (startupInfo.startupPromise) {
            // Startup has begun and/or completed.
            return startupInfo.startupPromise;
        }

        // Pre-wrap this in a promise, since when you async wrap around to cascade
        // dependencies, you need startupPromise to already be set!
        const deferred = SyncTasks.Defer<void>();
        startupInfo.startupPromise = deferred.promise();

        // Make sure all dependencies have launched.
        ServiceManager.ensureStarted(startupInfo.dependencies).then(() => {
            const startupPromise = _.attempt(() => service.startup());

            if (_.isError(startupPromise)) {
                return SyncTasks.Rejected<void>(startupPromise);
            } else {
                return startupPromise;
            }
        }).then(() => {
            startupInfo.isComplete = true;

            deferred.resolve(void 0);
        }, err => {
            deferred.reject(err);
        });

        return startupInfo.startupPromise;
    }

    private static _getName(service: Service): string {
        const startupInfo = _.find(ServiceManager._serviceInfos, info => info.service === service);
        if (startupInfo) {
            return startupInfo.name;
        }

        return 'unknown';
    }
}
