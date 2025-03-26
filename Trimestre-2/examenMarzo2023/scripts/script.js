
// Sets de ruedas. Tipos de neumáticos disponibles. No es necesario persistir esta información.
const sets = [
    {
        id: 1,
        type: 'Blando',
        maxDeg: 50
    },
    {
        id: 2,
        type: 'Medio',
        maxDeg: 100
    },
    {
        id: 3,
        type: 'Duro',
        maxDeg: 150
    }
];

// Lista de las carreras. Es la que hay que utilizar CUANDO NO HAY DATOS PERSISTIDOS.
const racesBase = [
    {
        id: 1,
        name: 'GP Baréin',
        laps: 57,
        deg: 5,
        sets: []
    },
    {
        id: 2,
        name: 'GP Arabia Saudí',
        laps: 50,
        deg: 3,
        sets: []
    },
    {
        id: 3,
        name: 'GP Australia',
        laps: 58,
        deg: 2,
        sets: []
    }
];

// NOTA: El cálculo del número de vueltas que puede hacer un neumáticos se hace:
// Math.floor(set.maxDeg / race.deg);
const carreras = racesBase;

document.addEventListener("DOMContentLoaded",function(event){

    const contenedorRuedas = document.getElementById('contenedorRuedas');

    for(const rueda of sets){
        const divRueda = document.createElement("div");
        contenedorRuedas.appendChild(divRueda);
        divRueda.innerHTML = rueda.type;
        divRueda.dataset.id = rueda.id;
        divRueda.onclick = onClickDivRueda;
    }


    const contenedorCarreras = document.getElementById('contenedorCarreras');

    for (const carrera of carreras) {
        const divCarrera = document.createElement("div");
        carrera.caja = divCarrera;
        divCarrera.dataset.id = carrera.id;
        contenedorCarreras.appendChild(divCarrera);
        divCarrera.innerHTML = `
                <div>${carrera.name}</div>               
                <div class="datos">
                    <div>
                        <div>Vueltas</div>
                        <div>${carrera.laps}</div>
                    </div>
                    <div>
                        <div>Degradacion/Vueltas</div>
                        <div>${carrera.deg}</div>
                    </div>
                </div>

                <div class="contenedorRuedas">
                    
                </div>

                <div class="totalVueltas">
                    <div>Total vueltas posibles</div>
                    <div>5</div>
                </div>

                <div class="btnRuedas">Añadir Ruedas</div>
        `;
        const btnRuedas = divCarrera.getElementsByClassName("btnRuedas")[0];
        btnRuedas.onclick = onClickBtnAddRueda;
    }





});

function onClickBtnAddRueda(event){
    const idCarrera = parseInt(event.currentTarget.parentNode.dataset.id);
    const overlay = document.getElementById("overlay");
    overlay.dataset.idCarrera = idCarrera; 
    overlay.classList.remove('oculto');
}

function onClickDivRueda(event){
    const idRueda = parseInt(event.currentTarget.dataset.id);
    const overlay = document.getElementById("overlay");
    const idCarrera = parseInt(overlay.dataset.idCarrera);
    overlay.classList.add('oculto');
    const rueda = getRuedaById(idRueda);
    const carrera = getCarreraById(idCarrera);
    carrera.sets.push(rueda);
    generarRuedas(carrera);
}

function getRuedaById(idRueda){
    for(const set of sets){
        if (idRueda === set.id)
            return set;
    }
}

function getCarreraById(idCarrera){
    for(const carrera of carreras){
        if (idCarrera === carrera.id)
            return carrera;
    }
}

function generarRuedas(carrera){
    const contenedorRuedas = carrera.caja.getElementsByClassName("contenedorRuedas")[0];
    contenedorRuedas.innerHTML = "";
    let totalVueltas = 0;
    for(const posicion in carrera.sets){
        const rueda = carrera.sets[posicion];
        const vueltas = Math.floor(rueda.maxDeg / carrera.deg);
        const divRueda = document.createElement("div");
        divRueda.dataset.posicion = posicion;
        divRueda.innerHTML = `
        <div>${rueda.type}</div>
        <div>${vueltas}</div>
        `;
        contenedorRuedas.appendChild(divRueda);
        totalVueltas += vueltas;

        divRueda.onclick = onClickQuitarRueda;
    }

    const contenedorVueltas = carrera.caja.getElementsByClassName("totalVueltas")[0];
    contenedorVueltas.getElementsByTagName("div")[1].innerHTML = totalVueltas;
}

function onClickQuitarRueda(event){
    const idCarrera = parseInt(event.currentTarget.parentNode.parentNode.dataset.id);
    const carreraActual = getCarreraById(idCarrera);
    const posicion = parseInt(event.currentTarget.dataset.posicion);
    carreraActual.sets.splice(posicion, 1);
    generarRuedas(carreraActual);
}
