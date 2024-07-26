#!/usr/bin/env bash

echo "Iniciando el script appcenter-post-clone.sh"
echo "donde estoy"
pwd  # Esto mostrará: /Users/runner/work/1/s/ios/App

echo "aca voy"
cd ../../  # Cambiamos tres niveles hacia arriba
pwd  # Esto mostrará: /Users/runner/work/1/s
ls

# Instala las dependencias de Node
echo "Instalando dependencias de Node..."
npm install  # Este comando se ejecutará en: /Users/runner/work/1/s

# Verifica que las dependencias de Node estén instaladas
pwd  # Este comando mostrará: /Users/runner/work/1/s
echo "Verificando que node_modules contiene @capacitor/ios..."
ls -l ../node_modules/@capacitor/ios/scripts/pods_helpers.rb  # Esto verificará la existencia del archivo en: /Users/runner/work/1/node_modules/@capacitor/ios/scripts/pods_helpers.rb

# Desinstala todas las versiones de CocoaPods
echo "Desinstalando todas las versiones de CocoaPods"
sudo gem uninstall cocoapods --all --executables  # Este comando se ejecuta en: /Users/runner/work/1/s

echo "CocoaPods desinstalado. Continuando con la instalación..."

# Extrae la versión de CocoaPods desde el archivo Podfile.lock
COCOAPODS_VER=$(sed -n -e 's/^COCOAPODS: \([0-9.]*\)/\1/p' Podfile.lock)  # Este comando se ejecuta en: /Users/runner/work/1/s
if [ -z "$COCOAPODS_VER" ]; then
    echo "No se pudo extraer la versión de CocoaPods desde Podfile.lock"
else
    echo "Versión extraída de CocoaPods desde Podfile.lock: $COCOAPODS_VER"
fi

# Instala CocoaPods
echo "Instalando CocoaPods..."
sudo gem install cocoapods  # Este comando se ejecuta en: /Users/runner/work/1/s

# Asegúrate de que el comando `pod` está en el PATH
echo "Verificando instalación de CocoaPods..."
which pod  # Este comando se ejecuta en: /Users/runner/work/1/s
if [ $? -eq 0 ]; then
    echo "CocoaPods instalado correctamente. Versión actual:"
    pod --version
else
    echo "Error: El comando 'pod' no se encuentra en el PATH."
fi

echo "Fin del script appcenter-post-clone.sh"