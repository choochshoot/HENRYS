const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🔧 Verificando preloader.png...');

const imagesDir = path.join(__dirname, 'images');
const preloaderPath = path.join(imagesDir, 'preloader.png');

// Verificar si existe la imagen del preloader
if (fs.existsSync(preloaderPath)) {
    console.log('✅ preloader.png existe en la carpeta images/');
    console.log('💡 Si no se ve, verifica la consola del navegador (F12) para errores.');
} else {
    console.log('❌ preloader.png no encontrado en images/');
    console.log('📥 Descargando imagen de ejemplo...');

    // Asegurarse de que la carpeta images existe
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Descargar una imagen de ejemplo para preloader
    const url = 'https://cdn.pixabay.com/photo/2017/01/31/15/33/avatar-2025541_1280.png';
    const file = fs.createWriteStream(preloaderPath);

    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('✅ preloader.png descargado exitosamente.');
                console.log('🔄 Por favor, recarga la página web.');
            });
        } else {
            console.error(`❌ Error al descargar: ${response.statusCode}`);
            console.log('💡 Por favor, coloca una imagen llamada preloader.png en la carpeta images/');
        }
    }).on('error', (err) => {
        console.error('❌ Error de conexión:', err.message);
        console.log('💡 Por favor, coloca una imagen llamada preloader.png en la carpeta images/');
    });
}