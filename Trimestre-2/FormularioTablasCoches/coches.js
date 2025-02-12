const coche1 = {
    marca: 'Tesla',
    modelo: 'Cybertruck',
    km: 2345,
    revisiones: [2023, 2024],
    propietario: {
        nombre: 'Saul',
        carnet: false
    }
}

const coche2 = {
    marca: 'Honda',
    modelo: 'Civic Type R',
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
        crearFila(coche.marca, coche.modelo);
    }
});

function envioFormulario(event){
    event.preventDefault();
    const elements = event.currentTarget.elements;
    const marca = elements.marca.value;
    const modelo = elements.modelo.value;
    event.currentTarget.reset();
    // if(existeCoche(marca, modelo)) return;
    
    // Create new car object and add it to the array
    const nuevoCoche = {
        marca: marca,
        modelo: modelo,
        km: 0,
        revisiones: [],
        propietario: {
            nombre: '',
            carnet: false
        }
    };
    coches.push(nuevoCoche);
    
    crearFila(marca, modelo);
}

function crearFila(marca, modelo){
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
    btnEliminar.onclick = function(e) {
        const fila = e.currentTarget.parentNode.parentNode;
        const marca = fila.getElementsByTagName('td')[0].innerHTML;
        const modelo = fila.getElementsByTagName('td')[1].innerHTML;
        
        // Remove from coches array
        const index = coches.findIndex(coche => 
            coche.marca.toLowerCase() === marca.toLowerCase() && 
            coche.modelo.toLowerCase() === modelo.toLowerCase()
        );
        if (index > -1) {
            coches.splice(index, 1);
        }
        
        // Remove from UI
        fila.remove();
    };
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
    const tabla = document.getElementById('tablaCoches');
    const filas = tabla.getElementsByTagName('tr');
    for(const fila of filas){
        const celdas = fila.getElementsByTagName('td');
        if(celdas.length < 2) continue;
        if(
            celdas[0].innerHTML.toLowerCase() === marca.toLowerCase() 
            && 
            celdas[1].innerHTML.toLowerCase() === modelo.toLowerCase()
        ){
            return true;
        }
    }
    return false;
}