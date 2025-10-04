# vibecoding
# 💻 CiberPalabra Challenge - Wordle con IA

Este proyecto es una implementación web del juego de adivinanza de palabras (tipo Wordle) desarrollado en HTML, CSS y Vanilla JavaScript, siguiendo los requisitos del desafío de Vibe Coding.

## 🚀 Cómo Ejecutar el Juego

El juego está diseñado para ser accesible en cualquier navegador web moderno.

1.  **Clonar el Repositorio:**
    ```bash
    git clone [TU_REPO_URL]
    ```

2.  **Abrir los Archivos:** Asegúrate de que los tres archivos (`index.html`, `style.css`, `script.js`) estén en la misma carpeta.

3.  **Ejecutar:** Simplemente abre el archivo **`index.html`** haciendo doble clic sobre él. Se abrirá automáticamente en tu navegador predeterminado y el juego comenzará.

## 🧠 Evidencia del Uso de IA (Vibe Coding)

El desarrollo se guió por IA (Google Gemini), cumpliendo con el principio de *vibe coding* y la estructura de un copiloto.

| Componente | Generado/Iniciado por IA | Ajustado/Mejorado Manualmente |
| :--- | :--- | :--- |
| **Estructura Base (HTML/CSS/JS)** | **SÍ.** El *prompt* inicial a la IA solicitó la estructura básica del juego Wordle (tablero, teclado, estilos y manejo de entrada). | Ajustes mínimos de diseño (`style.css`) y estructura del HTML. |
| **Lógica de Retroalimentación** | **SÍ.** La IA proveyó la lógica compleja para el manejo de letras duplicadas (el algoritmo que asigna **Verde**, luego **Amarillo**). | Optimización de la función `comprobarIntento` para garantizar que la lógica de prevalencia de colores en el teclado sea correcta. |
| **Requisitos Específicos** | **NO.** | Implementación del **Diccionario predefinido** (`PALABRAS_VALIDAS_5`) y la función **`esPalabraValida`**. Implementación de la función `cambiarALongitud6` para manejar el requisito de la longitud variable. |

## 🌟 Cumplimiento de Criterios (Creatividad y Funcionalidad)

* **Funcionalidad Mínima:** Completa. El juego de 5 letras funciona correctamente, incluyendo la validación del diccionario y la retroalimentación de colores (Verde/Amarillo/Gris).
* **Creatividad / Mejora:** Se implementó el requisito de **Longitud de Palabra Variable**. La lógica en `script.js` está preparada para cambiar de palabras de 5 letras a 6 letras (mediante la función `cambiarALongitud6`), un requisito específico y diferenciador del desafío.
