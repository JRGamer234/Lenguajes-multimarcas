function generarListaFija() {
    let num = document.getElementById("numItems").value;
    let container = document.getElementById("inputsContainer");
    container.innerHTML = "";
    
    for (let i = 0; i < num; i++) {
        let row = document.createElement("div");
        row.classList.add("row");
        
        let inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.placeholder = `Ítem ${i + 1}`;
        
        let inputValor = document.createElement("input");
        inputValor.type = "text";
        inputValor.placeholder = `Valor ${i + 1}`;
        
        row.appendChild(inputNombre);
        row.appendChild(inputValor);
        container.appendChild(row);
    }
    document.getElementById("addAllButton").style.display = "inline";
}

function agregarLista() {
    let container = document.getElementById("inputsContainer");
    let lista = document.getElementById("lista");
    let rows = container.getElementsByClassName("row");
    
    for (let row of rows) {
        let inputs = row.getElementsByTagName("input");
        let nombre = inputs[0].value.trim();
        let valor = inputs[1].value.trim();
        if (nombre !== "" && valor !== "") {
            let nuevoElemento = document.createElement("li");
            
            let nombreElemento = document.createElement("strong");
            nombreElemento.textContent = nombre;
            
            let valorElemento = document.createElement("span");
            valorElemento.textContent = ` ${valor}`;
            valorElemento.style.borderBottom = "1px dashed black";
            
            let botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.classList.add("edit-btn");
            botonEditar.onclick = function() {
                let nuevoValor = prompt("Introduce el nuevo valor:", valorElemento.textContent.trim());
                if (nuevoValor !== null) {
                    valorElemento.textContent = ` ${nuevoValor}`;
                }
            };
            
            let botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.classList.add("delete-btn");
            botonEliminar.onclick = function() {
                lista.removeChild(nuevoElemento);
                actualizarColorFondo();
            };
            
            nuevoElemento.appendChild(nombreElemento);
            nuevoElemento.appendChild(document.createTextNode(" "));
            nuevoElemento.appendChild(valorElemento);
            nuevoElemento.appendChild(botonEditar);
            nuevoElemento.appendChild(botonEliminar);
            
            lista.appendChild(nuevoElemento);
        }
    }
    
    container.innerHTML = "";
    document.getElementById("addAllButton").style.display = "none";
    actualizarColorFondo();
}

function actualizarColorFondo() {
    let lista = document.getElementById("lista");
    let cantidad = lista.children.length;
    let colores = ["#ffffff", "#f0f8ff", "#add8e6", "#87ceeb", "#4682b4"];
    let colorIndex = Math.min(cantidad, colores.length - 1);
    document.body.style.backgroundColor = colores[colorIndex];
}