module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin'
  ],
  env: {
    testing: {
      plugins: [
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-class-properties", { loose: true }]
      ],
      presets: [
        [ "@babel/plugin-transform-runtime", { targets: { node: "current" }}]
      ],
    }
  }
}
