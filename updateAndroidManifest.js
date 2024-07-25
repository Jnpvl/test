const fs = require('fs').promises;
const xml2js = require('xml2js');

async function updateAndroidManifest() {
  const manifestPath = './android/app/src/main/AndroidManifest.xml';
  try {
    const data = await fs.readFile(manifestPath);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    
    // Agregar permisos específicos
    const permissionsToAdd = [
      'android.permission.INTERNET',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION'
    ];

    // Asegurarse de que el elemento 'uses-permission' existe
    if (!result.manifest['uses-permission']) {
      result.manifest['uses-permission'] = [];
    }

    // Añadir permisos si no existen
    permissionsToAdd.forEach(permission => {
      if (!result.manifest['uses-permission'].some(perm => perm.$['android:name'] === permission)) {
        result.manifest['uses-permission'].push({ $: { 'android:name': permission } });
      }
    });

    // Asegurarse de que el elemento 'uses-feature' existe
    if (!result.manifest['uses-feature']) {
      result.manifest['uses-feature'] = [];
    }

    // Añadir features específicos
    const featuresToAdd = ['android.hardware.location.gps'];

    // Añadir features si no existen
    featuresToAdd.forEach(feature => {
      if (!result.manifest['uses-feature'].some(feat => feat.$['android:name'] === feature)) {
        result.manifest['uses-feature'].push({ $: { 'android:name': feature } });
      }
    });

    // Construir el XML modificado y escribirlo de nuevo en el archivo
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(result);
    await fs.writeFile(manifestPath, xml);
    console.log('AndroidManifest.xml updated successfully!');
  } catch (error) {
    console.error('Failed to update AndroidManifest.xml:', error);
  }
}

updateAndroidManifest();
