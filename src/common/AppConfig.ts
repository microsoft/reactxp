/**
* AppConfig.tsx
* Copyright: Microsoft 2017
*
* A simple class to store application config. 
*/

export class AppConfig {
    private _isDebug = false;
    private _isDevelopment = false;

    setAppConfig(isDebug: boolean, isDevelopment: boolean) {
        this._isDebug = isDebug;
        this._isDevelopment = isDevelopment; 
    }

    isDebugMode(): boolean {
        return this._isDebug;
    }

    isDevelopmentMode(): boolean {
        return this._isDevelopment;
    }
}

var instance = new AppConfig();
export default instance;
