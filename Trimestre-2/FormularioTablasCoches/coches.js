document.addEventListener('DOMContentLoaded', function(event){
    const form = document.getElementsByTagName('form')[0];
    form.onsubmit = envioFormulario;
});

function envioFormulario(event){
    event.preventDefault();
    const elements = event.currentTarget.elements;
    const marca = elements.marca.value;
    const modelo = elements.modelo.value;
    event.currentTarget.reset();
    if(existeCoche(marca, modelo)) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${marca}</td>
        <td>${modelo}</td>
        <td>
            <button>Seleccionar</button>
            <button>Formatear</button>
            <button>Eliminar</button>
        </td>
    `;

    const tabla = document.getElementById('tablaCoches');
    tabla.appendChild(tr);

    btnSeleccionar = tr.getElementsByTagName('button')[0];
    btnSeleccionar.onclick = onClickSeleccionar;

    btnFormatear = tr.getElementsByTagName('button')[1];
    btnFormatear.onclick = onClickFormatear;

    btnEliminar = tr.getElementsByTagName('button')[2];
    btnEliminar.onclick = e => e.currentTarget.parentNode.parentNode.remove();
}

function onClickSeleccionar(event){
    const fila = event.currentTarget.parentNode.parentNode;
    const tabla = fila.parentNode;
    const filas = tabla.getElementsByTagName('tr');
    for(const f of filas){
        if(f !== fila) f.classList.remove('seleccionado');
    }
    fila.classList.toggle('seleccionado');
}

function onClickFormatear(event){
    const fila = event.currentTarget.parentNode.parentNode;
    const celdas = fila.getElementsByTagName('td');
    for(let i=0; i<2; i++){
        celdas[i].innerHTML = celdas[i].innerHTML.toUpperCase();
    }
}

function existeCoche(marca, modelo){
    // TODO
    return false;
}