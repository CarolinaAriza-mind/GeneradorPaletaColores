/// ==========================================
// GENERACIÓN DE COLORES ALEATORIOS
// ==========================================

/**
 * Genera un color HEX aleatorio
 * @returns {string} Color en formato HEX (#RRGGBB)
 */
function generateRandomHEX() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Genera un color HSL aleatorio
 * @returns {string} Color en formato HSL
 */
function generateRandomHSL() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 100);
    const l = Math.floor(Math.random() * 100);
    return `hsl(${h}, ${s}%, ${l}%)`;
}

/**
 * Genera una paleta de colores aleatorios
 * @param {number} size - Cantidad de colores (6, 8 o 9)
 * @param {string} format - Formato ('hex' o 'hsl')
 * @returns {Array} Array de objetos {color, code}
 */
function generatePalette(size, format) {
    const palette = [];
    
    for (let i = 0; i < size; i++) {
        let color, code;
        
        if (format === 'hex') {
            color = generateRandomHEX();
            code = color;
        } else if (format === 'hsl') {
            color = generateRandomHSL();
            code = color;
        }
        
        palette.push({ color, code });
    }
    
    return palette;
}

// ==========================================
// RENDER DINÁMICO SEGÚN TAMAÑO SELECCIONADO
// ==========================================

/**
 * Renderiza la paleta en el DOM de forma dinámica
 * @param {Array} palette - Array de colores
 */
function displayPalette(palette) {
    const container = document.getElementById('paletteContainer');
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Ajustar grid según cantidad de colores
    const size = palette.length;
    if (size === 6) {
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else if (size === 8) {
        container.style.gridTemplateColumns = 'repeat(4, 1fr)';
    } else if (size === 9) {
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
    
    // Crear cada tarjeta de color (ARTICLE semántico)
    palette.forEach((item, index) => {
        // ARTICLE para cada color (semántica)
        const colorCard = document.createElement('article');
        colorCard.className = 'color-card';
        colorCard.setAttribute('role', 'button');
        colorCard.setAttribute('tabindex', '0');
        colorCard.setAttribute('aria-label', `Color ${item.code}. Click para copiar`);
        
        // Área de color
        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-display';
        colorDisplay.style.backgroundColor = item.color;
        
        // Información del color
        const colorInfo = document.createElement('div');
        colorInfo.className = 'color-info';
        
        const colorCode = document.createElement('div');
        colorCode.className = 'color-code';
        colorCode.textContent = item.code;
        
        const colorHint = document.createElement('div');
        colorHint.className = 'color-hint';
        colorHint.textContent = 'Click para copiar';
        
        colorInfo.appendChild(colorCode);
        colorInfo.appendChild(colorHint);
        
        colorCard.appendChild(colorDisplay);
        colorCard.appendChild(colorInfo);
        
        // Evento CLICK para copiar
        colorCard.addEventListener('click', () => {
            copyToClipboard(item.code);
        });
        
        // Evento ENTER para accesibilidad (teclado)
        colorCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                copyToClipboard(item.code);
            }
        });
        
        container.appendChild(colorCard);
    });
}

// ==========================================
// MICROFEEDBACK - TOAST NOTIFICATION
// ==========================================

/**
 * Copia texto al portapapeles y muestra feedback
 * @param {string} text - Texto a copiar
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast(`✓ Copiado: ${text}`);
        })
        .catch(err => {
            showToast('✗ Error al copiar');
            console.error('Error al copiar:', err);
        });
}

/**
 * Muestra toast de feedback (microfeedback visible)
 * @param {string} message - Mensaje a mostrar
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    
    // Actualizar mensaje
    toast.textContent = message;
    
    // Mostrar toast
    toast.classList.add('show');
    
    // Ocultar después de 2 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const paletteSizeSelect = document.getElementById('paletteSize');
    const colorFormatSelect = document.getElementById('colorFormat');
    
    // Evento del botón "Generar Paleta" (OBLIGATORIO)
    generateBtn.addEventListener('click', () => {
        const size = parseInt(paletteSizeSelect.value);
        const format = colorFormatSelect.value;
        
        // Generar paleta aleatoria
        const palette = generatePalette(size, format);
        
        // Renderizar dinámicamente
        displayPalette(palette);
        
        // Microfeedback
        showToast('✓ Paleta generada');
    });
    
    // Generar paleta inicial al cargar
    const initialSize = parseInt(paletteSizeSelect.value);
    const initialFormat = colorFormatSelect.value;
    const initialPalette = generatePalette(initialSize, initialFormat);
    displayPalette(initialPalette);
});