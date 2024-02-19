//Funcion que realiza peticion Ajax a / y  muestra los resultados en la vista
function cargarPlazas() {
    $.ajax({
        url: '/',  
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#plazasContainer').html(generarTarjetas(data.slice(0, 10)));
            $('#plazasContainer2').html(generarTarjetas(data.slice(10, 20)));
        },
        error: function(error) {
            console.error('Error al cargar las plazas:', error);
        }
    });
}

//Funcion que genera el HTML de cada tarjeta con sus datos correspondientes
function generarTarjetas(plazas) {
    var html = '';
    plazas.forEach(function(plaza, index) {
        html += `
            <div class="col-2 m-1">
                <div class="card ${plaza.estado === 'L' ? 'bg-success' : 'bg-danger'}">
                    <div class="card-body">
                        <p class="card-text"><strong>Número:</strong> ${plaza.idPlaza}</p>
                        <p class="card-text estado" id="estado${index}"><strong>Estado:</strong> ${plaza.estado}</p>
                    </div>
                </div>
            </div>`;
    });
    return html;
}

function entrada() {
$.ajax({
    url: '/entrada',  
    type: 'POST',
    success: function(response) {
        console.log(response);
    },
    error: function(error) {
        console.error('Error al registrar la entrada del vehículo:', error);
        console.log('Error al registrar la entrada del vehículo');
    }
    });
};

function salida() {
$.ajax({
    url: '/salida',  
    type: 'POST',
    success: function(response) {
        console.log(response);
    },
    error: function(error) {
        console.error('Error al registrar la salida del vehículo:', error);
        console.log('Error al registrar la salida del vehículo');
    }
});
};

function reset() {
$.ajax({
    url: '/reset',  
    type: 'GET',
    success: function(response) {
        console.log(response);
    },
    error: function(error) {
        console.error('Error al registrar la entrada del vehículo:', error);
        console.log('Error al registrar la entrada del vehículo');
    }
    });
};

let popupWindow = null;

function openPopup() {
$.ajax({
url: '/detalleCompra',
type: 'GET',
dataType: 'json',
success: function(data) {
    // Mostrar los datos en el popup
    const popupContent = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Detalle de la Compra</title>
            <!-- Enlaces de Bootstrap -->
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <div class="container">
            <div class="card border-primary mt-3 mb-3">
                <div class="card-header bg-primary text-white">Importe total</div>
                    <div class="card-body">
                    <h5 class="card-title">${data.totalImporte}</h5>
                </div>
            </div>
                    <h5 class="card-title">Detalles de la compra</h5>
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr bg-primary>
                                <th>Importe</th>
                                <th>Fecha de entrada</th>
                                <th>Fecha de salida</th>
                                <th>ID del Coche</th>
                                <th>ID del Plaza</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.detallesCompra.map(detalle => `
                                <tr>
                                    <td>${detalle.importe}</td>
                                    <td>${detalle.fechaInicio}</td>
                                    <td>${detalle.fechaFin}</td>
                                    <td>${detalle.idCoche}</td>
                                    <td>${detalle.idPlaza}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
    `;
    
    // Si el popup está cerrado, establecer popupWindow a null
    if (popupWindow && popupWindow.closed) {
        popupWindow = null;
    }

    // Si el popup está abierto, actualizar su contenido
    if (popupWindow && !popupWindow.closed) {
        popupWindow.document.body.innerHTML = ''; // Limpiar contenido anterior
        popupWindow.document.write(popupContent); // Escribir nuevo contenido
    } else {
        // Si el popup no está abierto o ha sido cerrado, abrir uno nuevo
        const width = 600; // Ancho del pop-up
        const height = 400; // Altura del pop-up
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        const options = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
        popupWindow = window.open('', '_blank', options);
        popupWindow.document.write(popupContent); // Escribir contenido en el nuevo popup
    }
},
error: function(error) {
    console.error('Error al obtener datos adicionales:', error);
}
});
}

cargarPlazas();
setInterval(cargarPlazas, 3000);
setInterval(openPopup, 3000); 

let intervaloEntrada, intervaloSalida;

function iniciarSimulacion() {
intervaloEntrada = setInterval(entrada, Math.floor(Math.random() * (4000- 2000 + 1)) + 2000);
intervaloSalida = setInterval(salida, Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000);
}

function detenerSimulacion() {
clearInterval(intervaloEntrada);
clearInterval(intervaloSalida);
}

function toggleSimulacion() {
    var interruptor = document.getElementById("interruptorDemo");
    if (interruptor.checked) {
        iniciarSimulacion();
    } else {
        detenerSimulacion();
    }
}

document.getElementById("botonReset").addEventListener("click", function() {
    if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
    }
});
