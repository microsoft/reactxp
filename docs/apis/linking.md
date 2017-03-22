---
id: apis/linking
title: Linking
layout: docs
category: Interfaces
permalink: docs/apis/linking.html
next: apis/location
---

This interface handles deep linking in both incoming and outgoing directions. Incoming deep links instruct the app to take actions requested by other apps. Outgoing deep links instruct other apps to perform actions.

## Types
``` javascript
// Information used to invoke the default SMS app
interface SmsInfo {
    phoneNumber?: string;
    body?: string;
}

// Information used to invoke the default email app
interface EmailInfo {
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    body?: string;
}

// Error returned by promise if the request fails
interface LinkingErrorInfo {
    code: LinkingError;
    url: string;
    error?: string;
}

enum LinkingErrorCode {
    NoAppFound = 0,
    UnexpectedFailure = 1,
    Blocked = 2,
    InitialUrlNotFound = 3
}
```

## Methods
``` javascript
// Returns the URL that was used to launch tha application
getInitialUrl(): SyncTasks.Promise<string>;

// Requests the URL to be opened by the default app for that protocol
// (e.g. http or https would typically open the system browser)
openUrl(url: string): SyncTasks.Promise<void>;

// Requests the default SMS app to be invoked
launchSms(smsData: SmsInfo): SyncTasks.Promise<void>;

// Requests the default mail app to be invoked
launchEmail(emailData: EmailInfo): SyncTasks.Promise<void>;
```

## Events
``` javascript
// Triggered when a new deep link request arrives
deepLinkRequestEvent: SubscribableEvent<(url: string) => void>;
```
