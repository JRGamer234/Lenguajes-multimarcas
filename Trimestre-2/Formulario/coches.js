document.addEventListener('DOMContentLoaded', function(event){
    const form = document.getElementsByTagName('form')[0];
    form.onsubmit = envioFormulario;
});

function envioFormulario(event){
    event.preventDefault();
    const elements = event.currentTarget.elements;
    const marca = elements.marca.value;
    const modelo = elements.modelo.value;
    console.log(marca, modelo);
    event.currentTarget.reset();
}