import { datosProductividad } from "./JSONprod.js";

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

    // Nuevo método para cargar indicadores basados en el año y mes seleccionados
    function cargarIndicadores() {
        const ano = anoSelect.value;
        const mes = mesSelect.value;
        const datos = datosProductividad[ano][mes];
        const indicadores = new Set(); // Usamos un Set para evitar indicadores duplicados

        indicadorSelect.innerHTML = ''; // Limpiamos los indicadores existentes antes de cargar los nuevos

        datos.forEach(item => {
            Object.keys(item.indicador).forEach(indicador => {
                indicadores.add(indicador);
            });
        });

        indicadores.forEach(indicador => {
            let option = new Option(indicador, indicador);
            indicadorSelect.add(option);
        });
    }

    function actualizarGrafico() {
        const ano = anoSelect.value;
        const mes = mesSelect.value;
        const indicadorSeleccionado = indicadorSelect.value;
        const datos = datosProductividad[ano][mes];

        // Modificación principal para adaptar a la nueva estructura de datos
        // Actualización de la línea de sort para ser dinámica
        datos.sort((a, b) => b.indicador[indicadorSeleccionado] - a.indicador[indicadorSeleccionado]);


        if (chart) {
            chart.destroy(); // Destruye el gráfico anterior para una nueva generación
        }

        const datosFiltrados = datos.map(item => ({
            unidad: item.unidad,
            valor: item.indicador[indicadorSeleccionado] || 0
        }));

        const backgroundColors = datosFiltrados.map(item => {
            if (item.valor > 20) return 'rgba(246, 25, 21)';
            else if (item.valor >= 14) return 'rgba(40, 180, 99)';
            else return 'rgba(253, 250, 53)';
        });

        const borderColors = backgroundColors;

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datosFiltrados.map(item => item.unidad),
                datasets: [{
                    label: indicadorSeleccionado,
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
                            // Define el intervalo entre las marcas de graduación del eje X
                            stepSize: 2
                        }
                    },
                    y: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0
                        },
                        barThickness: 20, // Ajusta según necesidad
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: 'Montserrat' // Aplica la fuente Montserrat a la leyenda
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            lineX20: {
                                type: 'line',
                                xMin: 20,
                                xMax: 20,
                                borderColor: 'rgb(255, 99, 132)',
                                borderWidth: 1.5,
                            },
                            lineX14: {
                                type: 'line',
                                xMin: 14,
                                xMax: 14,
                                borderColor: "black",
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
