# reactxp-netinfo
This module provides cross-platform support for detecting network ionformation within the [ReactXP](https://microsoft.github.io/reactxp/) library. This used to be a part of ReactXP core, but was extracted to be a standalone module inline with React Native `Lean Core` initiative. This exists as a standalone module to prevent users of ReactXP from having to link native modules when getting started.

## Getting Started
This module relies on [@react-native-community/netinfo](https://www.npmjs.com/packages/@react-native-community/netinfo) and will need to be linked into the react-native project.
This can be done by following the linking instructions in the React Native documentation or by running
```react-native link @react-native-community/netinfo```

## Documentation
For detailed documentation, look [here](https://microsoft.github.io/reactxp/docs/extensions/netinfo.html).

### Prerequisites
* [ReactXP](https://github.com/microsoft/reactxp/)

## Contributing
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments. 

You must sign a Contribution License Agreement (CLA) before your PR will be merged. This a one-time requirement for Microsoft projects in GitHub. You can read more about [Contribution License Agreements (CLA)](https://en.wikipedia.org/wiki/Contributor_License_Agreement) on Wikipedia. You can sign the Microsoft Contribution License Agreement by visiting https://cla.microsoft.com/. Use your GitHub account to login.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
