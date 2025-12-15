// fix-image-paths.js (con soporte para GIFs)
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_DIR = __dirname;
const IMAGES_DIR = path.join(BASE_DIR, 'images');
const DATA_DIR = path.join(BASE_DIR, 'data');

// Lista de archivos a actualizar
const FILES_TO_UPDATE = [
    { file: path.join(BASE_DIR, 'index.html'), type: 'html' },
    { file: path.join(DATA_DIR, 'student.json'), type: 'json' },
    { file: path.join(DATA_DIR, 'achievements.json'), type: 'json' },
    { file: path.join(DATA_DIR, 'program.json'), type: 'json' }
];

// Mapeo de URLs antiguas a nuevas (rutas locales)
const URL_MAPPINGS = {
    // Imgur URLs a reemplazar
    'https://i.imgur.com/nN0H4tE.png': 'images/coin.png',
    'https://i.imgur.com/F7zq8pc.png': 'images/henry-avatar.png',
    'https://i.imgur.com/OpeVWp7.png': 'images/preloader.png',
    'https://i.imgur.com/xzj7aNL.png': 'images/achievement-1.png',
    'https://i.imgur.com/Pz9QIfA.png': 'images/achievement-2.png',
    'https://i.imgur.com/PsWsNpP.png': 'images/achievement-3.png',
    'https://i.imgur.com/qIKSdBf.png': 'images/achievement-4.png',
    'https://i.imgur.com/dbsi6cn.png': 'images/achievement-5.png',
    'https://i.imgur.com/U1g0HRq.png': 'images/achievement-6.png',
    'https://i.imgur.com/4LAzeMN.png': 'images/achievement-7.png',
    
    // Otras URLs que puedan aparecer
    'https://cdn-icons-png.flaticon.com/512/3135/3135715.png': 'images/coin.png',
    'https://ui-avatars.com/api/?name=Henry+Sun&background=8a6de9&color=fff&size=100&bold=true&font-size=0.5': 'images/henry-avatar.png',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop&crop=face': 'images/preloader.png',
    
    // 📍 AGREGAR MAPEOS PARA GIFs AQUÍ (si tienes URLs específicas):
    // 'https://i.imgur.com/ejemplo.gif': 'images/ejemplo.gif',
};

// 📍 Función para detectar URLs de imágenes (incluyendo GIFs) en el contenido
function findImageUrls(content) {
    const imageUrlPattern = /(https?:\/\/[^"\s]+\.(?:png|jpg|jpeg|gif|webp))/gi;
    return content.match(imageUrlPattern) || [];
}

// Función para actualizar un archivo
function updateFile(filePath, fileType) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Reemplazar cada URL antigua por la nueva
        for (const [oldUrl, newUrl] of Object.entries(URL_MAPPINGS)) {
            if (content.includes(oldUrl)) {
                const regex = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                content = content.replace(regex, newUrl);
                updated = true;
                console.log(`  ✓ Reemplazado: ${oldUrl} -> ${newUrl}`);
            }
        }
        
        // 📍 Detectar GIFs no mapeados en el contenido
        const foundUrls = findImageUrls(content);
        foundUrls.forEach(url => {
            if (!URL_MAPPINGS[url]) {
                const ext = path.extname(url).toLowerCase();
                if (ext === '.gif') {
                    const filename = path.basename(url);
                    console.log(`  ⚠️  GIF detectado pero no mapeado: ${filename}`);
                    console.log(`     Agrega al URL_MAPPINGS: '${url}': 'images/${filename}'`);
                }
            }
        });
        
        // Si se actualizó, guardar el archivo
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${path.basename(filePath)} actualizado`);
        } else {
            console.log(`ℹ️  ${path.basename(filePath)} no necesitó cambios`);
        }
    } catch (error) {
        console.error(`❌ Error al procesar ${filePath}:`, error.message);
    }
}


// Función principal
function main() {
    console.log('🔧 Actualizando rutas de imágenes...\n');
    
    // Verificar que existan las carpetas
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error('❌ La carpeta "images" no existe');
        process.exit(1);
    }
    
    // Actualizar cada archivo
    FILES_TO_UPDATE.forEach(({ file, type }) => {
        if (fs.existsSync(file)) {
            console.log(`\n📄 Procesando: ${path.basename(file)}`);
            updateFile(file, type);
        } else {
            console.log(`\n⚠️  Archivo no encontrado: ${file}`);
        }
    });
    
    console.log('\n🎉 Proceso completado!');
    console.log('\n📋 Siguientes pasos:');
    console.log('1. Verifica que las imágenes estén en la carpeta "images/"');
    console.log('2. Abre index.html en tu navegador');
    console.log('3. Los errores 403 deberían desaparecer');
}

// Ejecutar
main();