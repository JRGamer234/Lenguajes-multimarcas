document.addEventListener("DOMContentLoaded", function () {
    ponerAlum();
    ponertuto();
});

const tutorias = [
    { id: 1, 
     fecha: '2025-04-02T09:33',
     estado: 0, 
     alumno: 1 },
    { id: 2,
        fecha: '2025-04-02T11:11', 
        estado: 0, 
        alumno: 2 }
];

const alumnos = [
    { id: 1, nombre: 'Alice' },
    { id: 2, nombre: 'Bob' },
    { id: 3, nombre: 'Tim Berners-Lee' }
];

function ponerAlum() {
    const select = document.getElementById("alumno");
    alumnos.forEach(alumno => {
        const option = document.createElement("option");
        option.value = alumno.id;
        option.textContent = alumno.nombre;
        select.appendChild(option);
    });
}

function ponertuto() {
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    tutorias.forEach(tutoria => {
        const fila = document.createElement("tr");
        const alumno = alumnos.find(a => a.id === tutoria.alumno)?.nombre || "Desconocido";
        fila.innerHTML = `
            <td>${alumno}</td>
            <td>${tutoria.fecha}</td>
            <td style="color: red;">Pendiente</td>
            <td>
                <button style="background: green; color: white; border-radius: 5px;" onclick="completarTutoria(${tutoria.id})">Completar</button>
                <button style="background: red; color: white; border-radius: 5px;" onclick="eliminarTutoria(${tutoria.id})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function anadirTuto() {
    const alumnoId = parseInt(document.getElementById("alumno").value);
    const fecha = document.getElementById("fecha").value;
    if (!fecha) {
        alert("Seleccione una fecha");
        return;
    }
    tutorias.push({ id: Date.now(), fecha, estado: 0, alumno: alumnoId });
    ponertuto();
}

function completarTuto(id) {
    alert("Tutoría completada");
}
