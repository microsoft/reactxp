# ReactXP

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/Microsoft/reactxp/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/reactxp.svg?style=flat-square)](https://www.npmjs.com/package/reactxp) [![Build Status](https://dev.azure.com/ms/reactxp/_apis/build/status/Microsoft.reactxp)](https://dev.azure.com/ms/reactxp/_build/latest?definitionId=16) [![Build Status](https://img.shields.io/travis/Microsoft/reactxp/master.svg?style=flat-square)](https://travis-ci.org/Microsoft/reactxp) [![npm downloads](https://img.shields.io/npm/dm/reactxp.svg?style=flat-square)](https://www.npmjs.com/package/reactxp) [![David](https://img.shields.io/david/Microsoft/reactxp.svg?style=flat-square)](https://github.com/Microsoft/reactxp) [![David](https://img.shields.io/david/dev/Microsoft/reactxp.svg?style=flat-square)](https://github.com/Microsoft/reactxp) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Microsoft/reactxp#contributing) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/msreactxp/Lobby)


ReactXP is a library for cross-platform app development using React and React Native.

## Why ReactXP
With React and React Native, your web app can share most of its logic with your iOS and Android apps, but the view layer needs to be implemented separately for each platform. We have taken this a step further and developed a thin cross-platform layer we call ReactXP. If you write your app to this abstraction, you can share your view definitions, styles and animations across multiple target platforms. Of course, you can still provide platform-specific UI variants, but this can be done selectively where desired.

## Getting Started
The [samples](/samples) directory contains a minimal “Hello World” app that demonstrates some basic ReactXP functionality. You can use this as a starting point. Just follow the build instructions in the README file.

Also included in the samples directory is the [RXPTest app](/samples/RXPTest) which attempts to exercise all of the functionality of ReactXP. It is a good source to consult for sample usage of APIs, components, and props.

You can read more about ReactXP and its APIs from the [ReactXP official Documentation](https://microsoft.github.io/reactxp/docs/getting-started.html).

Use the command-line tool called [create-rx-app](https://github.com/a-tarasyuk/create-rx-app) to create a starter project.

```sh
npm install create-rx-app -g
create-rx-app AppName
```

or

```sh
npx create-rx-app AppName
```

By default the project will be created in TypeScript. However if you prefer JavaScript instead, add `--javascript` when creating the project.

This will create a directory called **AppName** inside the current working directory. Inside **AppName**, this will generate the initial project structure and install all of its dependencies. Once this installation is done, there are some commands you can run in the project directory:

- `npm run start:web` - runs the Web version of the app in the development mode
- `npm run build:web` - builds the Web version of the app for production to the **dist-web** folder
- `npm run start:ios` - runs the iOS version of the app and attempts to open in the iOS Simulator if you're on a Mac and have it installed
- `npm run start:android` - runs the Android version of the app and attempts to open your app on a connected Android device or emulator
- `npm run start:windows` - runs the Windows version of the app
- `npm start:rn-dev-server` - runs react native (RN) development server

### Prerequisites
* [Node.Js](https://nodejs.org/) ([Setup Instructions](https://nodejs.org/en/download/package-manager/))
* [React Native](https://facebook.github.io/react-native/) ([Setup Instructions](https://facebook.github.io/react-native/docs/getting-started))

## Contributing

We welcome contributions to ReactXP. See the [CONTRIBUTING](./CONTRIBUTING.md) file for how to help out.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
