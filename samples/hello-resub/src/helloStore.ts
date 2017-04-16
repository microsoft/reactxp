import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

@AutoSubscribeStore
//store in resub, is a class extends from StoreBase.
class HelloStore extends StoreBase {

    //_helloString:string ,should give a type here
    private _helloString: string = 'hello resub!';

    @autoSubscribe
    // this method should return a string type
    getHello():string {
        return this._helloString;
    }
}

// export a instance of class HelloStore
export = new HelloStore();
