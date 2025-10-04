// --- 1. CONFIGURACIÓN INICIAL Y DICCIONARIO (Ajuste Manual) ---
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

// --- LÓGICA DE TIEMPO PARA LA VARIACIÓN (Requerimiento Creativo) ---
// En una aplicación real, esto se manejaría con un temporizador,
// pero aquí lo definimos como una función que puedes llamar manualmente.
function cambiarALongitud6() {
    // Solo si el juego actual no ha terminado
    if (juegoTerminado) return; 

    longitudPalabra = 6;
    // Debes elegir una nueva palabra de 6 letras y quizás resetear el tablero
    // o simplemente avisar al jugador para el siguiente juego.
    
    // **Importante para el reto:** Si cambias la palabra en medio del juego,
    // el tablero debe reconfigurarse o el jugador debe empezar de nuevo.
    // Lo más simple para el reto: Avisar que a partir de ahora la palabra será de 6 letras.
    mostrarMensaje("¡Alerta! La siguiente palabra será de 6 letras (si fallas este intento).");
}
// Puedes llamar a esta función cuando te queden 20 minutos (40 min desde el inicio).
// Por ejemplo: setTimeout(cambiarALongitud6, 40 * 60 * 1000); // Esto en el código si fuera un cronómetro.


// --- 2. GESTIÓN DEL TABLERO Y TECLADO (Generado por IA y Adaptado) ---

function crearTablero() {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // Limpiar el tablero
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
    // Opcional: limpiar el mensaje después de un tiempo
    setTimeout(() => container.textContent = '', 2000);
}


// --- 3. LÓGICA DE JUEGO (Comprobación y Retroalimentación) ---

function manejarTecla(key) {
    if (juegoTerminado) return;

    if (key === 'ENTER') {
        comprobarIntento();
    } else if (key === 'DEL') {
        palabraActual = palabraActual.slice(0, -1);
    } else if (palabraActual.length < longitudPalabra) {
        palabraActual += key;
    }
    
    actualizarTablero();
}

function esPalabraValida(palabra) {
    // Si la palabra es de 5 letras, comprueba el diccionario de 5
    if (palabra.length === 5) {
        return PALABRAS_VALIDAS_5.includes(palabra);
    } 
    // Si la palabra es de 6 letras, comprueba el diccionario de 6
    else if (palabra.length === 6) {
        return PALABRAS_VALIDAS_6.includes(palabra);
    }
    return false;
}

function comprobarIntento() {
    if (palabraActual.length !== longitudPalabra) {
        mostrarMensaje(`¡Faltan letras! Debe ser de ${longitudPalabra} letras.`);
        return;
    }

    if (!esPalabraValida(palabraActual)) {
        mostrarMensaje("Palabra no válida en el diccionario.");
        return;
    }

    const intento = palabraActual;
    const palabra = palabraSecreta;
    const tiles = document.getElementById('game-board').children[intentoActual].children;
    const teclado = document.getElementById('keyboard-container');
    
    // Usamos un mapa temporal para manejar duplicados (Lógica Wordle)
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
        if (resultadoColores[i] === '') { // Solo si no es verde
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
        
        // Actualizar teclado
        const keyElement = teclado.querySelector(`button.key:text-content("${intento[i]}")`);
        if (keyElement) {
            // Lógica para que el verde/amarillo prevalezca sobre el gris
            if (keyElement.classList.contains('green') && color !== 'green') continue;
            if (keyElement.classList.contains('yellow') && (color === 'gray')) continue;

            keyElement.classList.add(color);
        }
    }
    
    // Lógica de Ganar/Perder
    if (palabraActual === palabraSecreta) {
        mostrarMensaje(`¡Ganaste en ${intentoActual + 1} intentos!`);
        juegoTerminado = true;
    } else {
        intentoActual++;
        palabraActual = "";
        
        if (intentoActual >= MAX_INTENTOS) {
            mostrarMensaje(`Fin del juego. La palabra era: ${palabraSecreta}`);
            juegoTerminado = true;
        }
    }
}


// --- 4. INICIO DEL JUEGO ---

function init() {
    elegirPalabraSecreta();
    crearTablero();
    crearTeclado();
    
    // Escucha de teclado físico para mayor accesibilidad
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

init();

// Si quieres probar el cambio de 5 a 6 letras, llama a esta función:
// **cambiarALongitud6()**

// Si necesitas resetear el juego (ej: al iniciar una nueva ronda de 6 letras):
// **intentoActual = 0; juegoTerminado = false; elegirPalabraSecreta(); crearTablero();**
