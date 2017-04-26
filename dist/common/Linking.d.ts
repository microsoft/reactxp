import RX = require('../common/Interfaces');
import Types = require('../common/Types');
import SyncTasks = require('synctasks');
export declare abstract class Linking extends RX.Linking {
    protected abstract _openUrl(url: string): SyncTasks.Promise<void>;
    launchEmail(emailInfo: Types.EmailInfo): SyncTasks.Promise<void>;
    launchSms(phoneInfo: Types.SmsInfo): SyncTasks.Promise<void>;
    openUrl(url: string): SyncTasks.Promise<void>;
    private _createEmailUrl(emailInfo);
    protected _createSmsUrl(smsInfo: Types.SmsInfo): string;
    private _isEmailValid(email);
    private _filterValidEmails(emails);
}
