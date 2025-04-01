function generarRecuadro() {
    let num = document.getElementById("numItems").value;
    let container = document.getElementById("recuadrosContainer");
    let recuadro = document.createElement("div");
    recuadro.classList.add("recuadro");

    // Guardamos las filas creadas en un array para luego guardarlas todas a la vez
    let filas = [];

    for (let i = 0; i < num; i++) {
        let row = document.createElement("div");
        row.classList.add("row");

        // Input para el nombre del ítem
        let inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.placeholder = `Introduce nombre del ítem ${i + 1}`;

        // Span para mostrar el valor del ítem
        let inputValor = document.createElement("span");
        inputValor.textContent = `Valor ${i + 1}`;

        // Botón para editar el valor
        let botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar Valor";
        botonEditar.onclick = function() {
            let nuevoValor = prompt("Introduce el nuevo valor: ", inputValor.textContent);
            if (nuevoValor !== null) {
                inputValor.textContent = nuevoValor;
            }
        };

        // Añadir los elementos a la fila
        row.appendChild(inputNombre);
        row.appendChild(inputValor);
        row.appendChild(botonEditar);
        recuadro.appendChild(row);

        // Guardar la fila en el array
        filas.push({ inputNombre, inputValor });
    }

    // Botón para eliminar el recuadro
    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar Recuadro";
    botonEliminar.onclick = function() {
        container.removeChild(recuadro);
    };

    // Añadir el botón de eliminar y agregar el recuadro al contenedor
    recuadro.appendChild(document.createElement("br"));
    recuadro.appendChild(botonEliminar);
    container.appendChild(recuadro);

    // Botón de "Guardar Todo"
    let botonGuardarTodo = document.createElement("button");
    botonGuardarTodo.textContent = "Guardar Todo";
    botonGuardarTodo.onclick = function() {
        // Deshabilitar todos los campos de nombre y valores
        filas.forEach(function(fila) {
            fila.inputNombre.disabled = true; // Deshabilitar el nombre
            fila.inputValor.setAttribute("contenteditable", "false"); // Deshabilitar la edición del valor
        });
        botonGuardarTodo.disabled = true; // Deshabilitar el botón de "Guardar Todo"
    };

    // Añadir el botón de "Guardar Todo" fuera del recuadro
    document.body.appendChild(botonGuardarTodo);
}
