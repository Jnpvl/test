#!/usr/bin/env bash

echo "Uninstalling all CocoaPods versions"
sudo gem uninstall cocoapods --all --executables

COCOAPODS_VER=`sed -n -e 's/^COCOAPODS: \([0-9.]*\)/\1/p' Podfile.lock`

sudo gem install cocoapods
echo "cocoapodsintstalado"
echo cocoapods -v
echo "hasta aca llegamos"