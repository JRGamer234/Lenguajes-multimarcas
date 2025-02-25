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
        completarObjetoCoche(coche);
        coche.crearFila();
    }
});

function completarObjetoCoche(coche){
    coche.crearFila = function(){
        this.fila = document.createElement('tr');
        this.fila.dataset.id = this.id;
        this.elements = {
            marca: document.createElement('td'),
            modelo: document.createElement('td'),
            botones: document.createElement('td')
        };

        this.elements.marca.innerHTML = this.marca;
        this.elements.modelo.innerHTML = this.modelo;
        this.elements.botones.innerHTML = `
            <button>Seleccionar</button>
            <button>Formatear</button>
            <button>Eliminar</button>
            <button>Editar</button>
        `;

        this.fila.appendChild(this.elements.marca);
        this.fila.appendChild(this.elements.modelo);
        this.fila.appendChild(this.elements.botones);

        const tabla = document.getElementById('tablaCoches');
        tabla.appendChild(this.fila);

        btnSeleccionar = this.fila.getElementsByTagName('button')[0];
        btnSeleccionar.onclick = onClickSeleccionar;

        btnFormatear = this.fila.getElementsByTagName('button')[1];
        btnFormatear.onclick = onClickFormatear;

        btnEliminar = this.fila.getElementsByTagName('button')[2];
        btnEliminar.onclick = borrarCoche;

        btnEditar = this.fila.getElementsByTagName('button')[3];
        btnEditar.onclick = onClickEditar;
    }
    coche.borrar = function(){
        const index = coches.indexOf(this);
        if(index >= 0){
            coches.splice(index, 1);
            this.fila.remove();
        }
    }
    coche.formatear = function(){
        const elementos = ['marca', 'modelo'];
        for(const e of elementos){
            this.elements[e].innerHTML = this.elements[e].innerHTML.toUpperCase();
        }
    }
    coche.seleccionar = function(){
        for(const coche of coches){
            if(coche.fila !== this.fila) coche.fila.classList.remove('seleccionado');
        }
        this.fila.classList.toggle('seleccionado');
    }
    coche.setMarca = function(marca){
        this.marca = marca;
        this.elements.marca.innerHTML = marca;
    }
    coche.setModelo = function(modelo){
        this.modelo = modelo;
        this.elements.modelo.innerHTML = modelo;
    }
    coche.cargarEnFormulario = function(){
        const formulario = document.getElementsByTagName('form')[0];
        formulario.elements.marca.value = this.marca;
        formulario.elements.modelo.value = this.modelo;
        formulario.elements.submit.value = 'Guardar cambios';
        formulario.dataset.id = this.id;
    }
}

function envioFormulario(event){
    event.preventDefault();
    const id = parseInt(event.currentTarget.dataset.id);
    const elements = event.currentTarget.elements;
    const marca = elements.marca.value.toLowerCase();
    const modelo = elements.modelo.value.toLowerCase();
    event.currentTarget.reset();
    if(id === 0){
        // if(getCoche(marca, modelo)) return;
        const nuevoCoche = {
            id: getLastId() + 1,
            marca: marca,
            modelo: modelo
        }
        completarObjetoCoche(nuevoCoche);
        coches.push(nuevoCoche);
        nuevoCoche.crearFila();
        return;
    }
    const coche = getCocheById(id);
    coche.setMarca(marca);
    coche.setModelo(modelo);
    event.currentTarget.dataset.id = 0;
    elements.submit.value = 'Añadir';
}

function onClickEditar(event){
    const fila = event.currentTarget.parentNode.parentNode;
    const id = parseInt(fila.dataset.id);
    const coche = getCocheById(id);
    coche.cargarEnFormulario();
}

function borrarCoche(event){
    const fila = event.currentTarget.parentNode.parentNode;
    const id = parseInt(fila.dataset.id);
    const coche = getCocheById(id);
    coche.borrar();
}

function onClickSeleccionar(event){
    const fila = event.currentTarget.parentNode.parentNode;
    const id = parseInt(fila.dataset.id);
    const coche = getCocheById(id);
    coche.seleccionar();
}

function onClickFormatear(event){
    const fila = event.currentTarget.parentNode.parentNode;
    const id = parseInt(fila.dataset.id);
    const coche = getCocheById(id);
    coche.formatear();
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