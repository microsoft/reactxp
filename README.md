# ReactXP

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/Microsoft/reactxp/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/reactxp.svg?style=flat-square)](https://www.npmjs.com/package/reactxp) [![Build Status](https://img.shields.io/travis/Microsoft/reactxp/master.svg?style=flat-square)](https://travis-ci.org/Microsoft/reactxp) [![npm downloads](https://img.shields.io/npm/dm/reactxp.svg?style=flat-square)](https://www.npmjs.com/package/reactxp) [![David](https://img.shields.io/david/Microsoft/reactxp.svg?style=flat-square)](https://github.com/Microsoft/reactxp) [![David](https://img.shields.io/david/dev/Microsoft/reactxp.svg?style=flat-square)](https://github.com/Microsoft/reactxp) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Microsoft/reactxp#contributing) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/msreactxp/Lobby)


ReactXP is a library for cross-platform app development using React and React Native.

## Why ReactXP
With React and React Native, your web app can share most of its logic with your iOS and Android apps, but the view layer needs to be implemented separately for each platform. We have taken this a step further and developed a thin cross-platform layer we call ReactXP. If you write your app to this abstraction, you can share your view definitions, styles and animations across multiple target platforms. Of course, you can still provide platform-specific UI variants, but this can be done selectively where desired.

## Getting Started
The [samples](/samples) directory contains a minimal “Hello World” app that demonstrates some basic ReactXP functionality. You can use this as a starting point. Just follow the build instructions in the README file.

Also included in the samples directory is the [RXPTest app](/samples/RXPTest) which attempts to exercise all of the functionality of ReactXP. It is a good source to consult for sample usage of APIs, components, and props.

You can read more about ReactXP and its APIs from the [ReactXP official Documentation](https://microsoft.github.io/reactxp/docs/getting-started.html).

Use the command-line tool called [create-rx-app](https://github.com/a-tarasyuk/create-rx-app) to create a starter project.

### Prerequisites
* [Node.Js](https://nodejs.org/)
* [React Native](https://facebook.github.io/react-native/)

## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

You must sign a Contribution License Agreement (CLA) before your PR will be merged. This is a one-time requirement for Microsoft projects in GitHub. You can read more about [Contribution License Agreements (CLA)](https://en.wikipedia.org/wiki/Contributor_License_Agreement) on Wikipedia. You can sign the Microsoft Contribution License Agreement by visiting https://cla.microsoft.com/. Use your GitHub account to login.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
