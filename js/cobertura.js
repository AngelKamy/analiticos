import { datos, detalles } from './JSONdatos.js';

document.addEventListener('DOMContentLoaded', function () {
  const anoSelect = document.getElementById('anoSelect');
  const mesSelect = document.getElementById('mesSelect');
  const unidadSelect = document.getElementById('unidadSelect');
  const grupoEdadSelect = document.getElementById('grupoEdadSelect');
  const cardsGrid = document.getElementById('cardsGrid');
  const tarjetaDetalleInfo = document.getElementById('detalleInfo');
  const textoDetalle = document.getElementById('textoDetalle');

  const coloresPorGrupoEdad = {
    'Niño': { backgroundColor: 'rgba(35, 155, 86, 0.2)', borderColor: '#239B56' },
    'Adolescente': { backgroundColor: 'rgba(31, 97, 141, 0.2)', borderColor: '#1F618D' },
    'Mujer': { backgroundColor: 'rgba(192, 57, 43 , 0.2)', borderColor: '#C0392B' },
    'Hombre': { backgroundColor: 'rgba(86, 101, 115, 0.2)', borderColor: '#566573' },
    'Adulto Mayor': { backgroundColor: 'rgba(243, 156, 18 , 0.2)', borderColor: '#F39C12' },
    'Toda la Unidad': { backgroundColor: 'rgba(181,70,252,0.75)', borderColor: '#FF00B4' }
  };

  function inicializarSelect(select, placeholder, opciones) {
    select.innerHTML = '';
    select.add(new Option(placeholder, "", true, true));
    opciones.forEach(opcion => select.add(new Option(opcion, opcion)));
  }

  function initAnoSelect() {
    inicializarSelect(anoSelect, "Seleccione año", Object.keys(datos));
    anoSelect.value = Object.keys(datos)[0]; // Selección por defecto
    actualizarMesSelect();
  }

  function actualizarMesSelect() {
    const anoSeleccionado = anoSelect.value;
    if (anoSeleccionado) {
      const meses = Object.keys(datos[anoSeleccionado]);
      inicializarSelect(mesSelect, "Seleccione mes", meses);
      mesSelect.value = meses[0]; // Selección por defecto
      actualizarUnidadSelect();
    }
  }

  function actualizarUnidadSelect() {
    const anoSeleccionado = anoSelect.value;
    const mesSeleccionado = mesSelect.value;
    if (anoSeleccionado && mesSeleccionado) {
      const unidades = datos[anoSeleccionado][mesSeleccionado].map(unidad => unidad.nombre);
      inicializarSelect(unidadSelect, "Seleccione una unidad", unidades);
      unidadSelect.value = unidades[0]; // Selección por defecto
      actualizarGrupoEdadSelect();
    }
  }

  function actualizarGrupoEdadSelect() {
    const anoSeleccionado = anoSelect.value;
    const mesSeleccionado = mesSelect.value;
    const unidadSeleccionada = unidadSelect.value;
    if (anoSeleccionado && mesSeleccionado && unidadSeleccionada) {
      const unidadDatos = datos[anoSeleccionado][mesSeleccionado].find(u => u.nombre === unidadSeleccionada);
      const gruposEdad = Object.keys(unidadDatos.gruposEdad);
      inicializarSelect(grupoEdadSelect, "Seleccione un grupo de edad", ["todos", ...gruposEdad]);
      grupoEdadSelect.value = 'todos'; // Selección por defecto
      actualizarGraficos();
    }
  }

  function actualizarGraficos() {
    const anoSeleccionado = anoSelect.value;
    const mesSeleccionado = mesSelect.value;
    const unidadSeleccionada = unidadSelect.value;
    const grupoEdadSeleccionado = grupoEdadSelect.value;
    cardsGrid.innerHTML = '';

    if (anoSeleccionado && mesSeleccionado && unidadSeleccionada && grupoEdadSeleccionado) {
      const unidadDatos = datos[anoSeleccionado][mesSeleccionado].find(u => u.nombre === unidadSeleccionada);
      const grupos = grupoEdadSeleccionado === 'todos' ? unidadDatos.gruposEdad : { [grupoEdadSeleccionado]: unidadDatos.gruposEdad[grupoEdadSeleccionado] };
      
      Object.entries(grupos).forEach(([grupo, info]) => {
        crearGrafico(grupo, info, unidadSeleccionada);
      });
    }
  }

  function crearGrafico(grupoEdad, datosGrupoEdad, unidadMedica) {
    const colores = coloresPorGrupoEdad[grupoEdad] || { backgroundColor: 'rgba(0, 0, 0, 0.2)', borderColor: '#000000' };

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardsGrid.appendChild(cardDiv);

    const canvas = document.createElement('canvas');
    cardDiv.appendChild(canvas);

    const labelConUnidad = `${grupoEdad} - ${unidadMedica}`;
    const data = {
      labels: datosGrupoEdad.labels,
      datasets: [{
        label: labelConUnidad,
        data: datosGrupoEdad.valores,
        fill: true,
        backgroundColor: colores.backgroundColor,
        borderColor: colores.borderColor,
        pointBackgroundColor: colores.borderColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colores.borderColor
      }]
    };

    const options = {
      elements: { line: { borderWidth: 3 } },
      scales: {
        r: {
          angleLines: { display: false },
          suggestedMin: 10,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          labels: { font: { family: 'Montserrat', size: 14 } }
        }
      }
    };

    new Chart(canvas.getContext('2d'), { type: 'radar', data: data, options: options });

    cardDiv.addEventListener('mouseenter', () => mostrarDetalles(grupoEdad, datosGrupoEdad, unidadMedica));
    cardDiv.addEventListener('mouseleave', () => (tarjetaDetalleInfo.style.display = 'none'));
  }

  function mostrarDetalles(grupoEdad, datosGrupoEdad, unidadMedica) {
    const detallesGrupo = detalles[grupoEdad] || [];
    const detallesConValores = detallesGrupo.map((detalle, index) => {
      const valor = datosGrupoEdad.valores[index] ? datosGrupoEdad.valores[index].toFixed(1) : 'N/A';
      return `<li>${detalle} = <span class="valor_detalle">${valor}</span></li>`;
    }).join('');
    
    textoDetalle.innerHTML = `${unidadMedica}: <br> ${grupoEdad}<ul>${detallesConValores}</ul>`;
    tarjetaDetalleInfo.style.display = 'block';
  }

  anoSelect.addEventListener('change', () => {
    actualizarMesSelect();
    actualizarGraficos();
  });
  mesSelect.addEventListener('change', () => {
    actualizarUnidadSelect();
    actualizarGraficos();
  });
  unidadSelect.addEventListener('change', () => {
    actualizarGrupoEdadSelect();
    actualizarGraficos();
  });
  grupoEdadSelect.addEventListener('change', actualizarGraficos);

  initAnoSelect();
});
