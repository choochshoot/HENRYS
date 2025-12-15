// init-project.js
const fs = require('fs');
const path = require('path');

console.log('🚀 Inicializando proyecto de Henry Sun...\n');

// Crear carpeta data si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 Carpeta data creada');
} else {
    console.log('📁 Carpeta data ya existe');
}

// Verificar carpeta images
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    console.log('❌ Carpeta images no existe. Por favor, crea la carpeta y añade imágenes.');
    process.exit(1);
}

// Listar imágenes
// DESPUÉS (mejorado para claridad):
const imageFiles = fs.readdirSync(imagesDir)
    .filter(file => file.match(/\.(png|jpg|jpeg|gif|webp)$/i))  // ← Agregar webp también
    .sort();

console.log(`📷 Encontradas ${imageFiles.length} imágenes en la carpeta images/:`);
imageFiles.forEach(file => console.log(`   - ${file}`));

// Crear student.json
const student = {
    name: "HENRY SUN",
    avatar: "",
    coins: 200
};

// Buscar una imagen para el avatar (prioridad: henry, avatar, profile, cualquier imagen)
let avatarImage = imageFiles.find(f => f.toLowerCase().includes('henry')) ||
                  imageFiles.find(f => f.toLowerCase().includes('avatar')) ||
                  imageFiles.find(f => f.toLowerCase().includes('profile')) ||
                  imageFiles[0];

if (avatarImage) {
    student.avatar = `images/${avatarImage}`;
    console.log(`\n👤 Avatar seleccionado: ${avatarImage}`);
} else {
    student.avatar = "images/avatar.png";
    console.log('\n⚠️  No se encontró imagen para avatar, usando por defecto');
}

const studentPath = path.join(dataDir, 'student.json');
fs.writeFileSync(studentPath, JSON.stringify(student, null, 2));
console.log('✅ student.json creado');

// Crear achievements.json
const achievements = [];
// Mapeo de nombres de archivo a títulos (si quieres personalizarlo)
const titleMap = {
    'achievement-1': '3D TV MORT ARMADO',
    'achievement-2': 'ASURADOS Y LÍNEAS',
    'achievement-3': 'DIBUJO LIBRE',
    'achievement-4': 'SELLOS',
    'achievement-5': 'SÓLIDOS PLATÓNICOS',
    'achievement-6': 'SPIDER CUBEE',
    'achievement-7': 'TV MORT'
};

// Agregar logros basados en las imágenes que tengan "achievement" en el nombre
const achievementImages = imageFiles.filter(f => f.toLowerCase().includes('achievement'));

if (achievementImages.length === 0) {
    console.log('\n⚠️  No se encontraron imágenes de logros (achievement).');
    console.log('   Se crearán logros de ejemplo.');
    // Crear algunos logros de ejemplo
    for (let i = 1; i <= 3; i++) {
        achievements.push({
            title: `LOGRO DE EJEMPLO ${i}`,
            image: `images/achievement-${i}.png`
        });
    }
} else {
    console.log(`\n🏆 Encontradas ${achievementImages.length} imágenes de logros:`);
    achievementImages.forEach((img, index) => {
        // DESPUÉS:
        const baseName = path.parse(img).name; // Obtiene "achievement-1" de "achievement-1.gif"
        const title = titleMap[baseName] || `LOGRO ${index + 1}`;
        achievements.push({
            title: title,
            image: `images/${img}`
        });
        console.log(`   ${index + 1}. ${title} -> ${img}`);
    });
}

const achievementsPath = path.join(dataDir, 'achievements.json');
fs.writeFileSync(achievementsPath, JSON.stringify(achievements, null, 2));
console.log('✅ achievements.json creado');

// Crear program.json
const program = [
    {
        topic_name: "✏️ TEMA 1 — EXPLORACIÓN CREATIVA Y DIAGNÓSTICO",
        description: "Teoría: Qué es dibujar; cómo se expresa la creatividad. Actividad: Dibuja a tu personaje favorito (Roblox, Banban, TV Mort). Actividad COINS: Presentar su dibujo y contar su historia."
    },
    {
        topic_name: "✏️ TEMA 2 — LÍNEAS VERTICALES Y HORIZONTALES",
        description: "Teoría: Qué son las líneas verticales, qué son las horizontales, para qué sirven en la composición. Actividad: Completar plantilla de líneas con control de pulso. COINS: Completar cada fila sin rendirse."
    },
    {
        topic_name: "✏️ TEMA 3 — LÍNEAS DIAGONALES Y CURVAS",
        description: "Teoría: En qué ayudan las líneas diagonales, qué son las líneas curvas y fluidez. Actividad: Crear un robot o monstruo solo con curvas + diagonales. COINS: Inventar nombre creativo."
    },
    {
        topic_name: "✏️ TEMA 4 — INTRODUCCIÓN AL ASHURADO",
        description: "Teoría: Sombras básicas, trazos suaves, sombreado lineal. Actividad: Sombrar un personaje sencillo estilo Roblox. COINS: Terminar 3 niveles de sombra."
    },
    {
        topic_name: "✏️ TEMA 5 — DISTANCIAS Y PROPORCIONES BÁSICAS",
        description: "Teoría: Qué es proporción, cómo comparar tamaños. Actividad: Crear un personaje pequeño, mediano y grande. COINS: Presentar una comparación graciosa."
    },
    {
        topic_name: "✏️ TEMA 6 — DETALLE Y ENMASCARILLADO",
        description: "Teoría: Qué es el detalle, qué es el enmascarillado (tapar zonas para pintar otras). Actividad: Crear mascarilla para personaje."
    }
];

const programPath = path.join(dataDir, 'program.json');
fs.writeFileSync(programPath, JSON.stringify(program, null, 2));
console.log('✅ program.json creado');

console.log('\n🎉 ¡Inicialización completada!');
console.log('\n📋 Ahora puedes:');
console.log('1. Ejecutar: node henry-updater.js');
console.log('2. Abrir index.html en tu navegador');