# Ejecutar la Aplicación

Este documento describe los pasos necesarios para correr la aplicación en un emulador y generar un APK sin firmar.

## Correr en Emulador

Estos pasos te permitirán correr la aplicación en un emulador. Ten en cuenta que este método no refleja cambios en tiempo real.

1. Construye el proyecto para generar el directorio `www`:
    ```bash
   ionic build

2. Abre el proyecto en un emulador/android studio
    ```bash
    npx cap open android

## Generar apk sin firmar 

1. ionic build
2. ionic capacitor add android
3. ionic capacitor copy android  
4. cd android 
5. .\gradlew assembleDebug 

 
 ## build automatico (no debe existir carpeta android)
 
 1. npm run build:android

## build automatico (con carpeta android presente,solo subir la version en updatebuildgradle)
 
 1. npm run generate:android

# test
# test
