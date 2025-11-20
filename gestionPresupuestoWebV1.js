import {
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos
} from "./gestionPresupuesto.js";

// ---------- CONTENEDORES ----------
const divTotal = document.getElementById("total-gastos");
const divForm = document.getElementById("formulario-gasto");
const divListado = document.getElementById("listado-gastos");

// =====================================================
//  CREAR FORMULARIO DESDE JS
// =====================================================

function crearFormulario() {

    const form = document.createElement("form");

    form.innerHTML = `
        <h2>Añadir gasto</h2>

        <label>Descripción:
            <input type="text" id="desc" required>
        </label><br>

        <label>Valor (€):
            <input type="number" id="valor" required min="0">
        </label><br>

        <label>Fecha:
            <input type="date" id="fecha" required>
        </label><br>

        <label>Etiquetas (separadas por comas):
            <input type="text" id="etiquetas">
        </label><br><br>

        <button type="submit">Añadir gasto</button>
    `;

    // manejar envío
    form.addEventListener("submit", function(e) {
        e.preventDefault();   // evitar recarga

        const desc = document.getElementById("desc").value;
        const valor = document.getElementById("valor").value;
        const fecha = document.getElementById("fecha").value;

        const etiquetasTexto = document.getElementById("etiquetas").value;
        const etiquetas = etiquetasTexto
            ? etiquetasTexto.split(",").map(e => e.trim())
            : [];

        const gasto = new CrearGasto(desc, valor, fecha, ...etiquetas);

        anyadirGasto(gasto);

        pintarListado();
        pintarTotal();

        form.reset();
    });

    divForm.appendChild(form);
}

// =====================================================
//  MOSTRAR TOTAL
// =====================================================

function pintarTotal() {
    const total = calcularTotalGastos();
    divTotal.innerHTML = `<h2>Total de gastos: ${total} €</h2>`;
}

// =====================================================
//  LISTADO DE GASTOS
// =====================================================

function pintarListado() {
    divListado.innerHTML = "<h2>Listado de gastos</h2>";

    const lista = listarGastos();

    if (lista.length === 0) {
        divListado.innerHTML += "<p>No hay gastos.</p>";
        return;
    }

    lista.forEach(gasto => {
        const cont = document.createElement("div");
        cont.style.border = "1px solid black";
        cont.style.margin = "8px";
        cont.style.padding = "6px";

        const fechaObj = new Date(gasto.fecha);
        const fechaStr = fechaObj.toLocaleDateString();

        cont.innerHTML = `
            <p><strong>${gasto.descripcion}</strong></p>
            <p>Valor: ${gasto.valor} €</p>
            <p>Fecha: ${fechaStr}</p>
            <p>Etiquetas: ${gasto.etiquetas.join(", ")}</p>
        `;

        const btn = document.createElement("button");
        btn.textContent = "Borrar";

        // guardar referencia al ID correcto
        btn.addEventListener("click", () => {
            if (confirm("¿Seguro que deseas borrar este gasto?")) {
                borrarGasto(gasto.id);
                pintarListado();
                pintarTotal();
            }
        });

        cont.appendChild(btn);
        divListado.appendChild(cont);
    });
}

// =====================================================
//  PROGRAMA PRINCIPAL (INICIALIZACIÓN)
// =====================================================

// Cargar formulario
crearFormulario();

// Pintar lista y total inicial
pintarListado();
pintarTotal();
