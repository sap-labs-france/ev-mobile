# eMobility React Native Mobile App

## Summary

This application is the Electric Vehicle Charging Station (EVSE) mobile application for Android and iOS.

## Installation

* Install NodeJS: https://nodejs.org/ (install the LTS version)
* Install Python version 2.7 (not the version 3.7!)
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
    ```
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```
* Install Xcode: https://developer.apple.com/xcode/
* Clone this GitHub project
* Go into the **ev-mobile** directory and run **npm install** or **yarn install**

**NOTE**: On Windows with **chocolatey** (https://chocolatey.org/),
do as an administrator:
```
choco install -y nodejs-lts python2 jdk8 androidstudio
```
to install some of the needed dependencies

## Running the application on a virtual device

Open a terminal in the **ev-mobile** directory

* Install CocoaPods on Mac OSX:

  ```
  npm run pod:install
  ```

* Run on Android:
  Setup and start an Android virtual device in Android Studio

  ```
  npm run android
  ```

* Run on iOS:

  ```
  npm run ios
  ```

## License

This file and all other files in this repository are licensed under the Apache Software License, v.2 and copyrighted under the copyright in [NOTICE file](NOTICE), except as noted otherwise in the [LICENSE file](LICENSE).

Please note that the mobile application can contain other software which may be licensed under different licenses.
