# Charge-Angels React Native Mobile App

## Summary

This application is the Electric Vehicule Charging Station (EVSE) mobile application for Android and iOS.

## Installation

* Install NodeJS: https://nodejs.org/ (install the LTS version)
* Install Python version 2.7 (not the version 3.7!)
* Install Java SE Development Kit 8
* Install React Native: https://facebook.github.io/react-native/
  ```
  npm install -g expo-cli
  ```
* Install Android Studio: https://developer.android.com/studio/
  * Ensure Android SDK Platform 28 and Intel x86 Atom_64 System Image are checked in the SDK manager.
  * Add a user environment variable:
    **ANDROID_HOME=C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk**
  * Add **C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk\platform-tools** to the user paths
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

* Run on Android:  
  Setup and start an Android virtual device in Android Studio
  ```
  npm run android
  ``` 

* Run on iOS:
  ```
  npm run ios
  ```