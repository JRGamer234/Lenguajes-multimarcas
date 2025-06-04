// JavaScript unificado para toda la aplicación LapTimer

// Variables globales
let currentUser = null;
let currentCircuitId = null;

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    const page = getPageName();
    initializePage(page);
});

// Función para obtener el nombre de la página actual
function getPageName() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'login';
}

// Inicializar según la página
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

// ========================= LOGIN =========================
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const usernameField = document.getElementById('username');
    
    if (usernameField) usernameField.focus();
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                e.preventDefault();
                alert('Por favor, completa todos los campos.');
                return false;
            }
            
            if (username.length < 3) {
                e.preventDefault();
                alert('El usuario debe tener al menos 3 caracteres.');
                return false;
            }
            
            if (password.length < 4) {
                e.preventDefault();
                alert('La contraseña debe tener al menos 4 caracteres.');
                return false;
            }
        });
    }
}

// ========================= REGISTRO =========================
function initRegister() {
    const registerForm = document.getElementById('registerForm');
    const usernameField = document.getElementById('newUsername');
    
    if (usernameField) usernameField.focus();
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            const username = document.getElementById('newUsername').value.trim();
            const password = document.getElementById('newPassword').value.trim();
            
            if (!username || !password) {
                e.preventDefault();
                alert('Por favor, completa todos los campos.');
                return false;
            }
            
            if (username.length < 3) {
                e.preventDefault();
                alert('El usuario debe tener al menos 3 caracteres.');
                return false;
            }
            
            if (password.length < 4) {
                e.preventDefault();
                alert('La contraseña debe tener al menos 4 caracteres.');
                return false;
            }
            
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(username)) {
                e.preventDefault();
                alert('El usuario solo puede contener letras, números y guiones bajos.');
                return false;
            }
        });
    }
}

// ========================= MENÚ PRINCIPAL =========================
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
                alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.warn('No se pudo verificar el estado de autenticación:', error);
        });
}

// ========================= LISTA DE CIRCUITOS =========================
function initCircuitList() {
    loadCircuits();
}

function loadCircuits() {
    const container = document.getElementById('circuits-container');
    
    if (!container) return;
    
    container.innerHTML = '<p class="cargando">Cargando circuitos...</p>';
    
    fetch('php/get_circuito.php')
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Primero como texto para ver qué devuelve
        })
        .then(text => {
            console.log('Response text:', text);
            try {
                const circuits = JSON.parse(text);
                displayCircuits(circuits);
            } catch (e) {
                console.error('JSON parse error:', e);
                container.innerHTML = `<p class="error">Error procesando respuesta del servidor. Respuesta: ${text}</p>`;
            }
        });
}

function displayCircuits(circuits) {
    const container = document.getElementById('circuits-container');
    
    if (!circuits || circuits.length === 0) {
        container.innerHTML = '<p class="sin-tiempos">No hay circuitos disponibles. <a href="add_circuit.html">Añadir el primero</a></p>';
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

// ========================= AÑADIR CIRCUITO =========================
function initAddCircuit() {
    const form = document.getElementById('addCircuitForm');
    const input = document.getElementById('nuevoCircuito');
    
    if (input) input.focus();
    
    if (form) {
        form.addEventListener('submit', function(e) {
            const circuitName = input.value.trim();
            
            if (!circuitName) {
                e.preventDefault();
                alert('Por favor, ingresa un nombre para el circuito.');
                input.focus();
                return false;
            }
            
            if (circuitName.length < 2) {
                e.preventDefault();
                alert('El nombre del circuito debe tener al menos 2 caracteres.');
                input.focus();
                return false;
            }
            
            if (circuitName.length > 50) {
                e.preventDefault();
                alert('El nombre del circuito no puede exceder los 50 caracteres.');
                input.focus();
                return false;
            }
            
            const nameRegex = /^[a-zA-Z0-9\s\-_áéíóúñÁÉÍÓÚÑ]+$/;
            if (!nameRegex.test(circuitName)) {
                e.preventDefault();
                alert('El nombre del circuito contiene caracteres no permitidos.');
                input.focus();
                return false;
            }
            
            if (!confirm(`¿Confirmas que quieres añadir el circuito "${circuitName}"?`)) {
                e.preventDefault();
                return false;
            }
        });
        
        if (input) {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/\s+/g, ' ');
            });
        }
    }
}

// ========================= ELIMINAR CIRCUITO =========================
function initDeleteCircuit() {
    loadCircuitsForDeletion();
    
    const form = document.getElementById('deleteCircuitForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            const select = document.getElementById('circuitoEliminar');
            const selectedValue = select.value;
            const selectedText = select.options[select.selectedIndex].text;
            
            if (!selectedValue) {
                e.preventDefault();
                alert('Por favor, selecciona un circuito para eliminar.');
                return false;
            }
            
            if (!confirm(`¿Estás seguro de que quieres eliminar el circuito "${selectedText}"?`)) {
                e.preventDefault();
                return false;
            }
            
            if (!confirm('Esta acción no se puede deshacer. ¿Continuar?')) {
                e.preventDefault();
                return false;
            }
        });
    }
}

function loadCircuitsForDeletion() {
    const select = document.getElementById('circuitoEliminar');
    
    if (!select) return;
    
    select.innerHTML = '<option value="">Cargando circuitos...</option>';
    
    fetch('php/get_circuito.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(circuits => {
            populateCircuitSelect(circuits);
        })
        .catch(error => {
            console.error('Error cargando circuitos:', error);
            select.innerHTML = '<option value="">Error cargando circuitos</option>';
        });
}

function populateCircuitSelect(circuits) {
    const select = document.getElementById('circuitoEliminar');
    
    select.innerHTML = '<option value="">Selecciona un circuito</option>';
    
    if (!circuits || circuits.length === 0) {
        select.innerHTML = '<option value="">No hay circuitos disponibles</option>';
        return;
    }
    
    circuits.forEach(circuit => {
        const option = document.createElement('option');
        option.value = circuit.id;
        option.textContent = circuit.nombre;
        select.appendChild(option);
    });
}

// ========================= TIEMPOS DE CIRCUITO =========================
function initCircuitTimes() {
    loadCircuitData();
    setupTimeValidation();
    setupTimesForm();
}

function getCircuitId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('circuit');
}

function loadCircuitData() {
    const circuitId = getCircuitId();
    if (!circuitId) {
        alert('Error: No se especificó el circuito');
        window.location.href = 'circuit_list.html';
        return;
    }

    fetch(`php/get_circuito.php?id=${circuitId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(circuit => {
            const nameElement = document.getElementById('circuit-name');
            const idElement = document.getElementById('circuit_id');
            
            if (nameElement) nameElement.textContent = circuit.nombre;
            if (idElement) idElement.value = circuitId;
        })
        .catch(error => {
            console.error('Error cargando datos del circuito:', error);
            alert('Error cargando datos del circuito');
            window.location.href = 'circuit_list.html';
        });

    const fechaElement = document.getElementById('fecha');
    if (fechaElement) {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        fechaElement.value = dateString;
    }
}

function setupTimeValidation() {
    const timeInput = document.getElementById('tiempo');
    
    if (!timeInput) return;
    
    timeInput.addEventListener('input', function(e) {
        const value = e.target.value;
        
        if (value === '') {
            e.target.setCustomValidity('');
            return;
        }
        
        const regex = /^\d{1,2}:[0-5]?\d:\d{1,3}$/;
        if (!regex.test(value)) {
            e.target.setCustomValidity('Formato debe ser mm:ss:ddd (ej: 1:23:456)');
        } else {
            const parts = value.split(':');
            const seconds = parseInt(parts[1]);
            if (seconds > 59) {
                e.target.setCustomValidity('Los segundos no pueden ser mayores a 59');
            } else {
                e.target.setCustomValidity('');
            }
        }
    });
    
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

function setupTimesForm() {
    const form = document.getElementById('addTimeForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        const tiempo = document.getElementById('tiempo').value;
        const vehiculo = document.getElementById('vehiculo').value;
        const fecha = document.getElementById('fecha').value;
        
        if (!tiempo || !vehiculo || !fecha) {
            e.preventDefault();
            alert('Por favor, completa todos los campos.');
            return false;
        }
        
        if (!validateTimeFormat(tiempo)) {
            e.preventDefault();
            alert('Formato de tiempo inválido. Usa mm:ss:ddd (ej: 1:23:456)');
            return false;
        }
        
        const selectedDate = new Date(fecha);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (selectedDate > today) {
            e.preventDefault();
            alert('La fecha no puede ser futura.');
            return false;
        }
    });
}

function validateTimeFormat(timeStr) {
    const regex = /^(\d{1,2}):([0-5]?\d):(\d{1,3})$/;
    const match = timeStr.match(regex);
    
    if (!match) return false;
    
    const minutes = parseInt(match[1]);
    const seconds = parseInt(match[2]);
    const milliseconds = parseInt(match[3]);
    
    if (minutes > 99) return false;
    if (seconds > 59) return false;
    if (milliseconds > 999) return false;
    
    return true;
}

function goToViewTimes() {
    const circuitId = getCircuitId();
    if (circuitId) {
        window.location.href = `vertiempos.html?circuit=${circuitId}`;
    }
}

// ========================= VER TIEMPOS =========================
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
        alert('Error: No se especificó el circuito');
        window.location.href = 'circuit_list.html';
        return;
    }

    currentCircuitId = circuitId;
    
    const container = document.getElementById('times-container');
    if (container) {
        container.innerHTML = '<p class="cargando">Cargando tiempos...</p>';
    }

    fetch(`php/get_tiempos.php?circuit=${circuitId}&order=${orden}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const titleElement = document.getElementById('circuit-title');
            if (titleElement) {
                titleElement.textContent = `Tiempos en ${data.circuit_name}`;
            }
            displayTimes(data.times_by_vehicle);
        })
        .catch(error => {
            console.error('Error cargando tiempos:', error);
            if (container) {
                container.innerHTML = '<p class="error">Error cargando tiempos. Por favor, inténtalo de nuevo.</p>';
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

    for (const vehiculo in timesByVehicle) {
        if (timesByVehicle[vehiculo] && timesByVehicle[vehiculo].length > 0) {
            totalTimes += timesByVehicle[vehiculo].length;
            const icono = iconoVehiculo[vehiculo] || "🚘";
            html += `<div class="seccion-vehiculo">
                        <h3>${icono} ${vehiculo}</h3>
                        <ul class="lista-tiempos">`;
            
            timesByVehicle[vehiculo].forEach((tiempo, index) => {
                const position = index + 1;
                const positionClass = getPositionClass(position);
                
                html += `<li class="entrada-tiempo ${positionClass}">
                            <span class="posicion">${position}°</span>
                            <span class="conductor"><strong>${tiempo.username}</strong></span>
                            <span class="tiempo">${tiempo.tiempo_texto}</span>
                            <span class="fecha">${formatDate(tiempo.fecha)}</span>
                         </li>`;
            });
            
            html += `</ul></div>`;
        }
    }

    if (totalTimes === 0) {
        html = '<div class="sin-tiempos"><p>No hay tiempos registrados para este circuito.</p><p><a href="tiemposcircuito.html?circuit=' + currentCircuitId + '">Registrar el primer tiempo</a></p></div>';
    }

    container.innerHTML = html;
}

function getPositionClass(position) {
    switch(position) {
        case 1: return 'primer-lugar';
        case 2: return 'segundo-lugar';
        case 3: return 'tercer-lugar';
        default: return '';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function sortByBest() {
    loadTimes('mejor');
}

function sortByWorst() {
    loadTimes('peor');
}

// ========================= FUNCIONES AUXILIARES =========================
function refreshCircuits() {
    loadCircuits();
}

circuitos