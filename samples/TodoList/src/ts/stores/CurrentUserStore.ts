/**
* CurrentUserStore.tsx
* Copyright: Microsoft 2018
*
* Singleton store that maintains information about the currently-signed-in user.
*/

import { autoSubscribe, AutoSubscribeStore, StoreBase } from 'resub';

import { User } from '../models/IdentityModels';

@AutoSubscribeStore
export class CurrentUserStore extends StoreBase {
    // TODO - properly initialize
    private _user: User = {
        id: '1',
        fullName: 'Adam Smith',
        email: 'adam.smith@sample.com'
    };

    @autoSubscribe
    getUser(): User | undefined {
        return this._user;
    }

    @autoSubscribe
    getFullName(): string {
        return this._user ? this._user.fullName : '';
    }
}

export default new CurrentUserStore();
