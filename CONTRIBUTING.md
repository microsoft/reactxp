# Contributing to ReactXP

We welcome contributions to ReactXP! This gude provides some tips for a successful contributions.

For complex changes, we recommend filing a GitHub issue to start a discussion with project maintainers before implementing the change.

## Pull Requests

Please make sure the following is done when submitting a pull request:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add test code to the RXPTest sample app.
3. If you've changed APIs, update the documentation files.
4. Ensure the test suite passes.
5. If you haven't already, complete the Contributor License Agreement ("CLA").

## Testing Your Change

To test your change:
1. Rebuild reactxp: `npm i` and `npm run build`
2. Switch to the RXPTest sample directory: `cd ./samples/RXPTest`
3. Update dependencies: `npm i`
4. Copy the locally-built reactxp library: `cp -r ../../dist/* ./node_modules/reactxp/dist`
5. Rebuild the test app: `npm run web-watch` or `npm run rn-watch`
6. If testing the web version, open the test in the browser: `open ./index.html` and run the test
7. If testing one or more RN versions, open the corresponding native project and build and run the test

## Contributor License Agreement ("CLA")

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

You must sign a Contribution License Agreement (CLA) before your PR will be merged. This is a one-time requirement for Microsoft projects in GitHub. You can read more about [Contribution License Agreements (CLA)](https://en.wikipedia.org/wiki/Contributor_License_Agreement) on Wikipedia. You can sign the Microsoft Contribution License Agreement by visiting https://cla.microsoft.com/. Use your GitHub account to login.

## Issues

We use GitHub issues to track bugs.

## Coding Style

ReactXP is written in TypeScript and uses tslint to help enforce an internally-consistent coding style. Contributions should be consistent with this style.

