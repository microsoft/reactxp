module.exports = {
  plugins: [ 'lodash' ],
  presets: [
    ['@babel/preset-env', { targets: { node: true } }],
    'module:metro-react-native-babel-preset',
  ],
};
