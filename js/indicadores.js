import { configuracionIndicadores } from "./JSONdatos.js";
import { datosProductividad } from "./JSONdatos.js";
import umbralesIndicadores from ".umbralesIndicadores.json";

document.addEventListener('DOMContentLoaded', function () {
    const anoSelect = document.getElementById('anoSelect');
    const mesSelect = document.getElementById('mesSelect');
    const indicadorSelect = document.getElementById('indicadorSelect');
    const ctx = document.getElementById('productividadChart').getContext('2d');
    let chart;

    // Cargar años y luego meses
    cargarAnos();
    cargarIndicadores(); // Llamamos a cargar indicadores aquí para llenar el select después de cargar años

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

    function cargarAnos() {
        Object.keys(datosProductividad).forEach(ano => {
            let option = new Option(ano, ano);
            anoSelect.add(option);
        });
        cargarMeses(); // Carga inicial de meses
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

        // Cargar umbrales dinámicos
        const umbralSuperior = umbralesIndicadores[ano][mes][indiceIndicadorSeleccionado].umbralSuperior;
        const umbralInferior = umbralesIndicadores[ano][mes][indiceIndicadorSeleccionado].umbralInferior;

        // Busca la configuración del indicador seleccionado
        const configuracionActual = configuracionIndicadores[indiceIndicadorSeleccionado];

        let datosFiltrados = datos.map(item => ({
            unidad: item.unidad,
            valor: item.indicador[indiceIndicadorSeleccionado] || 0
        }));

        // Aquí filtramos para eliminar los elementos con valor 0
        datosFiltrados = datosFiltrados.filter(item => item.valor !== 0);

        datosFiltrados.sort((a, b) => b.valor - a.valor);

        // Aplica los colores de las barras según los umbrales
        const backgroundColors = datosFiltrados.map(item => {
            if (item.valor > umbralSuperior) return configuracionActual.backgroundColors[0];
            else if (item.valor >= umbralInferior) return configuracionActual.backgroundColors[1];
            else return configuracionActual.backgroundColors[2];
        });

        const borderColors = backgroundColors; // Ajusta si necesitas diferentes colores de borde

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
                                xMin: umbralSuperior,
                                xMax: umbralSuperior,
                                borderColor: configuracionActual.colorSuperior,
                                borderWidth: 1.5,
                            },
                            lineXInferior: {
                                type: 'line',
                                xMin: umbralInferior,
                                xMax: umbralInferior,
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

    actualizarGrafico(); // Inicializar el gráfico por primera vez
});
