class Alumno {
    constructor(nombre, apellidos, edad) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.materias = [];
        this.calificaciones = {};
    }
}

let alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];
let grupos = JSON.parse(localStorage.getItem('grupos')) || {};

function guardarDatos() {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
    localStorage.setItem('grupos', JSON.stringify(grupos));
}

function altaAlumno() {
    let nombre = document.getElementById('nombre').value.trim();
    let apellidos = document.getElementById('apellidos').value.trim();
    let edad = document.getElementById('edad').value.trim();

    if (!nombre || !apellidos || !edad) {
        alert("Completa todos los campos.");
        return;
    }

    alumnos.push(new Alumno(nombre, apellidos, parseInt(edad)));
    guardarDatos();
    alert("Alumno agregado.");
    document.getElementById('nombre').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('edad').value = '';
}

function inscribirClase() {
    let nombre = document.getElementById('nombreInscribir').value.trim();
    let materia = document.getElementById('materiaSelect').value;

    if (!nombre || !materia) {
        alert("Completa los campos.");
        return;
    }

    let alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (alumno) {
        alumno.materias.push(materia);
        guardarDatos();
        alert("Materia inscrita.");
        document.getElementById('nombreInscribir').value = '';
        document.getElementById('materiaSelect').selectedIndex = 0;
    } else {
        alert("Alumno no encontrado.");
    }
}

function cargarMaterias() {
    let nombre = document.getElementById('nombreCalificar').value.trim();
    let materiaSelect = document.getElementById('materiaCalificarSelect');
    materiaSelect.innerHTML = '<option value="">Selecciona una materia</option>';

    if (!nombre) {
        alert("Escribe el nombre del alumno.");
        return;
    }

    let alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());

    if (alumno && alumno.materias.length > 0) {
        alumno.materias.forEach(materia => {
            let option = document.createElement('option');
            option.value = materia;
            option.textContent = materia;
            materiaSelect.appendChild(option);
        });
    } else {
        alert("No tiene materias inscritas.");
    }
}

function asignarCalificacion() {
    let nombre = document.getElementById('nombreCalificar').value.trim();
    let materia = document.getElementById('materiaCalificarSelect').value;
    let calificacion = parseFloat(document.getElementById('calificacion').value);

    if (!nombre || !materia || isNaN(calificacion)) {
        alert("Completa los datos.");
        return;
    }

    let alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());

    if (alumno) {
        alumno.calificaciones[materia] = calificacion;
        guardarDatos();
        alert("Calificación asignada.");
        document.getElementById('nombreCalificar').value = '';
        document.getElementById('materiaCalificarSelect').innerHTML = '<option value="">Selecciona una materia</option>';
        document.getElementById('calificacion').value = '';
    } else {
        alert("Alumno no encontrado.");
    }
}

function crearGrupo() {
    let nombreGrupo = document.getElementById('nombreGrupo').value.trim();
    if (!nombreGrupo) {
        alert("Completa el nombre del grupo.");
        return;
    }
    grupos[nombreGrupo] = [];
    guardarDatos();
    alert("Grupo creado.");
    document.getElementById('nombreGrupo').value = '';
}

function asignarAlumnoAGrupo() {
    let nombreAlumno = document.getElementById('nombreAlumnoGrupo').value.trim();
    let nombreGrupo = document.getElementById('grupoAlumno').value.trim();

    if (!nombreAlumno || !nombreGrupo) {
        alert("Completa los campos.");
        return;
    }

    if (!grupos[nombreGrupo]) {
        alert("Grupo no existe.");
        return;
    }

    let alumno = alumnos.find(a => a.nombre.toLowerCase() === nombreAlumno.toLowerCase());

    if (alumno) {
        grupos[nombreGrupo].push(alumno);
        guardarDatos();
        alert("Alumno asignado.");
        document.getElementById('nombreAlumnoGrupo').value = '';
        document.getElementById('grupoAlumno').value = '';
    } else {
        alert("Alumno no encontrado.");
    }
}

function asignarPrimerAlumnoAGrupo() {
    let nombreGrupo = document.getElementById('grupoAlumno').value.trim();
    if (!nombreGrupo || !grupos[nombreGrupo]) {
        alert("Grupo no válido.");
        return;
    }
    if (alumnos.length > 0) {
        let alumno = alumnos.shift();
        grupos[nombreGrupo].push(alumno);
        guardarDatos();
        alert(`Alumno ${alumno.nombre} asignado.`);
    } else {
        alert("No hay alumnos.");
    }
}

function buscarPorNombre() {
    let nombre = document.getElementById('buscarNombre').value.trim().toLowerCase();
    let resultado = alumnos.filter(a => a.nombre.toLowerCase().includes(nombre));
    mostrarTabla(resultado);
}

function buscarPorApellido() {
    let apellido = document.getElementById('buscarApellido').value.trim().toLowerCase();
    let resultado = alumnos.filter(a => a.apellidos.toLowerCase().includes(apellido));
    mostrarTabla(resultado);
}

function obtenerPromedioAlumno() {
    let nombre = document.getElementById('promedioAlumno').value.trim().toLowerCase();
    let alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre);

    if (alumno) {
        let notas = Object.values(alumno.calificaciones);
        let promedio = notas.reduce((a, b) => a + b, 0) / notas.length;
        mostrarTabla([{ nombre: alumno.nombre, promedio: promedio.toFixed(2) }]);
    } else {
        mostrarTabla([]);
    }
}

function obtenerPromedioGrupo() {
    let nombreGrupo = document.getElementById('promedioGrupo').value.trim();
    let grupo = grupos[nombreGrupo];

    if (grupo && grupo.length > 0) {
        let total = 0;
        let count = 0;
        grupo.forEach(alumno => {
            Object.values(alumno.calificaciones).forEach(c => {
                total += c;
                count++;
            });
        });
        let promedio = total / count;
        mostrarTabla([{ grupo: nombreGrupo, promedio: promedio.toFixed(2) }]);
    } else {
        mostrarTabla([]);
    }
}

function ordenarAlumnosAsc() {
    let ordenado = [...alumnos].sort((a, b) => promedioAlumno(a) - promedioAlumno(b));
    mostrarTabla(ordenado);
}

function ordenarAlumnosDesc() {
    let ordenado = [...alumnos].sort((a, b) => promedioAlumno(b) - promedioAlumno(a));
    mostrarTabla(ordenado);
}

function ordenarPorEdad() {
    let ordenado = [...alumnos].sort((a, b) => a.edad - b.edad);
    mostrarTabla(ordenado);
}

function promedioAlumno(alumno) {
    let notas = Object.values(alumno.calificaciones);
    return notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : 0;
}

function mostrarTabla(lista) {
    let output = document.getElementById('output');
    output.innerHTML = "";

    if (lista.length === 0) {
        output.innerHTML = "<p>No hay resultados.</p>";
        return;
    }

    let table = "<table><tr>";
    Object.keys(lista[0]).forEach(key => {
        table += `<th>${key.toUpperCase()}</th>`;
    });
    table += "</tr>";

    lista.forEach(item => {
        table += "<tr>";
        Object.values(item).forEach(val => {
            table += `<td>${val}</td>`;
        });
        table += "</tr>";
    });

    table += "</table>";
    output.innerHTML = table;
}

function limpiarResultados() {
    document.getElementById('output').innerHTML = "";
}

function siguientePaso(paso) {
    let pasos = document.querySelectorAll('.paso');
    pasos.forEach(p => p.style.display = 'none');
    document.getElementById('paso' + paso).style.display = 'block';
}
