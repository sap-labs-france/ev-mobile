module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    "@babel/plugin-transform-runtime",
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
  env: {
    testing: {
      presets: [
        [ "@babel/plugin-transform-runtime", { targets: { node: "current" }}],
      ],
    },
  }
}
