const fs = require('fs').promises;

async function updateBuildGradle() {
  const gradlePath = './android/build.gradle';
  try {
    let content = await fs.readFile(gradlePath, 'utf8');
    content = content.replace(/com\.android\.tools\.build:gradle:\d+\.\d+\.\d+/g, 'com.android.tools.build:gradle:8.1.4');
    await fs.writeFile(gradlePath, content);
    console.log('build.gradle updated successfully to Gradle version 8.1.4!');
  } catch (error) {
    console.error('Failed to update build.gradle:', error);
  }
}

updateBuildGradle();
