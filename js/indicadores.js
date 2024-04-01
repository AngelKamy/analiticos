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

        chart = new Chart(ctx, {
    type: 'bar', // Se mantiene 'bar' para ambos tipos de gráficos
    data: {
        labels: datos.map(item => item.unidad), // Unidades como labels
        datasets: [{
            label: 'Productividad chequeo PREVENIMSS',
            data: datos.map(item => item["Productividad chequeo PREVENIMSS"]), // Datos de productividad
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
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
            y: { // Ajustes para el eje Y dado que es el índice en barras horizontales
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0
                },
                barThickness: 80, // Aumenta este valor para hacer las barras más gruesas
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    lineX20: {
                        type: 'line',
                        xMin: 20,
                        xMax: 20,
                        borderColor: 'rgb(255, 99, 132)', // Un color visible claro
                        borderWidth: 1.5, // Un grosor claramente visible
                    },
                    lineX14: {
                        type: 'line',
                        xMin: 14,
                        xMax: 14,
                        borderColor: " black",
                        borderWidth: 1,
                        borderDash: [5,2]
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
