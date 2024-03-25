import { datos } from './datos.js';
import { detalles } from './detalles.js';

console.log(datos); // Ahora puedes usar el objeto JSON como cualquier otro objeto en JS


document.addEventListener('DOMContentLoaded', function () {
  const anoSelect = document.getElementById('anoSelect');
  const mesSelect = document.getElementById('mesSelect');
  const unidadSelect = document.getElementById('unidadSelect');
  const grupoEdadSelect = document.getElementById('grupoEdadSelect');
  const cardsGrid = document.getElementById('cardsGrid');


  

  function initAnoSelect() {
    anoSelect.add(new Option("Seleccione año", "", true, true));
    Object.keys(datos).forEach(ano => {
      anoSelect.add(new Option(ano, ano));
    });
  }

  function obtenerColoresPorGrupoEdad(nombreGrupoEdad) {
    let colores = {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderColor: '#000000',
    };

    switch (nombreGrupoEdad) {
      case 'Niño':
        colores.backgroundColor = 'rgba(35, 155, 86, 0.2)';
        colores.borderColor = '#239B56';
        break;
      case 'Adolescente':
        colores.backgroundColor = 'rgba(31, 97, 141, 0.2)';
        colores.borderColor = '#1F618D';
        break;
      case 'Mujer':
        colores.backgroundColor = 'rgba(192, 57, 43 , 0.2)';
        colores.borderColor = '#C0392B';
        break;
      case 'Hombre':
        colores.backgroundColor = 'rgba(86, 101, 115, 0.2)';
        colores.borderColor = '#566573';
        break;
      case 'Adulto Mayor':
        colores.backgroundColor = 'rgba(243, 156, 18 , 0.2)';
        colores.borderColor = '#F39C12';
        break;
      case 'Toda la Unidad':
        colores.backgroundColor = 'rgba(181,70,252,0.75)';
        colores.borderColor = '#FF00B4';
        break;
    }

    return colores;
  }

  function updateMesSelect() {
    const anoSeleccionado = anoSelect.value;
    mesSelect.innerHTML = '<option value="">Seleccione mes</option>';
    if (anoSeleccionado) {
      Object.keys(datos[anoSeleccionado]).forEach(mes => {
        mesSelect.add(new Option(mes, mes));
      });
    }
  }

  function updateUnidadSelect() {
    const anoSeleccionado = anoSelect.value;
    const mesSeleccionado = mesSelect.value;
    unidadSelect.innerHTML = '<option value="">Seleccione una unidad</option>';
    if (anoSeleccionado && mesSeleccionado) {
      datos[anoSeleccionado][mesSeleccionado].forEach(unidad => {
        unidadSelect.add(new Option(unidad.nombre, unidad.nombre));
      });
    }
  }

  function updateGrupoEdadSelect() {
    const anoSeleccionado = anoSelect.value;
    const mesSeleccionado = mesSelect.value;
    const unidadSeleccionada = unidadSelect.value;
    grupoEdadSelect.innerHTML = '<option value="">Seleccione un grupo de edad</option><option value="todos">Todos los grupos de edad</option>';
    if (anoSeleccionado && mesSeleccionado && unidadSeleccionada) {
      const unidadDatos = datos[anoSeleccionado][mesSeleccionado].find(u => u.nombre === unidadSeleccionada);
      Object.keys(unidadDatos.gruposEdad).forEach(grupo => {
        grupoEdadSelect.add(new Option(grupo, grupo));
      });
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
      if (grupoEdadSeleccionado === 'todos') {
        Object.entries(unidadDatos.gruposEdad).forEach(([grupo, info]) => {
          crearGrafico(grupo, info, unidadSeleccionada);
        });
      } else {
        const info = unidadDatos.gruposEdad[grupoEdadSeleccionado];
        crearGrafico(grupoEdadSeleccionado, info, unidadSeleccionada);
      }
    }
  }

  function crearGrafico(grupoEdad, datosGrupoEdad, unidadMedica) {
    const colores = obtenerColoresPorGrupoEdad(grupoEdad);
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardsGrid.appendChild(cardDiv);

    const canvas = document.createElement('canvas');
    cardDiv.appendChild(canvas);
    const ctx = canvas.getContext('2d');

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
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
          angleLines: {
            display: false
          },
          suggestedMin: 20,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'Montserrat',
              size: 14
            }
          }
        }
      }
    };

    new Chart(ctx, {
      type: 'radar',
      data: data,
      options: options
    });


  }
  anoSelect.addEventListener('change', updateMesSelect);
  mesSelect.addEventListener('change', updateUnidadSelect);
  // Continuación desde la asignación de eventos para los selects de mes y unidad
  unidadSelect.addEventListener('change', updateGrupoEdadSelect);
  grupoEdadSelect.addEventListener('change', actualizarGraficos);

  // Fuera de la función DOMContentLoaded, se asume que ya hay elementos HTML con los ID 'detalleInfo' y 'textoDetalle'
  // que serán utilizados para mostrar los detalles al pasar el mouse sobre una tarjeta

  function actualizarGraficos() {
    const anoSeleccionado = anoSelect.value;
    const mesSeleccionado = mesSelect.value;
    const unidadSeleccionada = unidadSelect.value;
    const grupoEdadSeleccionado = grupoEdadSelect.value;
    cardsGrid.innerHTML = '';

    if (anoSeleccionado && mesSeleccionado && unidadSeleccionada && grupoEdadSeleccionado) {
      const unidadDatos = datos[anoSeleccionado][mesSeleccionado].find(u => u.nombre === unidadSeleccionada);
      if (grupoEdadSeleccionado === 'todos') {
        Object.entries(unidadDatos.gruposEdad).forEach(([grupo, info]) => {
          crearGrafico(grupo, info, unidadSeleccionada);
        });
      } else {
        const info = unidadDatos.gruposEdad[grupoEdadSeleccionado];
        crearGrafico(grupoEdadSeleccionado, info, unidadSeleccionada);
      }
    }
  }

  function crearGrafico(grupoEdad, datosGrupoEdad, unidadMedica) {
    const colores = obtenerColoresPorGrupoEdad(grupoEdad);

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardsGrid.appendChild(cardDiv);

    const canvas = document.createElement('canvas');
    cardDiv.appendChild(canvas);
    const ctx = canvas.getContext('2d');

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
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
          angleLines: {
            display: false
          },
          suggestedMin: 10,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'Montserrat',
              size: 14
            }
          }
        }
      }
    };

    new Chart(ctx, {
      type: 'radar',
      data: data,
      options: options
    });

    // Referencia a los elementos de detalles fuera del evento 'DOMContentLoaded'
    const tarjetaDetalleInfo = document.getElementById('detalleInfo');
    const textoDetalle = document.getElementById('textoDetalle');

    cardDiv.addEventListener('mouseenter', () => {
      const detallesGrupo = detalles[grupoEdad] || [];
      let detallesConValores = "";

      // Iteramos sobre los detalles del grupo de edad
      detallesGrupo.forEach((detalle, index) => {
        const label = detalle;
        // Buscamos el valor correspondiente utilizando el índice
        // Asumimos que el orden de los valores en datosGrupoEdad.valores coincide con el orden de los labels
        let valor = datosGrupoEdad.valores[index];
        // Verificamos si el valor existe y lo redondeamos si es necesario
        valor = valor ? valor.toFixed(1) : 'N/A';
        // Agregamos el detalle y su valor correspondiente a la cadena de detallesConValores
        detallesConValores += `<li>${label} = <span class= "valor_detalle">${valor}</span></li>`;
      });

      // Actualizamos el contenido de textoDetalle con los detalles y sus valores
      textoDetalle.innerHTML = `${unidadMedica}: <br> ${grupoEdad}<ul>${detallesConValores}</ul>`;
      tarjetaDetalleInfo.style.display = 'block';
    });
    cardDiv.addEventListener('mouseleave', () => {
      tarjetaDetalleInfo.style.display = 'none';
    });
  }

  // Llama a las funciones iniciales para configurar los elementos de selección y visualización
  initAnoSelect();
  updateMesSelect();
  updateUnidadSelect();
  updateGrupoEdadSelect();
  actualizarGraficos();

})