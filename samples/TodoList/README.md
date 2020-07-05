# RXPTodoList

This app works on React Native (iOS, Android, Windows) and web.

The commands in the instructions below assume you are in the root of this repo.

### Building

- From the RXPTodoList directory, run `npm install`. This fetches the dependencies.

### Building for Web

- Run `npm run start-web`. This compiles the TypeScript code and recompiles it whenever any files are changed.
- Run `node nodeserver.js`. This starts a local web server on localhost port 8080
  - On Windows, if there is another process already bound to port 8080, the node server will fail to start ("Error listen EACCES 0.0.0.0:8080").
- Within a browser, open http://localhost:8080/

### Building for iOS

- Run `npm run start-ios`. This compiles the TypeScript code and recompiles it whenever any files are changed.
- In another command prompt run `npm run start`. This starts the React Native Packager.
- In another command prompt run `npx pod-install && npx react-native run-ios`

### Building for Android

- Run `npm run start-android`. This compiles the TypeScript code and recompiles it whenever any files are changed.
- In another command prompt run `npm run start`. This starts the React Native Packager.
- In another command prompt run `npx react-native run-android`

### Building for Windows

- Run `npm run start-windows`. This compiles the TypeScript code and recompiles it whenever any files are changed.
- In another command prompt run `npm run start`. This starts the React Native Packager.
- Open the project (in the windows directory) in Visual Studio and build it like any other React Native project.


# Concepts
This sample demonstrates a number of concepts that you can leverage within your app. Some of these concepts demonstrate advanced ways to orchestrate the build of a more complex cross-platform app. Others demonstrate coding techniques within the app.

## Gulp-based Build
Most of the other ReactXP samples use a simple build technique where the build script is implemented entirely within the package.json "scripts" section. This sample demonstrates a more sophisticated build that leverages [gulp](https://www.npmjs.com/package/gulp), a popular automation toolkit.

The script logic is mostly located in the file gulpfile.js. This script also makes use of buildconfig.js, which defines all of the build parameters (such as paths and config options).

The package.json "scripts" section defines two scripts for each platform.

```start-<platform>```: performs an ```npm install``` followed by ```gulp-<platform>```

```gulp-<platform>```: performs the build steps for that platform and continues to watch for changes to the code

If you are collaborating with others on your project, it's recommended that you run ```start-<project>``` after pulling the latest code. From that point forward, it's sufficient to run ```gulp-<project>```, unless you change the package.json dependencies.

If you want to add a gulp-based build to your project, you will need to include ```gulp``` and a bunch of related utility packages (like ```path``` and ```yargs```) in your "devDependencies". See the list of dependencies required at the top of the ```gulpfile.js``` file.

The scripts in the sample all set ```MODE_ENV=developement```, which produces development builds. You could easily add variants of these scripts that set ```MODE_ENV=production``` and produce production builds.


## Inline Requires
This sample shows how to apply a custom babel filter that inlines all requires. This is important for performance reasons because it defers the initialization of a module until it is called the first time. Without this optimization, all modules are initialized at app launch time, before the app's javascript entry point is reached.

The babel plugin is included in the "buildtools/inline-require.js" directory, and it's invoked by the packager (webpack on we builds or the RN packager on native builds).

To apply this technique to your project, copy the inline-require.js file. Add the babel-* dependencies to the "devDependencies" section of your package.json file. Copy the contents of the ".babelrc" configuration file at the root directory of the project. Modify the webpack.config.ts to include a rule that invokes the babel-loader. Note that the RN packager automatically runs babel and will honor the ".babelrc" if it's present.

## Replacing Defines
The sample shows a technique whereby certain symbols in the source code can be replaced with literal values at build time. For example, the symbol ```__DEV__``` is replaced with ```true``` or ```false``` depending on whether the build is a development or production build.

This replacement is performed by either a gulp task (see method ```replaceFlags``` in gulpfile.js) for native builds or a webpack plugin (see the "plugins" section of "webpack.config.ts") on web builds.

If you want to use this technique in your project, copy those relevant sections from gulpfile.js and webpack.config.ts.

## Platform-specific Code Modules
ReactXP attempts to enable most of your app's code to be platform-agnostic. However, there are times when it's necessary to write platform-specific code. The recommended approach is to encapsulate the functionality within a module that has a common interface but different, per-platform, implementations.

This sample shows a way to "link" the appropriate code based on the platform type. It does this through the use of flexible aliasing in both webpack and the RN packager.

To write a module that contains platform-specific code, create a new directory under "modules", and give it the name of your module. Within that directory, provide platform-specific implementations named ```index.<platform>.ts[x]```. The aliasing mechanism also supports common fallbacks. For example, if you can use the same implementation for all native platforms (ios, android, windows, macos), create a file called ```index.native.ts[x]```. Likewise, a "universal" fallback can be provided with the name ```index.ts[x]```.

To consume a platform-specific module elsewhere within your code, import it with an absolute path that starts with 'module/'. For example, if you created a module called 'linear-gradient', you would import it as follows:

```
import LinearGradient from 'module/linear-gradient';
```

This aliasing technique is implemented primarily in the buildconfig.js file. Refer to the ```getModuleAliases``` function, which computes the aliases array. These aliases are then applied at build time by either the ```apply-aliases``` gulp step in the case of native builds or through a webpack plugin (see the "aliases" section of webpack.config.ts) for web builds.

To incorporate this techinque into your project, copy the relevant sections of buildconfig.js, gulpfile.js, and webpack.config.ts.

## Local Web Server
The other ReactXP samples allow you to run the resulting web app by simply opening the ```index.html``` file in your browser. This sample shows a more advanced technique that uses a simple local web server running in node. This web server is not intended for development only, not for production hosting.

To configure and run the local web server, refer to the instructions in docs/setup.

To add this mechanism to your project, copy the nodeserver.js file to the root of your project.


## Stores and Auto-subscriptions
This sample demonstrates the use of [ReSub](https://www.npmjs.com/package/resub), which provides a way for components to auto-subscribe to data stores and automatically get notified when the underlying data changes. Unlikely many other mechanisms based on flux (e.g. redux), this technique involves minimal boilerplate code because it leverages features within the TypeScript language to install subscriptions automatically.

To use this mechanism within your project, add resub as a dependency. Use ComponentBase as the base class for your components and StoreBase as the base class for your stores.

## Services & Service Manager
It is often necessary within a more complicated app to implement singleton modules that live for extended periods of time - often the entire time the app is running. These so-called "services" can perform a wide variety of work. In a more complex app, some services can depend on other services. This dependency tree can be difficult to manage, so we created a ServiceManager and ServiceRegistrar module. The latter is used to register all services. Each service exposes a startup method that returns a promise. THe startup method isn't called until the service is needed. At that time, the ServiceManager starts all other dependent services, then starts the requested service. If the service is already running, it immediately returns.

If a service must be started at app launch time, it can be started within the app's main entry point. Refer to the method ```_startCriticalServices``` in app/AppBootstrapper.tsx.

## Custom Fonts
This sample demonstrates how to include custom fonts within your project. It uses a platform-specific module called "fonts" to provide per-platform font selection.

On the web, the custom fonts are referenced by "@font-face" CSS directives in ```web\css\app.css```. They are included directly within the various native projects (XCode, gradle, Visual Studio) for the native projects.

## Static Images
This sample demonstrates how to include static images within your project. It uses a platform-specific module called "images" to provide per-platform image selection. This is required because the RN Packager demands the use of static require paths within the code, whereas web builds require a relative URL.

Refer to the ```modules/images/``` directory for details.

## Navigation Contexts
There are many ways to implement navigation in React apps. This sample demonstrates one such technique that allows the app to switch between "stack-based" navigation (which is most appropriate for small screen sizes) and "composite" navigation where multiple panels are visible side by side (most appropriate for larger screen sizes). The sample app is able to switch between these two modes as you resize your browser.

A "navigation context" defines a location in the app. Many nav contexts also include state variables (such as the "current selected item") that are related to navigation. Nav contexts can be converted to and from deep links, which take the form of a URI. More on this below.

The NavContextStore is responsible for maintaining the current navigation location within the app - and a variable that indicates whether the app is currently using stack-based or composite mode. Any changes in navigation must update this store. When an update occurs, the top layers of the view hierarchy are notified of the change, and they initiate a re-render if necessary. Refer to the views/RootView.tsx file for details.

The NavContextStore module exposes methods for navigating to a new context. See ```navigateToTodoList``` for an example.

## Other Useful Modules
The sample implements several other useful modules that you may want to copy into your project.

### Styles
The app/Styles module provides common definitions for colors, fonts, font sizes, etc. It's useful to define these within one place to facilitate app-wide themeing and enforce a consistent design language.

### AppConfig
The app/AppConfig module provides accessor methods for static configuration information - like platform, app version, development flag, and various paths. This is not considered a "store" because the information provided by this module never changes at runtime.

### ResponsiveWidthStore
The store/ResponsiveWidthStore module provides subscribers with information about the current width and height of the app's main view area. It defines a small number of "break points" that top-level components can use to determine the best layout for a range of screen sizes.

### DeepLinkConverter & PageUrlService
The app/DeepLinkConverter module is responsible for converting between deep links (URIs) and nav contexts - and vice versa. It enables deep linking within the app.

The services/PageUrlService module is a web-specific service that monitors the current nav context and, if necessary, updates the browser's navigation history. It also provides handlers for the browser navigation buttons (back and forward arrows).

### ShimHelpers
The utilities/ShimHelpers module provides shim implementations of several methods that are commonly used by npm modules but are not present in some environments like React Native.

### ExceptionReporter
The utilities/ExceptionReporter module catches exceptions that are otherwise uncaught and presents them to the user in the form of a dialog. This is useful for development builds. In production builds, these same exceptions should be quietly logged without interrupting the user.

### HoverButton
The controls/HoverButton module provides a simple way to track the hover state of a button, which can be re-rendered when the mouse pointer enters or leaves the button's area.

### SimpleButton
The controls/SimpleButton module implements a simple text button with rounded corners. You can change the default styling to match the design language of your application.

### SimpleDialog
The controls/SimpleDialog module implements a simple dialog box with text and buttons. It handles keyboard input (e.g. enter or esc keys). It also demonstrates how to animate the display and dismissal of a dialog. You can change the default styling to match the design language of your application.

### SimpleMenus
The controls/SimpleMenus module implements a simple menu that supports dividers and checkboxes. It's intended to be displayed within an RX.Popup.

