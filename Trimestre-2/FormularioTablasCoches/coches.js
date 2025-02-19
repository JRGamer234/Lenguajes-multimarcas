const coche1 = {
    id: 1,
    marca: 'tesla',
    modelo: 'cybertruck',
    km: 2345,
    revisiones: [2023, 2024],
    propietario: {
        nombre: 'Saul',
        carnet: false
    }
}

const coche2 = {
    id: 2,
    marca: 'honda',
    modelo: 'civic type r',
    km: 45,
    revisiones: [2020, 2024],
    propietario: {
        nombre: 'Saul',
        carnet: false
    }
}

const coches = [coche1, coche2];

document.addEventListener('DOMContentLoaded', function(event){
    const form = document.getElementsByTagName('form')[0];
    form.onsubmit = envioFormulario;
    for(const coche of coches){
        crearFila(coche);
    }
});

function envioFormulario(event){
    event.preventDefault();
    const elements = event.currentTarget.elements;
    const marca = elements.marca.value.toLowerCase();
    const modelo = elements.modelo.value.toLowerCase();
    event.currentTarget.reset();
    // if(getCoche(marca, modelo)) return;
    const nuevoCoche = {
        id: getLastId() + 1,
        marca: marca,
        modelo: modelo
    }
    coches.push(nuevoCoche);
    crearFila(nuevoCoche);
}

function crearFila(coche){
    const tr = document.createElement('tr');
    tr.setAttribute('id-coche', coche.id);
    tr.innerHTML = `
        <td>${coche.marca}</td>
        <td>${coche.modelo}</td>
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
    btnEliminar.onclick = borrarCoche;
}

function borrarCoche(event){
    const fila = event.currentTarget.parentNode.parentNode;
    const id = parseInt(fila.getAttribute('id-coche'));
    const coche = getCocheById(id);
    if(coche){
        const index = coches.indexOf(coche);
        if(index >= 0){
            coches.splice(index, 1);
            fila.remove();
        }
    }
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

function getCoche(marca, modelo){
    for(const coche of coches){
        if(coche.marca === marca && coche.modelo === modelo){
            return coche;
        }
    }
}

function getCocheById(id){
    for(const coche of coches){
        if(coche.id === id){
            return coche;
        }
    }
}

function getLastId(){
    let id = 0;
    for(const coche of coches){
        if(coche.id > id){
            id = coche.id;
        }
    }
    return id;
}