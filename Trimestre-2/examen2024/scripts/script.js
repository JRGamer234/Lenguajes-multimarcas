CARGA_MAXIMA = 150000;
PRECIO_POR_KG = 250;

document.addEventListener('DOMContentLoaded', onLoaded);

const carga = [
    {
        id: 1,
        nombre: 'La Copa del Rey del Betis',
        masa: 50,
        precio: 50*PRECIO_POR_KG
    },
    {
        id: 3,
        nombre: 'Una de las 4 ruedas del RedBull',
        masa: 33,
        precio: 33*PRECIO_POR_KG
    },
    {
        id: 3,
        nombre: 'Huesos de los jamones necesarios para aprobar',
        masa: 25000,
        precio: 25000*PRECIO_POR_KG
    },
    {
        id: 4,
        nombre: 'Todas las excusas de Xavi',
        masa: 75000,
        precio: 75000*PRECIO_POR_KG
    },
    {
        id: 4,
        nombre: 'Los alumnos que suspendieron por no gastarse el dinero en jamones',
        masa: 15000,
        precio: 15000*PRECIO_POR_KG
    }
]

function onLoaded(e){
    for(const item of carga){
        crearItem(item);
    }
    actualizarTotales();

    const btnAdd = document.getElementById('btn-add');
    btnAdd.onclick = onClickBtnAdd;

    const form = document.getElementsByTagName('form')[0];
    form.onsubmit = onSubmitAddItem;
}

function crearItem(item){
    const container = document.getElementById('container-items');
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = `
    <div class="nombre">
        <div class="eliminar">Eliminar</div>
        ${item.nombre}
    </div>
    <div class="datos">
        <div class="masa">
            <div>Masa</div>
            <div>${item.masa}Kg</div>
        </div>
        <div class="precio">
            <div>Precio</div>
            <div>${item.precio}$</div>
        </div>
    </div>
    `;
    const btnEliminar = itemDiv.getElementsByClassName('eliminar')[0];
    btnEliminar.onclick = onClickEliminarItem;
    itemDiv.dataset.id = item.id;
    itemDiv.classList.add('item');
    container.appendChild(itemDiv);
    item.div = itemDiv;
}

function onClickEliminarItem(e){
    const div = e.target.parentNode.parentNode;
    const item = getItemById(parseInt(div.dataset.id));
    const index = carga.indexOf(item);
    if(index >= 0){
        div.remove();
        carga.splice(index, 1);
        actualizarTotales();
    }
}

function onClickBtnAdd(e){
    const form = document.getElementsByTagName('form')[0];
    form.classList.remove('oculto');
}

function onSubmitAddItem(e){
    e.preventDefault();
    const newItem = {
        id: getLastId() + 1,
        nombre: e.target.elements.nombre.value,
        masa: parseInt(e.target.elements.masa.value),
        precio: parseInt(e.target.elements.masa.value) * PRECIO_POR_KG
    };
    carga.push(newItem);
    crearItem(newItem);
    actualizarTotales();
    e.target.classList.add('oculto');
    e.target.reset();
}

function actualizarTotales(){
    let masa = 0;
    let precio = 0;
    for(const item of carga){
        masa += item.masa;
        precio += item.precio;
    }
    const divMasa = document.getElementById('totalMasa');
    divMasa.innerHTML = masa + 'Kg';
    const divPrecio = document.getElementById('totalPrecio');
    divPrecio.innerHTML = precio + '$';
    const divCarga = document.getElementById('totalCarga');
    divCarga.innerHTML = parseInt(masa*100/CARGA_MAXIMA) + '%';
    const bgImage = document.getElementsByClassName('image-sh')[0];
    bgImage.classList.remove('verde');
    bgImage.classList.remove('amarillo');
    bgImage.classList.remove('rojo');
    if(masa < CARGA_MAXIMA * 0.8){
        bgImage.classList.add('verde');
    }
    else if(masa <= CARGA_MAXIMA){
        bgImage.classList.add('amarillo');
    }
    else{
        bgImage.classList.add('rojo');
    }
    
}

function getLastId(){
    let id = 0;
    for(let item of carga){
        if(item.id > id){
            id = item.id;
        }
    }
    return id;
}

function getItemById(id){
    for(let item of carga){
        if(item.id === id){
            return item;
        }
    }
}