// --- 1. CONFIGURACIÓN INICIAL Y DICCIONARIO ---
const PALABRAS_VALIDAS_5 = ["CODIGO", "JUEGO", "TECLA", "NUBE", "DATOS"];
const PALABRAS_VALIDAS_6 = ["PYTHON", "JAVAS", "WEBCAM", "REACTO", "ANGULA"]; 

let palabraSecreta = "";
let longitudPalabra = 5;
const MAX_INTENTOS = 6;
let intentoActual = 0;
let palabraActual = "";
let juegoTerminado = false;

function elegirPalabraSecreta() {
    palabraSecreta = PALABRAS_VALIDAS_5[Math.floor(Math.random() * PALABRAS_VALIDAS_5.length)];
    longitudPalabra = 5;
}

function cambiarALongitud6() {
    if (juegoTerminado) return; 

    longitudPalabra = 6;
    palabraSecreta = PALABRAS_VALIDAS_6[Math.floor(Math.random() * PALABRAS_VALIDAS_6.length)];
    intentoActual = 0; 
    palabraActual = "";
    juegoTerminado = false;

    // Reinicia la interfaz con 6 letras
    document.getElementById('history-container').innerHTML = '';
    crearTablero(); 
    crearTeclado();
    mostrarMensaje("¡La palabra secreta es ahora de 6 letras! Nuevo juego iniciado.");
}


// --- 2. GESTIÓN DEL TABLERO Y TECLADO (CORREGIDO) ---

function crearTablero() {
    // ⭐ CORREGIDO: Dibuja SOLO la fila ACTIVA
    const currentRowContainer = document.getElementById('current-row');
    currentRowContainer.innerHTML = ''; 
    
    for (let j = 0; j < longitudPalabra; j++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        currentRowContainer.appendChild(tile);
    }
    
    // Actualizar el contador de intentos
    document.getElementById('intentos-restantes').textContent = MAX_INTENTOS - intentoActual;
}

function crearTeclado() {
    // ⭐ CORREGIDO: Se asegura de que el teclado se dibuje
    const keys = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
    ];
    const keyboardContainer = document.getElementById('keyboard-container');
    keyboardContainer.innerHTML = '';

    keys.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'key-row';
        row.forEach(keyText => {
            const key = document.createElement('button');
            key.className = 'key';
            key.textContent = keyText;
            key.onclick = () => manejarTecla(keyText); 
            rowDiv.appendChild(key);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

function actualizarTablero() {
    const currentRow = document.getElementById('current-row');
    if (!currentRow) return;

    for (let i = 0; i < longitudPalabra; i++) {
        const tile = currentRow.children[i];
        if (i < palabraActual.length) {
            tile.textContent = palabraActual[i];
            tile.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; 
        } else {
            tile.textContent = '';
            tile.style.backgroundColor = 'transparent';
        }
    }
}

function mostrarMensaje(mensaje) {
    const container = document.getElementById('message-container');
    container.textContent = mensaje;
    setTimeout(() => container.textContent = '', 2500);
}

function mostrarIntentoAnterior(intento, colores) {
    const historyContainer = document.getElementById('history-container');
    const pastRow = document.createElement('div');
    pastRow.className = 'row';

    for (let i = 0; i < longitudPalabra; i++) {
        const tile = document.createElement('div');
        tile.className = `tile ${colores[i]}`;
        tile.textContent = intento[i];
        pastRow.appendChild(tile);
    }
    
    // Añadir el intento al inicio del historial (el más reciente arriba)
    historyContainer.prepend(pastRow);
}


// --- 3. LÓGICA DE JUEGO ---

function manejarTecla(key) {
    if (juegoTerminado) return;

    if (key === 'ENTER') {
        comprobarIntento();
    } else if (key === 'DEL' || key === 'BACKSPACE') {
        palabraActual = palabraActual.slice(0, -1);
    } else if (key.length === 1 && palabraActual.length < longitudPalabra) {
        palabraActual += key;
    }
    
    actualizarTablero();
}

function esPalabraValida(palabra) {
    const diccionario = (longitudPalabra === 5) ? PALABRAS_VALIDAS_5 : PALABRAS_VALIDAS_6;
    return diccionario.includes(palabra);
}

function comprobarIntento() {
    if (palabraActual.length !== longitudPalabra) {
        mostrarMensaje(`¡Faltan letras! Debe ser de ${longitudPalabra} letras.`);
        return;
    }

    if (!esPalabraValida(palabraActual)) {
        mostrarMensaje("❌ ¡Error! Palabra no válida en el diccionario. Usa DEL para borrar.");
        return; 
    }

    // Si la palabra es válida, continúa con la lógica de retroalimentación
    const intento = palabraActual;
    const palabra = palabraSecreta;
    const teclado = document.getElementById('keyboard-container');
    
    const mapaPalabra = {};
    for (const char of palabra) {
        mapaPalabra[char] = (mapaPalabra[char] || 0) + 1;
    }
    const resultadoColores = Array(longitudPalabra).fill('');

    // PASO 1 y 2: Lógica de colores (Green, Yellow, Gray)
    for (let i = 0; i < longitudPalabra; i++) {
        if (intento[i] === palabra[i]) {
            resultadoColores[i] = 'green';
            mapaPalabra[intento[i]]--;
        }
    }
    for (let i = 0; i < longitudPalabra; i++) {
        if (resultadoColores[i] === '') { 
            if (mapaPalabra[intento[i]] > 0) {
                resultadoColores[i] = 'yellow';
                mapaPalabra[intento[i]]--;
            } else {
                resultadoColores[i] = 'gray';
            }
        }
    }
    
    // Mover el intento a la zona de historial
    mostrarIntentoAnterior(intento, resultadoColores);
    
    // Aplicar colores al teclado
    for (let i = 0; i < longitudPalabra; i++) {
        const color = resultadoColores[i];
        // Buscamos la tecla usando su texto (letra)
        const keyElement = teclado.querySelector(`.key[onclick*="${intento[i]}"]`); 
        if (keyElement) {
            if (keyElement.classList.contains('green') && color !== 'green') continue;
            if (keyElement.classList.contains('yellow') && color === 'gray') continue;
            keyElement.classList.add(color);
        }
    }
    
    // Lógica de Ganar/Perder
    if (palabraActual === palabraSecreta) {
        mostrarMensaje(`🎉 ¡Ganaste en ${intentoActual + 1} intentos! La palabra es ${palabraSecreta}.`);
        juegoTerminado = true;
    } else {
        intentoActual++;
        palabraActual = "";
        
        if (intentoActual >= MAX_INTENTOS) {
            mostrarMensaje(`😞 Fin del juego. La palabra secreta era: **${palabraSecreta}**.`);
            juegoTerminado = true;
        }
    }
    
    // Redibuja la línea de entrada para el nuevo intento y actualiza contador.
    crearTablero(); 
}


// --- 4. INICIO DEL JUEGO ---

function init() {
    elegirPalabraSecreta();
    // ⭐ Llamadas que restauran la interfaz (CORREGIDO)
    crearTablero(); 
    crearTeclado();
    
    // Escucha de teclado físico
    document.addEventListener('keydown', (e) => {
        if (juegoTerminado) return;
        const key = e.key.toUpperCase();
        
        if (key.match(/^[A-ZÑ]$/) && key.length === 1) {
            manejarTecla(key);
        } else if (key === 'ENTER') {
            manejarTecla('ENTER'); 
        } else if (key === 'BACKSPACE') {
            manejarTecla('DEL');
        }
    });
}

// ⭐ Ejecución al cargar el script
init();

