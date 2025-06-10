// JavaScript simplificado para LapTimer

// Variables globales
let currentUser = null;
let currentCircuitId = null;

// Cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    const page = getPageName();
    initializePage(page);
});

// Saber en qué página estoy
function getPageName() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'login';
}

// Inicializar cada página
function initializePage(page) {
    switch(page) {
        case 'login':
            initLogin();
            break;
        case 'registro':
            initRegister();
            break;
        case 'dashboard':
            initMainMenu();
            break;
        case 'circuit_list':
            initCircuitList();
            break;
        case 'add_circuit':
            initAddCircuit();
            break;
        case 'delete_circuit':
            initDeleteCircuit();
            break;
        case 'tiemposcircuito':
            initCircuitTimes();
            break;
        case 'vertiempos':
            initViewTimes();
            break;
    }
}

// ============ LOGIN ============
function initLogin() {
    const usernameField = document.getElementById('username');
    if (usernameField) usernameField.focus();
}

// ============ REGISTRO ============
function initRegister() {
    const usernameField = document.getElementById('newUsername');
    if (usernameField) usernameField.focus();
}

// ============ MENÚ PRINCIPAL ============
function initMainMenu() {
    loadUserData();
    checkAuthStatus();
}

function loadUserData() {
    const urlParams = new URLSearchParams(window.location.search);
    let username = urlParams.get('user');
    
    if (!username) {
        username = sessionStorage.getItem('username') || 'Usuario';
    }
    
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = username;
    }
    
    if (username !== 'Usuario') {
        sessionStorage.setItem('username', username);
    }
}

function checkAuthStatus() {
    fetch('php/confirmacion.php')
        .then(response => response.json())
        .then(data => {
            if (!data.authenticated) {
                alert('Sesión expirada');
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.log('Error verificando sesión:', error);
        });
}

// ============ LISTA DE CIRCUITOS ============
function initCircuitList() {
    loadCircuits();
}

function loadCircuits() {
    const container = document.getElementById('circuits-container');
    
    if (!container) return;
    
    container.innerHTML = '<p>Cargando circuitos...</p>';
    
    fetch('php/get_circuito.php')
        .then(response => response.json())
        .then(circuits => {
            displayCircuits(circuits);
        })
        .catch(error => {
            console.log('Error:', error);
            container.innerHTML = '<p>Error cargando circuitos</p>';
        });
}

function displayCircuits(circuits) {
    const container = document.getElementById('circuits-container');
    
    if (!circuits || circuits.length === 0) {
        container.innerHTML = '<p>No hay circuitos. <a href="add_circuit.html">Añadir el primero</a></p>';
        return;
    }
    
    let html = '<ul>';
    circuits.forEach(circuit => {
        html += `<li>
            <span>${circuit.nombre}</span>
            <button onclick="goToCircuit(${circuit.id})">Gestionar</button>
        </li>`;
    });
    html += '</ul>';
    
    container.innerHTML = html;
}

function goToCircuit(circuitId) {
    window.location.href = `tiemposcircuito.html?circuit=${circuitId}`;
}

// ============ AÑADIR CIRCUITO ============
function initAddCircuit() {
    const input = document.getElementById('nuevoCircuito');
    if (input) input.focus();
}

// ============ ELIMINAR CIRCUITO ============
function initDeleteCircuit() {
    loadCircuitsForDeletion();
}

function loadCircuitsForDeletion() {
    const select = document.getElementById('circuitoEliminar');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">Cargando...</option>';
    
    fetch('php/get_circuito.php')
        .then(response => response.json())
        .then(circuits => {
            populateCircuitSelect(circuits);
        })
        .catch(error => {
            console.log('Error:', error);
            select.innerHTML = '<option value="">Error cargando</option>';
        });
}

function populateCircuitSelect(circuits) {
    const select = document.getElementById('circuitoEliminar');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecciona un circuito</option>';
    
    if (!circuits || circuits.length === 0) {
        select.innerHTML = '<option value="">No hay circuitos</option>';
        return;
    }
    
    circuits.forEach(circuit => {
        const option = document.createElement('option');
        option.value = circuit.id;
        option.textContent = circuit.nombre;
        select.appendChild(option);
    });
}

// ============ TIEMPOS DE CIRCUITO ============
function initCircuitTimes() {
    loadCircuitData();
    setupTimeInput();
}

function getCircuitId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('circuit');
}

function loadCircuitData() {
    const circuitId = getCircuitId();
    if (!circuitId) {
        alert('Error: No hay circuito');
        window.location.href = 'circuit_list.html';
        return;
    }

    fetch(`php/get_circuito.php?id=${circuitId}`)
        .then(response => response.json())
        .then(circuit => {
            const nameElement = document.getElementById('circuit-name');
            const idElement = document.getElementById('circuit_id');
            
            if (nameElement) nameElement.textContent = circuit.nombre;
            if (idElement) idElement.value = circuitId;
        })
        .catch(error => {
            console.log('Error:', error);
            alert('Error cargando circuito');
            window.location.href = 'circuit_list.html';
        });

    // Poner fecha de hoy
    const fechaElement = document.getElementById('fecha');
    if (fechaElement) {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        fechaElement.value = dateString;
    }
}

function setupTimeInput() {
    const timeInput = document.getElementById('tiempo');
    
    if (!timeInput) return;
    
    // Ayudar a escribir el formato mm:ss:ddd
    timeInput.addEventListener('keyup', function(e) {
        let value = e.target.value.replace(/[^\d:]/g, '');
        
        if (value.length === 2 && !value.includes(':')) {
            value += ':';
        }
        if (value.length === 5 && value.split(':').length === 2) {
            value += ':';
        }
        
        e.target.value = value;
    });
}

function goToViewTimes() {
    const circuitId = getCircuitId();
    if (circuitId) {
        window.location.href = `vertiempos.html?circuit=${circuitId}`;
    }
}

// ============ VER TIEMPOS ============
function initViewTimes() {
    loadTimes();
}

function goBack() {
    if (currentCircuitId) {
        window.location.href = `tiemposcircuito.html?circuit=${currentCircuitId}`;
    } else {
        window.location.href = 'circuit_list.html';
    }
}

function loadTimes(orden = 'mejor') {
    const circuitId = getCircuitId();
    if (!circuitId) {
        alert('Error: No hay circuito');
        window.location.href = 'circuit_list.html';
        return;
    }

    currentCircuitId = circuitId;
    
    const container = document.getElementById('times-container');
    if (container) {
        container.innerHTML = '<p>Cargando tiempos...</p>';
    }

    fetch(`php/get_tiempos.php?circuit=${circuitId}&order=${orden}`)
        .then(response => response.json())
        .then(data => {
            const titleElement = document.getElementById('circuit-title');
            if (titleElement) {
                titleElement.textContent = `Tiempos en ${data.circuit_name}`;
            }
            displayTimes(data.times_by_vehicle);
        })
        .catch(error => {
            console.log('Error:', error);
            if (container) {
                container.innerHTML = '<p>Error cargando tiempos</p>';
            }
        });
}

function displayTimes(timesByVehicle) {
    const container = document.getElementById('times-container');
    
    if (!container) return;
    
    const iconoVehiculo = {
        "Kart alquiler 390cc": "🚗",
        "moto": "🏍️",
        "Kart Rotax": "🏎️"
    };

    let html = '';
    let totalTimes = 0;

    // Contar tiempos totales
    for (const vehiculo in timesByVehicle) {
        if (timesByVehicle[vehiculo] && timesByVehicle[vehiculo].length > 0) {
            totalTimes += timesByVehicle[vehiculo].length;
        }
    }

    if (totalTimes > 0) {
        html += `<div>Total de tiempos: <strong>${totalTimes}</strong></div>`;
    }

    // Mostrar tiempos por vehículo
    for (const vehiculo in timesByVehicle) {
        if (timesByVehicle[vehiculo] && timesByVehicle[vehiculo].length > 0) {
            const icono = iconoVehiculo[vehiculo] || "🚘";
            const cantidadTiempos = timesByVehicle[vehiculo].length;
            
            html += `<div>
                        <h3>${icono} ${vehiculo} (${cantidadTiempos} tiempos)</h3>
                        <ul>`;
            
            timesByVehicle[vehiculo].forEach((tiempo, index) => {
                const position = index + 1;
                
                html += `<li>
                            <span>${position}°</span>
                            <span><strong>${tiempo.username}</strong></span>
                            <span>${tiempo.tiempo_texto}</span>
                            <span>${formatDate(tiempo.fecha)}</span>
                         </li>`;
            });
            
            html += `</ul></div>`;
        }
    }

    if (totalTimes === 0) {
        html = '<div><p>No hay tiempos registrados.</p><p><a href="tiemposcircuito.html?circuit=' + currentCircuitId + '">Registrar el primer tiempo</a></p></div>';
    }

    container.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function sortByBest() {
    loadTimes('mejor');
}

function sortByWorst() {
    loadTimes('peor');
}

function refreshCircuits() {
    loadCircuits();
}