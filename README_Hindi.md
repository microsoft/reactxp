# ReactXP

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/Microsoft/reactxp/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/reactxp.svg?style=flat-square)](https://www.npmjs.com/package/reactxp) [![Build Status](https://img.shields.io/travis/Microsoft/reactxp/master.svg?style=flat-square)](https://travis-ci.org/Microsoft/reactxp) [![npm downloads](https://img.shields.io/npm/dm/reactxp.svg?style=flat-square)](https://www.npmjs.com/package/reactxp) [![David](https://img.shields.io/david/Microsoft/reactxp.svg?style=flat-square)](https://github.com/Microsoft/reactxp) [![David](https://img.shields.io/david/dev/Microsoft/reactxp.svg?style=flat-square)](https://github.com/Microsoft/reactxp) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Microsoft/reactxp#contributing) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/msreactxp/Lobby)

ReactXP एक क्रॉस-प्लॅटफॉर्म ऍप डेवलपमेंट लाइब्रेरी है जिसमे React और React Native का उपयोग किया जाता है. 

##ReactXP क्यों ?
React और React Native के साथ आपका वेब ऍप, iOS और Android ऍप के साथ ज्यादातर तार्किक शेयर कर सकता है, लेकिन view layer आपको अलग से  इम्प्लीमेंट करना होगा हर एक प्लॅटफॉर्म के लिए. हमने एक कदम आगे लेकर एक हल्का क्रॉस-प्लॅटफॉर्म लेयर विकसित किया है जिसे हम ReactXP बुलाते है. अगर आप  आपके ऍप को इस abstraction के हिसाब से लिखते है फिर आप आपके view definitions, styles और animations को शेयर कर सकते है मल्टिपल टारगेट प्लेटफॉर्म्स पर. आप प्लेटफार्म स्पेसिफिक UI variants भी प्रदान कर सकते है जैसे आप चुनेंगे जब आपकी मर्ज़ी हो|

## शुरुआत
दिए हुए [samples](/samples) directory में आपको एक आसान सा “Hello World” ऍप मिलेगा जिसमे ReactXP के बुनियादी कार्यक्षमता दिखाई गई है. आप उससे स्टार्टिंग पॉइंट की तरह प्रयोग कर सकते है. दिए हुए README के सूचनाओं का पालन कर सकते है.

samples directory[RXPTest app](/samples/RXPTest) में RXPTest ऍप भी दिया गया है जो ReactXP के सारे कार्यक्षमताओं का उपयोग करने का प्रयास करता है.
ये एक अछि सोर्स है APIs, components और props का उपयोग जान्ने के लिए.

आप ReactXP और उसके APIs के बारे में और पड़ सकते है इस वेबसाइट पर [ReactXP official Documentation](https://microsoft.github.io/reactxp/docs/getting-started.html).

[create-rx-app](https://github.com/a-tarasyuk/create-rx-app) नाम के कमांड-लाइन टूल का उपयोग करके स्टार्टर प्रोजेक्ट बनाइये.

```sh
npm install create-rx-app -g
create-rx-app AppName
```

अथवा

```sh
npx create-rx-app AppName
```
शुरुवात में प्रोजेक्ट TypeScript में उपलब्ध किया जाता hai. लेकिन अगर आपको JavaScript में  करना हो तोह प्रोजेक्ट बनाते समय फिर `--javascript` का  उपयोग  करें.

ये **AppName** नाम का डायरेक्टरी बनाएगा वर्किंग डायरेक्टरी में. **AppName** के अंदर शुरुवाती प्रोजेक्ट का आकार बना हुआ रहेगा और सारे dependencies इनस्टॉल किये हुए रहेंगे. इंस्टालेशन ख़तम होने के बाद निचे दिए हुए कुछ commands आप रन कर सकते है प्रोजेक्ट डायरेक्टरी में :

- `npm run start:web` - ऍप के Web version को development mode में run करने के लिए
- `npm run build:web` - ऍप के Web version को बनता है production के लिए **dist-web** फोल्डर में
- `npm run start:ios` - ऍप के iOS version को run करके iOS Simulator में खोलके की कोशिश करता है अगर आप Mac इस्तेमाल कर रहे हो और उसमे इनस्टॉल किया हुआ हो
- `npm run start:android` - ऍप के Android version को run करके आपके ऍप को connected Android device या फिर emulator पर खोलने के कोशिश करता है
- `npm run start:windows` - ऍप के Windows version को run करता है
- `npm start:rn-dev-server` - React native (RN) development server run करता है

### Prerequisites
* [Node.Js](https://nodejs.org/) ([Setup Instructions](https://nodejs.org/en/download/package-manager/))
* [React Native](https://facebook.github.io/react-native/) ([Setup Instructions](https://facebook.github.io/react-native/docs/getting-started))

## Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

You must sign a Contribution License Agreement (CLA) before your PR will be merged. This is a one-time requirement for Microsoft projects in GitHub. You can read more about [Contribution License Agreements (CLA)](https://en.wikipedia.org/wiki/Contributor_License_Agreement) on Wikipedia. You can sign the Microsoft Contribution License Agreement by visiting https://cla.microsoft.com/. Use your GitHub account to login.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
