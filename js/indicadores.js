import { configuracionIndicadores, datosProductividad, etiquetasIndicadores } from "./JSONprod.js";

document.addEventListener('DOMContentLoaded', function () {
    const anoSelect = document.getElementById('anoSelect');
    const mesSelect = document.getElementById('mesSelect');
    const indicadorSelect = document.getElementById('indicadorSelect');
    const ctx = document.getElementById('productividadChart').getContext('2d');
    let chart;

    // Inicializar selects y gráfico
    inicializarSelects();

    // Event listeners para los selects
    anoSelect.addEventListener('change', () => {
        cargarMeses();
        cargarIndicadores();
        actualizarGrafico();
    });

    mesSelect.addEventListener('change', () => {
        cargarIndicadores();
        actualizarGrafico();
    });

    indicadorSelect.addEventListener('change', actualizarGrafico);

    function inicializarSelects() {
        cargarAnos();
        cargarMeses();
        cargarIndicadores();
        actualizarGrafico(); // Inicializar el gráfico por primera vez
    }

    function cargarAnos() {
        Object.keys(datosProductividad).forEach(ano => {
            let option = new Option(ano, ano);
            anoSelect.add(option);
        });
    }

    function cargarMeses() {
        const meses = datosProductividad[anoSelect.value];
        mesSelect.innerHTML = ''; // Limpiar meses existentes
        Object.keys(meses).forEach(mes => {
            let option = new Option(mes, mes);
            mesSelect.add(option);
        });
    }

    function cargarIndicadores() {
        indicadorSelect.innerHTML = ''; // Limpiar indicadores existentes
        etiquetasIndicadores.forEach((etiqueta, index) => {
            let option = new Option(etiqueta, index); // Usar el índice como valor
            indicadorSelect.add(option);
        });
    }

    function actualizarGrafico() {
        const ano = anoSelect.value;
        const mes = mesSelect.value;
        const indiceIndicadorSeleccionado = parseInt(indicadorSelect.value);
        const datos = datosProductividad[ano][mes];

        if (chart) chart.destroy(); // Destruye el gráfico anterior para una nueva generación

        // Configuración del indicador seleccionado
        const configuracionActual = configuracionIndicadores[ano][mes][indiceIndicadorSeleccionado];

        // Filtrar y mapear datos
        let datosFiltrados = datos.map(item => ({
            unidad: item.unidad,
            valor: item.indicador[indiceIndicadorSeleccionado] || 0
        }));

        // Eliminar elementos con valor 0
        datosFiltrados = datosFiltrados.filter(item => item.valor !== 0);

        // Ordenar los datos de mayor a menor
        datosFiltrados.sort((a, b) => b.valor - a.valor);

        // Aplica los colores de las barras según los umbrales
        const backgroundColors = datosFiltrados.map(item => {
            if (indiceIndicadorSeleccionado === 0) { // Lógica especial para el índice 0
                if (item.valor > configuracionActual.umbralSuperior || item.valor <= 10) {
                    return configuracionActual.backgroundColors[0]; // Desempeño bajo
                } else if (item.valor > 10 && item.valor < configuracionActual.umbralInferior) {
                    return configuracionActual.backgroundColors[2]; // Desempeño medio
                } else {
                    return configuracionActual.backgroundColors[1]; // Desempeño esperado
                }
            } else if (indiceIndicadorSeleccionado === 25) { // Lógica especial para el índice 25
                if (item.valor > configuracionActual.umbralSuperior) {
                    return configuracionActual.backgroundColors[0]; // Desempeño bajo
                } else if (item.valor <= configuracionActual.valorMinimoRojo) {
                    return configuracionActual.backgroundColors[0]; // Rojo para <=10
                } else if (item.valor >= configuracionActual.umbralInferior) {
                    return configuracionActual.backgroundColors[1]; // Desempeño esperado
                } else {
                    return configuracionActual.backgroundColors[2]; // Desempeño medio
                }
            } else {
                // Lógica estándar para otros índices
                if (item.valor > configuracionActual.umbralSuperior) return configuracionActual.backgroundColors[0];
                else if (item.valor >= configuracionActual.umbralInferior) return configuracionActual.backgroundColors[1];
                else return configuracionActual.backgroundColors[2];
            }
        });

        const borderColors = backgroundColors;

        // Crear el gráfico
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datosFiltrados.map(item => item.unidad),
                datasets: [{
                    label: etiquetasIndicadores[indiceIndicadorSeleccionado],
                    data: datosFiltrados.map(item => item.valor),
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 2
                        }
                    },
                    y: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0
                        },
                        barThickness: 20,
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: 'Montserrat'
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            lineXSuperior: {
                                type: 'line',
                                xMin: configuracionActual.umbralSuperior,
                                xMax: configuracionActual.umbralSuperior,
                                borderColor: configuracionActual.colorSuperior,
                                borderWidth: 1.5,
                            },
                            lineXInferior: {
                                type: 'line',
                                xMin: configuracionActual.umbralInferior,
                                xMax: configuracionActual.umbralInferior,
                                borderColor: configuracionActual.colorInferior,
                                borderWidth: 1,
                                borderDash: [5, 5]
                            }
                        }
                    }
                }
            }
        });
    }
});
