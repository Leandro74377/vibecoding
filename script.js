// --- 1. CONFIGURACIÓN INICIAL Y DICCIONARIO ---
const PALABRAS_VALIDAS_5 = ["CODIGO", "JUEGO", "TECLA", "NUBE", "DATOS"];
const PALABRAS_VALIDAS_6 = ["PYTHON", "JAVAS", "WEBCAM", "REACTO", "ANGULA"]; // Ejemplo de palabras de 6 letras

let palabraSecreta = "";
let longitudPalabra = 5;
const MAX_INTENTOS = 6;
let intentoActual = 0;
let palabraActual = "";
let juegoTerminado = false;

// Selecciona una palabra inicial de 5 letras
function elegirPalabraSecreta() {
    palabraSecreta = PALABRAS_VALIDAS_5[Math.floor(Math.random() * PALABRAS_VALIDAS_5.length)];
    longitudPalabra = 5;
}

// LÓGICA DE TIEMPO PARA LA VARIACIÓN (Si se activa en el reto)
function cambiarALongitud6() {
    if (juegoTerminado) return; 

    // Aquí deberías reconfigurar el juego para una nueva palabra de 6
    longitudPalabra = 6;
    palabraSecreta = PALABRAS_VALIDAS_6[Math.floor(Math.random() * PALABRAS_VALIDAS_6.length)];
    intentoActual = 0; 
    palabraActual = "";
    juegoTerminado = false;

    crearTablero(); // Redibuja el tablero con 6 casillas
    mostrarMensaje("¡La palabra secreta es ahora de 6 letras! Nuevo juego iniciado.");
}


// --- 2. GESTIÓN DEL TABLERO Y TECLADO ---

function crearTablero() {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; 
    for (let i = 0; i < MAX_INTENTOS; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < longitudPalabra; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function crearTeclado() {
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
    const currentRow = document.getElementById('game-board').children[intentoActual];
    if (!currentRow) return;

    for (let i = 0; i < longitudPalabra; i++) {
        const tile = currentRow.children[i];
        if (i < palabraActual.length) {
            tile.textContent = palabraActual[i];
            tile.style.borderColor = '#333';
        } else {
            tile.textContent = '';
            tile.style.borderColor = '#ccc';
        }
    }
}

function mostrarMensaje(mensaje) {
    const container = document.getElementById('message-container');
    container.textContent = mensaje;
    setTimeout(() => container.textContent = '', 2500);
}


// --- 3. LÓGICA DE JUEGO (Comprobación y Retroalimentación) ---

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

    // ⭐ CORRECCIÓN: Si la palabra es inválida, no se borra ni se avanza el intento.
    if (!esPalabraValida(palabraActual)) {
        mostrarMensaje("❌ ¡Error! Palabra no válida en el diccionario. Usa DEL para borrar.");
        return; 
    }

    // Si llegamos aquí, la palabra es válida (está en el diccionario)
    const intento = palabraActual;
    const palabra = palabraSecreta;
    const tiles = document.getElementById('game-board').children[intentoActual].children;
    const teclado = document.getElementById('keyboard-container');
    
    const mapaPalabra = {};
    for (const char of palabra) {
        mapaPalabra[char] = (mapaPalabra[char] || 0) + 1;
    }
    
    const resultadoColores = Array(longitudPalabra).fill('');

    // PASO 1: Marcar Verdes (🟢)
    for (let i = 0; i < longitudPalabra; i++) {
        if (intento[i] === palabra[i]) {
            resultadoColores[i] = 'green';
            mapaPalabra[intento[i]]--;
        }
    }

    // PASO 2: Marcar Amarillos (🟡) y Grises (⚫)
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
    
    // Aplicar colores al tablero y teclado
    for (let i = 0; i < longitudPalabra; i++) {
        const color = resultadoColores[i];
        tiles[i].classList.add(color);
        
        // Actualizar teclado (Buscamos la tecla y actualizamos su clase)
        const keyElement = teclado.querySelector(`.key[onclick*="${intento[i]}"]`);
        if (keyElement) {
            // Lógica de prevalencia: Verde > Amarillo > Gris
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
        // ⭐ Si la palabra es válida pero incorrecta, avanzamos y borramos para el siguiente intento.
        intentoActual++;
        palabraActual = "";
        
        if (intentoActual >= MAX_INTENTOS) {
            mostrarMensaje(`😞 Fin del juego. La palabra secreta era: **${palabraSecreta}**.`);
            juegoTerminado = true;
        }
    }
}


// --- 4. INICIO DEL JUEGO ---

function init() {
    elegirPalabraSecreta();
    crearTablero();
    crearTeclado();
    
    // Escucha de teclado físico (Completa y Correcta)
    document.addEventListener('keydown', (e) => {
        if (juegoTerminado) return;
        const key = e.key.toUpperCase();
        
        // Manejo de letras (A-Z, Ñ)
        if (key.match(/^[A-ZÑ]$/) && key.length === 1) {
            manejarTecla(key);
        } 
        // Manejo de ENTER
        else if (key === 'ENTER') {
            manejarTecla('ENTER'); 
        } 
        // Manejo de DELETE/BACKSPACE
        else if (key === 'BACKSPACE') {
            manejarTecla('DEL');
        }
    });
}

init();
