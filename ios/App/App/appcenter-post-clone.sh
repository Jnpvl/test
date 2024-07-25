#!/usr/bin/env bash

# Imprime un mensaje para indicar el inicio del script
echo "Iniciando el script appcenter-post-clone.sh"

# Desinstala todas las versiones de CocoaPods
echo "Desinstalando todas las versiones de CocoaPods"
sudo gem uninstall cocoapods --all --executables

# Imprime un mensaje después de desinstalar
echo "CocoaPods desinstalado. Continuando con la instalación..."

# Extrae la versión de CocoaPods desde el archivo Podfile.lock
COCOAPODS_VER=`sed -n -e 's/^COCOAPODS: $begin:math:text$[0-9.]*$end:math:text$/\1/p' Podfile.lock`
echo "Versión extraída de CocoaPods desde Podfile.lock: $COCOAPODS_VER"

# Instala CocoaPods
echo "Instalando CocoaPods..."
sudo gem install cocoapods

# Imprime un mensaje después de la instalación
echo "CocoaPods instalado. Versión actual:"
cocoapods -v

# Imprime un mensaje para indicar que el script ha terminado
echo "Fin del script appcenter-post-clone.sh"