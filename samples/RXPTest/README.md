# RXPTest

This app provides tests for all of the functionality exposed by ReactXP.

### Building

- From the RXPTest directory, run `npm install`. This fetches the dependencies.

### Building RXPTest for Web

- Run `npm run web-watch`. This compiles the TypeScript code and recompiles it whenever any files are changed.
- Open `index.html` in your browser to run the test in a browser.

### Building for React Native

- Run `npm run rn-watch`. This compiles the TypeScript code and recompiles it whenever any files are changed.
- In another command prompt run `npm start`. This starts the React Native Packager.
- For iOS or Android: Use Xcode or Android Studio to build and deploy the native app code just like you would with any other React Native project.
- For Windows: Open `windows\RXPTest.sln` in Visual Studio 2017. Build and run the app for x64 or x86.
