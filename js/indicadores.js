import { datosProductividad } from "./JSONprod.js";

document.addEventListener('DOMContentLoaded', function () {
    const anoSelect = document.getElementById('anoSelect');
    const mesSelect = document.getElementById('mesSelect');
    const ctx = document.getElementById('productividadChart').getContext('2d');
    let chart;

    // Cargar años
    cargarAnos();

    // Event listeners para los selects
    anoSelect.addEventListener('change', () => {
        cargarMeses();
        actualizarGrafico();
    });

    mesSelect.addEventListener('change', actualizarGrafico);

    // Funciones para cargar los selects y actualizar el gráfico
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

    function actualizarGrafico() {
        const ano = anoSelect.value;
        const mes = mesSelect.value;
        const datos = datosProductividad[ano][mes];
    
        datos.sort((a, b) => b["Productividad chequeo PREVENIMSS"] - a["Productividad chequeo PREVENIMSS"]);
    
        if (chart) {
            chart.destroy(); // Destruye el gráfico anterior para una nueva generación
        }
    
        // Genera un array de colores basado en los criterios específicos
        const backgroundColors = datos.map(item => {
            const valor = item["Productividad chequeo PREVENIMSS"];
            if (valor > 20) return 'rgba(246, 25, 21)'; // Rojo
            else if (valor >= 14) return 'rgba(40, 180, 99)'; // Verde
            else return 'rgba(253, 250, 53)'; // Amarillo
        });
    
        const borderColors = datos.map(item => {
            const valor = item["Productividad chequeo PREVENIMSS"];
            if (valor > 20) return 'rgba(246, 25, 21)'; // Rojo
            else if (valor >= 14) return 'rgba(40, 180, 99)'; // Verde
            else return 'rgba(253, 250, 53)'; // Amarillo
        });
    
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: datos.map(item => item.unidad),
                datasets: [{
                    label: 'Productividad chequeo PREVENIMSS',
                    data: datos.map(item => item["Productividad chequeo PREVENIMSS"]),
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
    

    // Inicialización inicial del gráfico
    actualizarGrafico();
});
