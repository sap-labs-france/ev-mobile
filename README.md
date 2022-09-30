<img src="https://user-images.githubusercontent.com/32574035/193282473-32e9490b-3d03-4826-a819-872b6c2a0898.png" alt="drawing" width="200"/>


# Open e-Mobility React-Native Mobile App

## Summary

This application is the Electric Vehicle Charging Station (EVSE) mobile application for Android and iOS.

It's linked to the Open e-Mobility backend: https://github.com/sap-labs-france/ev-server

**App Stores**

<a href="https://play.google.com/store/apps/details?id=com.emobility" target="_blank">Google Play</a>

<a href="https://apps.apple.com/us/app/e-mobility/id1443813480?ls=1" target="_blank">Apple Store</a>

**Contact the author** <a href="https://www.linkedin.com/in/serge-fabiano-a420a218/" target="_blank">Serge FABIANO</a>

## NPM and Cocoapods

The project now uses npm 8.x and cocoapods 1.11.2

## Installation

* Install NodeJS: https://nodejs.org/ (install the LTS version)
* Install Java SE Development Kit 8
* Install React Native: https://facebook.github.io/react-native/
  ```
  npm install -g react-native-cli
  ```
* Install Android Studio: https://developer.android.com/studio/
  * Ensure Android SDK Platform 28 and Intel x86 Atom_64 System Image are checked in the SDK manager.
  * Windows:
    * Add user environment variable:
      **ANDROID_HOME=C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk**
    * Add **C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk\platform-tools** to user paths
  * OSX/*nix:
    * Add to your shell profile:
    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```
* Install Xcode: https://developer.apple.com/xcode/
* Clone this GitHub project
* Go into the **ev-mobile** directory and run **npm install** or **yarn install**

**NOTE**:

* On Windows with **chocolatey** (https://chocolatey.org/), do as an administrator:

```powershell
choco install -y nodejs-lts jdk8 androidstudio
```

* On Mac OSX with **Homebrew** (https://brew.sh/), do:

```shell
brew install node openjdk cocoapods react-native-cli watchman android-studio
```

## Running the application on a virtual device

Open a terminal in the **ev-mobile** directory

* Install CocoaPods on Mac OSX:

  ```shell
  npm run pod:install
  ```

* Run on Android:

  ```shell
  npm run build:prepare
  npm run android
  ```

* Run on iOS:

  ```shell
  npm run build:prepare
  npm run ios
  ```

## License

This file and all other files in this repository are licensed under the Apache Software License, v.2 and copyrighted under the copyright in [NOTICE](NOTICE) file, except as noted otherwise in the [LICENSE](LICENSE) file.

Please note that the mobile application can contain other software which may be licensed under different licenses.
