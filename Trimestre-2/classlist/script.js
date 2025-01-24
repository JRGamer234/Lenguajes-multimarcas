document.addEventListener('DOMContentLoaded', function(){
    const etiquetas = document.getElementsByTagName('h1');
    for(let i=0; i<etiquetas.length; i++){
        etiquetas[i].addEventListener('click', clickFn);
    }
    const btn = document.getElementsByTagName('button')[0];
    btn.onclick = quitarColores;
});

''.replace()

function quitarColores(event){
    const etiquetas = document.getElementsByTagName('h1');
    for(let i=0; i<etiquetas.length; i++){
        etiquetas[i].classList.remove('rojo', 'amarillo');
    }
}

function clickFn(event){
    const etiqueta = event.currentTarget;
    const clase = etiqueta.classList;
    if(!(clase.replace('rojo', 'amarillo')||clase.replace('amarillo', 'rojo'))){
        etiqueta.classList.add('rojo');
    }


    let texto = 'Hola Mundo!';
    if(etiqueta.innerHTML === texto){
        texto = 'Adios Mundo!';
        className = 'amarillo';
    }
    etiqueta.innerHTML = texto;
};