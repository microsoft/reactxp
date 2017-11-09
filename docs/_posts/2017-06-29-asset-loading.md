---
title: Asset Loading
author: erictraut
---

We've received questions about how we handle assets (images, videos, sounds) in a way that works for both React Native and React JS (web). 

### Specifying Asset Locations

On the web, assets are simply referenced by URL and are loaded asynchronously by the browser. 

``` javascript
<RX.Image source={ 'https://mydomain.com/images/appLogoSmall.jpg' }/>
```

React Native apps typically package assets in the app bundle, so they are loaded from the local device storage. In this case, the path is specified in the form of a relative file system path. However, instead of passing the path directly, you need to invoke the React Native packager by calling "require". 

``` javascript
<RX.Image source={ require('./images/appLogoSmall.jpg') }/>
```

The packager requires that the asset path is specified as a string literal. In other words, it cannot be constructed at runtime or returned by a helper method. For more details about this limitation, refer to the [React Native documentation](https://facebook.github.io/react-native/docs/images.html).

This makes it difficult to write cross-platform code that runs on both web and native platforms. Here's how we solved this problem in the Skype app.



### AppAssets Module

We created an "AppAssets" interface that includes an accessor method for each of the assets in our app. 

``` javascript
// File: AppAssets.d.ts

declare module 'AppAssets' {
    interface IAppAssets {
        appLogoSmall: string;
        appLogoLarge: string;
        notificationIcon: string;
        // ... etc.
    }
    const Assets: IAppAssets;
}
```

We then implemented this interface for both web and native platforms.

``` javascript
// File: AppAssetsWeb.ts

import AppAssets = require('AppAssets');
import AppConfig = require('./AppConfig');

class AppAssetsImpl implements AppAssets.IAppAssets {
    appLogoSmall = AppConfig.getImagePath('skypeLogoSmall.png');
    appLogoLarge = AppConfig.getImagePath('skypeLogoLarge.png');
    notificationIcon = AppConfig.getImagePath('notificationIcon.gif');
    // ... etc.
}

export const Assets: AppAssets.IAppAssets = new AppAssetsImpl();
```

``` javascript
// File: AppAssetsNative.ts

import AppAssets = require('AppAssets');

class AppAssetsImpl implements IAppAssets.Collection {
    get appLogoSmall() { return require('..images/skypeLogoSmall.png'); }
    get appLogoLarge() { return require('..images/skypeLogoLarge.png'); }
    get notificationIcon() { return require('../images/notificationIcon.gif'); }
    // ... etc.
}

export const Assets: AppAssets.IAppAssets = new AppAssetsImpl();
```

There are a few things worth noting in the code above. First, we're making use of an interface to ensure that the web and native implementations stay in sync. If you forget to add an asset to both files, the TypeScript compiler will detect the error at build time.

Second, the web implementation is using a helper method ```getImagePath``` to construct the full URL. It builds this using a dynamically-configurable domain name, allowing us to stage the app to a test web server or publish it to the production server.

Third, the native implementation makes use of accessors. This defers the loading of the asset until the first time it is first accessed. Without this trick, all assets would be loaded at the time the AppAssetsNative module was initialized, adding to app startup time.

Now we can reference the assets in a cross-platform way. 

``` javascript
import AppAssets = require('AppAssets');

<RX.Image source={ AppAssets.Assets.appLogoSmall }/>
```


### Aliasing

Now that we have two implementations (one for web and a second for native), how do we "link" the correct version based on the platform that we're building? We do this through a lightweight "aliasing" step in our build process. This step replaces the ```require('AppAssets')``` with either ```require('./ts/AppAssetsWeb')``` or ```require('./ts/AppAssetsNative')``` depending on the platform being built.

I'll provide examples in [gulp](http://gulpjs.com/) syntax, but the same technique can be used in [grunt](https://gruntjs.com/) or other task scripting runtimes.

``` javascript
var config = {
    aliasify: {
        src: './.temp/' + argv.platform,
        dest: getBuildPath() + 'js/',
        aliases: (argv.platform === 'web') ?
        // Web Aliases
        {
            'AppAssets': './ts/AppAssetsWeb'
        } :
        // Native Aliases
        {
            'AppAssets': './ts/AppAssetsNative'
        }
    }
}

function aliasify(aliases) {
    var reqPattern = new RegExp(/require\(['"]([^'"]+)['"]\)/g);

    // For all files in the stream, apply the replacement.
    return eventStream.map(function(file, done) {
        if (!file.isNull()) {
            var fileContent = file.contents.toString();
            if (reqPattern.test(fileContent)) {
                file.contents = new Buffer(fileContent.replace(reqPattern, function(req, oldPath) {
                    if (!aliases[oldPath]) {
                        return req;
                    }

                    return "require('" + aliases[oldPath] + "')";
                }));
            }
        }

        done(null, file);
    });
}

gulp.task('apply-aliases', function() {
    return gulp.src(path.join(config.aliasify.src, '**/*.js'))
        .pipe(aliasify(config.aliasify.aliases))
        .pipe(gulp.dest(config.aliasify.dest))
        .on('error', handleError);
});

// Here's our full build task pipeline. I haven't provided the task
// definitions for all of these stages, but you can see where the
// 'apply-aliases' task fits into the pipeline.
gulp.task('run', function(callback) {
    runSequence('clean', 'build', 'apply-aliases', 'watch', 'lint', callback);
});
```

