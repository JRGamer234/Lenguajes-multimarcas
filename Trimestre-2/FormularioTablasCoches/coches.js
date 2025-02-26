const coche1 = {
    id: 1,
    marca: 'tesla',
    modelo: 'cybertruck',
    km: 2345,
    combustible: 'eléctrico',
    consumo: 20, // kWh/100km
    litros: 100, // Capacidad batería en kWh
    revisiones: [2023, 2024],
    propietario: {
        nombre: 'Saul',
        carnet: false
    }
};

const coche2 = {
    id: 2,
    marca: 'honda',
    modelo: 'civic type r',
    km: 45,
    combustible: 'gasolina',
    consumo: 8.5, // L/100km
    litros: 50, // Capacidad del tanque
    revisiones: [2020, 2024],
    propietario: {
        nombre: 'Saul',
        carnet: false
    }
};

const coches = JSON.parse(localStorage.getItem('coches')) || [coche1, coche2];

const acciones = {
    seleccionar: { display: 'Seleccionar', fn: 'seleccionar' },
    formatear: { display: 'Formatear', fn: 'formatear' },
    eliminar: { display: 'Eliminar', fn: 'borrar' },
    editar: { display: 'Editar', fn: 'cargarEnFormulario' },
};

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.onsubmit = envioFormulario;
    
    for (const coche of coches) {
        completarObjetoCoche(coche);
        coche.crearFila();
    }
});

function completarObjetoCoche(coche) {
    coche.crearFila = function () {
        this.fila = document.createElement('tr');
        this.fila.dataset.id = this.id;

        this.elements = {
            marca: document.createElement('td'),
            modelo: document.createElement('td'),
            combustible: document.createElement('td'),
            consumo: document.createElement('td'),
            litros: document.createElement('td'),
            botones: document.createElement('td')
        };

        this.elements.marca.innerHTML = this.marca;
        this.elements.modelo.innerHTML = this.modelo;
        this.elements.combustible.innerHTML = this.combustible;
        this.elements.consumo.innerHTML = this.consumo;
        this.elements.litros.innerHTML = this.litros;

        for (const accion in acciones) {
            const btn = document.createElement('button');
            btn.innerHTML = acciones[accion].display;
            btn.dataset.accion = accion;
            btn.onclick = onClickAccion;
            this.elements.botones.appendChild(btn);
        }

        this.fila.appendChild(this.elements.marca);
        this.fila.appendChild(this.elements.modelo);
        this.fila.appendChild(this.elements.combustible);
        this.fila.appendChild(this.elements.consumo);
        this.fila.appendChild(this.elements.litros);
        this.fila.appendChild(this.elements.botones);

        document.getElementById('tablaCoches').appendChild(this.fila);
    };

    coche.borrar = function () {
        const index = coches.indexOf(this);
        if (index >= 0) {
            coches.splice(index, 1);
            this.fila.remove();
        }
        guardar();
    };

    coche.formatear = function () {
        ['marca', 'modelo', 'combustible'].forEach(e => {
            this.elements[e].innerHTML = this.elements[e].innerHTML.toUpperCase();
        });
    };

    coche.seleccionar = function () {
        for (const coche of coches) {
            if (coche.fila !== this.fila) coche.fila.classList.remove('seleccionado');
        }
        this.fila.classList.toggle('seleccionado');
    };

    coche.setMarca = function (marca) {
        this.marca = marca;
        this.elements.marca.innerHTML = marca;
    };

    coche.setModelo = function (modelo) {
        this.modelo = modelo;
        this.elements.modelo.innerHTML = modelo;
    };

    coche.setCombustible = function (combustible) {
        this.combustible = combustible;
        this.elements.combustible.innerHTML = combustible;
    };

    coche.setConsumo = function (consumo) {
        this.consumo = consumo;
        this.elements.consumo.innerHTML = consumo;
    };

    coche.setLitros = function (litros) {
        this.litros = litros;
        this.elements.litros.innerHTML = litros;
    };

    coche.cargarEnFormulario = function () {
        const form = document.querySelector('form');
        form.elements.marca.value = this.marca;
        form.elements.modelo.value = this.modelo;
        form.elements.combustible.value = this.combustible;
        form.elements.consumo.value = this.consumo;
        form.elements.litros.value = this.litros;
        form.elements.submit.value = 'Guardar cambios';
        form.dataset.id = this.id;
    };
}

function envioFormulario(event) {
    event.preventDefault();
    const id = parseInt(event.currentTarget.dataset.id);
    const elements = event.currentTarget.elements;
    const marca = elements.marca.value.toLowerCase();
    const modelo = elements.modelo.value.toLowerCase();
    const combustible = elements.combustible.value.toLowerCase();
    const consumo = parseFloat(elements.consumo.value);
    const litros = parseFloat(elements.litros.value);

    event.currentTarget.reset();

    if (id === 0) {
        const nuevoCoche = {
            id: getLastId() + 1,
            marca,
            modelo,
            combustible,
            consumo,
            litros
        };
        completarObjetoCoche(nuevoCoche);
        coches.push(nuevoCoche);
        nuevoCoche.crearFila();
        guardar();
        return;
    }

    const coche = getCocheById(id);
    coche.setMarca(marca);
    coche.setModelo(modelo);
    coche.setCombustible(combustible);
    coche.setConsumo(consumo);
    coche.setLitros(litros);

    event.currentTarget.dataset.id = 0;
    elements.submit.value = 'Añadir';
    guardar();
}

function onClickAccion(event) {
    const fila = event.currentTarget.parentNode.parentNode;
    const id = parseInt(fila.dataset.id);
    const coche = getCocheById(id);
    const accion = event.currentTarget.dataset.accion;
    coche[acciones[accion].fn]();
}

function getCocheById(id) {
    return coches.find(coche => coche.id === id);
}

function getLastId() {
    return coches.reduce((max, coche) => Math.max(max, coche.id), 0);
}

function guardar() {
    localStorage.setItem('coches', JSON.stringify(coches));
}
