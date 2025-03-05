const coche1 = {
    id: 1,
    marca: 'tesla',
    modelo: 'cybertruck',
    revisiones: [2023, 2024],
    propietario: {
        nombre: 'Saul',
        carnet: false
    },
    km: 2345,
    consumo: 5,
    combustibleActual: 40,
    combustibleMax: 50
}

const coche2 = {
    id: 2,
    marca: 'honda',
    modelo: 'civic type r',
    revisiones: [2020, 2024],
    propietario: {
        nombre: 'Saul',
        carnet: false
    },
    km: 1234,
    consumo: 8.5,
    combustibleActual: 10,
    combustibleMax: 60
}

const coches = JSON.parse(localStorage.getItem('coches')) || [coche1, coche2];
const acciones = {
    seleccionar: {
        'display': 'Seleccionar',
        'fn': 'seleccionar'
    },
    formatear: {
        'display': 'Formatear',
        'fn': 'formatear'
    },
    eliminar: {
        'display': 'Eliminar',
        'fn': 'borrar'
    },
    editar: {
        'display': 'Editar',
        'fn': 'cargarEnFormulario'
    },
    mover: {
        'display': 'Mover',
        'fn': 'mostrarFormMover'
    }
}

document.addEventListener('DOMContentLoaded', function(event){
    const forms = document.getElementsByTagName('form');
    forms[0].onsubmit = envioFormulario;
    for(const coche of coches){
        completarObjetoCoche(coche);
        coche.crearFila();
    }
    forms[1].onsubmit = onSubmitFormMover;
});

function onSubmitFormMover(event){
    event.preventDefault();
    const form = event.currentTarget;
    const id = parseInt(form.dataset.id);
    const coche = getCocheById(id);
    const km = parseInt(form.elements.km.value);
    coche.mover(km);
    form.parentNode.classList.add('oculto');
}

function completarObjetoCoche(coche){
    coche.crearFila = function(){
        this.fila = document.createElement('tr');
        this.fila.dataset.id = this.id;
        this.elements = {
            marca: document.createElement('td'),
            modelo: document.createElement('td'),
            km: document.createElement('td'),
            consumo: document.createElement('td'),
            combustibleActual: document.createElement('td'),
            botones: document.createElement('td')
        };

        this.elements.marca.innerHTML = this.marca;
        this.elements.modelo.innerHTML = this.modelo;
        this.elements.km.innerHTML = this.km;
        this.elements.combustibleActual.innerHTML = this.combustibleActual;
        this.elements.consumo.innerHTML = this.consumo;
        for(const accion in acciones){
            const btn = document.createElement('button');
            btn.innerHTML = acciones[accion].display;
            btn.dataset.accion = accion;
            btn.onclick = onClickAccion;
            this.elements.botones.appendChild(btn);
        }
        
        this.fila.appendChild(this.elements.marca);
        this.fila.appendChild(this.elements.modelo);
        this.fila.appendChild(this.elements.km);
        this.fila.appendChild(this.elements.consumo);
        this.fila.appendChild(this.elements.combustibleActual);
        this.fila.appendChild(this.elements.botones);

        const tabla = document.getElementById('tablaCoches');
        tabla.appendChild(this.fila);
    }
    coche.borrar = function(){
        const index = coches.indexOf(this);
        if(index >= 0){
            coches.splice(index, 1);
            this.fila.remove();
        }
        guardar();
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
    coche.setKm = function(km){
        this.km = km;
        this.elements.km.innerHTML = km;
    }
    coche.cargarEnFormulario = function(){
        const formulario = document.getElementsByTagName('form')[0];
        formulario.elements.marca.value = this.marca;
        formulario.elements.modelo.value = this.modelo;
        formulario.elements.submit.value = 'Guardar cambios';
        formulario.dataset.id = this.id;
    }
    coche.mostrarFormMover = function(){
        const container = document.getElementById('containerFormMover');
        const formulario = container.getElementsByTagName('form')[0];
        formulario.dataset.id = coche.id;
        const titulo = formulario.getElementsByTagName('h2')[0];
        titulo.innerHTML = `Mover ${coche.marca} ${coche.modelo}`.toUpperCase();
        container.classList.remove('oculto');
    }
    coche.mover = function(km){
        this.setKm(this.km + km);
    }
}

function envioFormulario(event){
    event.preventDefault();
    const id = parseInt(event.currentTarget.dataset.id);
    const elements = event.currentTarget.elements;
    const marca = elements.marca.value.toLowerCase();
    const modelo = elements.modelo.value.toLowerCase();
    const km = parseInt(elements.km.value);
    const consumo = parseFloat(elements.consumo.value);
    const combustibleActual = parseFloat(elements.combustibleActual.value);
    const combustibleMax = parseFloat(elements.combustibleMax.value);
    event.currentTarget.reset();
    if(id === 0){
        // if(getCoche(marca, modelo)) return;
        const nuevoCoche = {
            id: getLastId() + 1,
            marca: marca,
            modelo: modelo,
            km: km,
            consumo: consumo,
            combustibleActual: combustibleActual,
            combustibleMax: combustibleMax
        }
        completarObjetoCoche(nuevoCoche);
        coches.push(nuevoCoche);
        nuevoCoche.crearFila();
        guardar();
        return;
    }
    const coche = getCocheById(id);
    coche.setMarca(marca);
    coche.setModelo(modelo);
    event.currentTarget.dataset.id = 0;
    elements.submit.value = 'Añadir';
    guardar();
}

function onClickAccion(event){
    const fila = event.currentTarget.parentNode.parentNode;
    const id = parseInt(fila.dataset.id);
    const coche = getCocheById(id);
    const accion = event.currentTarget.dataset.accion;
    coche[acciones[accion].fn]();
}

function getCoche(marca, modelo){
    for(const coche of coches){
        if(coche.marca === marca && coche.modelo === modelo){
            return coche;
        }
    }
}

function getCocheById(id){
    return coches.find(coche => coche.id === id);
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

function guardar(){
    localStorage.setItem('coches', JSON.stringify(coches));
}