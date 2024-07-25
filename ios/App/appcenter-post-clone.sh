#!/usr/bin/env bash

echo "Iniciando el script appcenter-post-clone.sh"
# Instala las dependencias de Node
echo "Instalando dependencias de Node..."
npm install
# Desinstala todas las versiones de CocoaPods
echo "Desinstalando todas las versiones de CocoaPods"
sudo gem uninstall cocoapods --all --executables

echo "CocoaPods desinstalado. Continuando con la instalación..."

# Extrae la versión de CocoaPods desde el archivo Podfile.lock
COCOAPODS_VER=$(sed -n -e 's/^COCOAPODS: \([0-9.]*\)/\1/p' Podfile.lock)
if [ -z "$COCOAPODS_VER" ]; then
    echo "No se pudo extraer la versión de CocoaPods desde Podfile.lock"
else
    echo "Versión extraída de CocoaPods desde Podfile.lock: $COCOAPODS_VER"
fi

# Instala CocoaPods
echo "Instalando CocoaPods..."
sudo gem install cocoapods

# Asegúrate de que el comando `pod` está en el PATH
echo "Verificando instalación de CocoaPods..."
which pod
if [ $? -eq 0 ]; then
    echo "CocoaPods instalado correctamente. Versión actual:"
    pod --version
else
    echo "Error: El comando 'pod' no se encuentra en el PATH."
fi

echo "Fin del script appcenter-post-clone.sh"