
## install resub
    D:\lib\reactxp\samples\hello-resub>yarn add resub@latest

## Add Store named HelloStore
  add a new file in src fold,and named it with helloStore.ts
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



## Add Component With HelloStore
    add a new file in src fold,and named it with hello.tsx
    import { ComponentBase } from 'resub';
    import RX = require('reactxp');

    // should use require? for export=
    import HelloStore =require('./helloStore');

    interface HelloState {
        Hello?: string;
    }

    class Hello extends ComponentBase<{}, HelloState> {
        protected _buildState(props: {}, initialBuild: boolean): HelloState {
            return {
                Hello: HelloStore.getHello()
            }
        }

        render(): JSX.Element | null  {
            return (
                <RX.Text>
                    { this.state.Hello }
                </RX.Text>
            );
        }
    }

    // notice it
    export = Hello;

## show hello component in app.tsx
  import Hello =require('./hello');
  and then add hello component in render function
                <RX.Text style={ styles.welcome }>
                    Welcome to ReactXP
                </RX.Text>
                <Hello >                    
                </Hello>



## build it
    D:\lib\reactxp\samples\hello-resub>yarn run web-watch
    a compile error here:
    ERROR in [at-loader] ./node_modules/resub/dist/src/StoreBase.d.ts:13:20
        TS7016: Could not find a declaration file for module 'lodash'. 'D:/lib/reactxp/samples/hello-resub/node_modules/lodash/lodash.js' implicitly has an 'any' type.

## open the index.html at browser
    we could run it now,show "hello resub" under Welcome to ReactXP
