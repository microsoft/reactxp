# RXPHelloWorld

This app works on React Native (iOS, Android) and web. Most of the app's code is contained in `App.tsx`.

The commands in the instructions below assume you are in the root of this repo.

### Initial Setup

- Run `npm install`. This fetches the dependencies.

### Building for Web

- Run `npm run web-watch`. This compiles the TypeScript code and recompiles it whenever any files are changed.
- Open `index.html` in your browser to view the result.

### Building for React Native

- Run `npm run rn-watch`. This compiles the TypeScript code and recompiles it whenever any files are changed.
- Option 1: 
	- In another command prompt run `npm start`. This starts the React Native Packager.
	- Use Xcode or Android Studio to build and deploy the native app code just like you would with any other React Native project.
- Option 2
	- In another command prompt run `npm android` or `npm ios`. This starts the React Native Packager and deploys your application to the appropriate platform.
