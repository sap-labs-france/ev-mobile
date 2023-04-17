module.exports = {
  preset: 'react-native',
  reporters: [ "default", "jest-junit" ],
  testResultsProcessor: "jest-junit",
  setupFiles: ["./jest.setup.js"],
  globals: {
    'ts-jest': {
      // Tell ts-jest about our typescript config.
      tsconfig: 'tsconfig.spec.json'
    },
  },
  // Transforms tell jest how to process our non-javascript files.
  // Here we're using babel for .js and .jsx files, and ts-jest for
  // .ts and .tsx files.  You *can* just use babel-jest for both, if
  // you already have babel set up to compile typescript files.
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.ts?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // Tells Jest what folders to ignore for tests
  testPathIgnorePatterns: [`node_modules`, `\\.cache`],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)',
  ]
}
