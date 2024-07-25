const fs = require('fs').promises;

async function updateBuildGradle() {
    const gradlePath = './android/app/build.gradle';
    const versionCode = 15;
    const versionName = "3.0.7";

    try {
        let data = await fs.readFile(gradlePath, 'utf8');

        let versionCodeRegex = /versionCode \d+/;
        let versionNameRegex = /versionName "[\d\.]+"/;

        data = data.replace(versionCodeRegex, `versionCode ${versionCode}`);
        data = data.replace(versionNameRegex, `versionName "${versionName}"`);

        await fs.writeFile(gradlePath, data, 'utf8');
        console.log('build.gradle updated successfully with versionCode:', versionCode, 'and versionName:', versionName);
    } catch (error) {
        console.error('Failed to update build.gradle:', error);
    }
}

updateBuildGradle();
