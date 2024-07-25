#!/usr/bin/env bash

echo "Uninstalling all CocoaPods versions"
sudo gem uninstall cocoapods --all --executables

COCOAPODS_VER=`sed -n -e 's/^COCOAPODS: \([0-9.]*\)/\1/p' Podfile.lock`

echo "Installing CocoaPods version $COCOAPODS_VER"
sudo gem install cocoapods -v $COCOAPODS_VER

console.log('instalar los siguiente')
sudo arch -x86_64 gem install ffi
arch -x86_64 pod install
sudo -x86_64 pod install