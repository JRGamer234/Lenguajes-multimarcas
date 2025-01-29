const pantalla = document.querySelector(".pantalla");
const botones = document.querySelectorAll(".btn");
const historialLista = document.querySelector("#historial-lista");
let operacionActual = "";

function agregarAlHistorial(operacion, resultado) {
    const historialItem = document.createElement("div");
    historialItem.className = "historial-item";
    historialItem.textContent = `${operacion} = ${resultado}`;
    historialLista.insertBefore(historialItem, historialLista.firstChild);
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const botonApretado = boton.textContent;
        
        if(boton.id === "c"){
            pantalla.textContent = "0";
            operacionActual = "";
            return;
        }

        if (boton.id == "borrar"){
            if(pantalla.textContent.length === 1){
                pantalla.textContent = "0";
            }else{
                pantalla.textContent = pantalla.textContent.slice(0, -1);
            }
            operacionActual = pantalla.textContent;
            return;
        }

        if(boton.id === "igual"){
            try {
                const resultado = eval(pantalla.textContent);
                agregarAlHistorial(pantalla.textContent, resultado);
                pantalla.textContent = resultado;
                operacionActual = resultado.toString();
            } catch (error) {
                pantalla.textContent = "Error";
                operacionActual = "";
            }
            return;
        }

        if(pantalla.textContent === "0"){
            pantalla.textContent = botonApretado;
        }else {
            pantalla.textContent += botonApretado;
        }
        operacionActual = pantalla.textContent;
    })
})