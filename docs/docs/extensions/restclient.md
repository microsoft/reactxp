---
id: extensions/restclient
title: REST Client
layout: docs
category: Extensions
permalink: docs/extensions/restclient.html
next: extensions/video
---

ReactXP provides basic [Network APIs](/reactxp/docs/apis/network) for determining network connectivity, but it doesn't provide ways to access the network once connected.

This extension provides a cross-platform mechanism for wrapping a simple REST API. It supports optional retry logic (including exponential backoff).

For more details, refer to the [SimpleRestClients](https://github.com/Microsoft/SimpleRestClients) github site.

To install: ```npm install simplerestclients```

### Sample Usage

``` javascript
interface User {
    id: string;
    firstName: string;
    lastName: string;
}

class MyRestClient extends GenericRestClient {
    constructor(private _appId: string) {
        super('https://myhost.com/api/v1/');
    }

    // Override _getHeaders to append a custom header with the app ID.
    protected _getHeaders(options: ApiCallOptions): { [key: string]: string } {
        let headers = super._getHeaders(options);
        headers['X-AppId'] = this._appId;
        return headers;
    }

    // Define public methods that expose the APIs provided through
    // the REST service.
    getAllUsers(): SyncTasks.Promise<User[]> {
        return this.performApiGet<User[]>('users');
    }

    getUserById(id: string): SyncTasks.Promise<User> {
        return this.performApiGet<User>('user/' + id);
    }

    setUser(user: User): SyncTasks.Promise<void> {
        return this.performApiPut<void>('user/' + user.id, user);
    }
}
```