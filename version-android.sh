#!/usr/bin/env bash -e

PROJECT_DIR="android/app"
GRADLE_FILE="build.gradle"
GRADLE_RPATH="${PROJECT_DIR}/${GRADLE_FILE}"

# PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

PREVIOUS_BUILD_NUMBER=$(cat "${GRADLE_RPATH}" | grep versionCode | head -1 | awk -F' ' '{ print $2 }' | tr -d '[[:space:]]')
BUILD_NUMBER=$(($PREVIOUS_BUILD_NUMBER + 1))

# Update with new values
sed -i\"\" "s/versionCode $PREVIOUS_BUILD_NUMBER/versionCode $BUILD_NUMBER/" ${GRADLE_RPATH}

git add "${GRADLE_RPATH}"
