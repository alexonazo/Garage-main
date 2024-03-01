const express = require ('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 
//This code sets up the Express application to parse 
//incoming request bodies as URL-encoded data, making it easier to access and manipulate the data in the 
//request body.

const mysql = require('mysql');
const path = require('path');
const { promisify } = require('util');
//Utilizado en funciones que devuelven una promesa

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


//Conf de conexion
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'garage'
    });
    con.connect((err) => {
    if(err){
    console.log('Error al conectar a la BBDD');
    return;
    }
    console.log('Conexión establecida correctamente');
    });

const PORT = '3333';
const queryAsync = promisify(con.query).bind(con);

//Devuelve las plazas
app.get('/', async function(req, res) {
    try {
        const sql = 'SELECT * FROM plaza';
        const results = await queryAsync(sql);

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.json(results);
        } else {
            res.render(__dirname + '/views/listarPlazas.ejs', { plazas: results });
        }
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en la consulta SQL');
    }
});


app.post('/entrada', async function (req, res) {

    //Se busca un registro en compra donde haya coches aparcados y se almacenan los coches y plazas ocupados
    // en dos arrays

    const queryCompra = `SELECT idCoche, idPlaza FROM compra WHERE fechaFin IS NULL`;
    const resultsCompra = await queryAsync(queryCompra);

    const idCochesA = resultsCompra.map(result => result.idCoche);
    const idPlazasA = resultsCompra.map(result => result.idPlaza);
    if (idCochesA.length == 20) {
        return res.status(500).send('Error al realizar la inserción');
    }

    //Genera un numero aleatorio excluyendo los numeros del array, pudiendo definir un intervalo para ese numero
        function generarNumeroAleatorioExcluido(arrays, min, max) {
            let numeroAleatorio;
            let encontrado;
            do {
                numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
                encontrado = false;
                for (let i = 0; i < arrays.length; i++) {
                    if (arrays[i].includes(numeroAleatorio)) {
                        encontrado = true;
                        break;
                    }
                }
            } while (encontrado);
            return numeroAleatorio;
        }

        const idCoche = generarNumeroAleatorioExcluido([idCochesA], 1, 20);
        const idPlaza = generarNumeroAleatorioExcluido([idPlazasA], 1, 20);

        // Se inserta el nuevo registro en compra con las fecha fin a null por defecto

        const queryInsert = `INSERT INTO compra (idCoche, idPlaza) VALUES (${idCoche}, ${idPlaza})`;

        //Luego se ejecuta un trigger en la bbdd para update de plaza estado

        con.query(queryInsert, (errorInsert, resultsInsert) => {
            if (errorInsert) {
                console.error('Error al realizar la inserción:', errorInsert);
                return res.status(500).send('Error al realizar la inserción');
            }
            res.status(200).send('Compra realizada correctamente.');
        });
});

app.post('/salida', async function(req, res) {
   
    try {
        //Se busca en la tabla compra un coche aparcado

        const queryCoche = `SELECT * FROM compra WHERE fechaFin IS NULL`;
        const resultsCompra = await queryAsync(queryCoche);

        if (resultsCompra.length === 0) {
            console.error('No se encontró ninguna compra para el coche.');
            return res.status(404).send('No se encontró ninguna compra para el coche.');
        }
        
        //De los resultados se selecciona un idCoche aleatorio y lo actualiza en la columna fechaFin

        const randomIndex = Math.floor(Math.random() * resultsCompra.length);
        const idCoche = resultsCompra[randomIndex].idCoche;
        
        const queryUpdateCompra = `UPDATE compra SET fechaFin = CURRENT_TIMESTAMP WHERE idCoche = ?`;
        await queryAsync(queryUpdateCompra, [idCoche]);

        //Luego se ejecuta un trigger en la bbdd para update de plaza estado
        
        return res.status(200).send('OK al actualizar el estado de la plaza');
    } catch (error) {
        console.error('Error al marcar la salida del vehículo en la tabla compra:', error);
        res.status(500).send('Error al marcar la salida del vehículo en la tabla compra');
    }
});

app.get('/detalleCompra', function(req, res) {

    //Listar las facturas

    const query = 'SELECT importe, fechaInicio, fechaFin, idCoche, idPlaza FROM compra'; 

    con.query(query, [req.query.compraId], function(error, results, fields) {
        if (error) {
            console.error('Error al realizar la consulta:', error);
            res.status(500).json({ error: 'Error al realizar la consulta' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Compra no encontrada' });
            return;
        }

        const totalImporte = results.reduce((accumulator, currentValue) => accumulator + currentValue.importe, 0);

        res.json({ 
            totalImporte: totalImporte,
            detallesCompra: results.map(result => ({
                importe: result.importe,
                fechaInicio: result.fechaInicio,
                fechaFin: result.fechaFin,
                idCoche: result.idCoche,
                idPlaza: result.idPlaza
            }))
        });
    });
});

app.get('/reset', async function(req, res) {
    
    try {

        //Resetea tabla compra y libera todas las plazas
        
        const resetCompra = "TRUNCATE compra;";
        const resetPlaza = "UPDATE plaza SET estado = 'L';";

        const queryAsync = promisify(con.query).bind(con);

        await queryAsync(resetCompra);
        console.log("Tabla 'compra' reseteada");

        await queryAsync(resetPlaza);
        console.log("Tabla 'plaza' actualizada");

        res.send("Datos reseteados exitosamente");
    } catch (error) {
        console.error("Error al resetear los datos:", error);
        res.status(500).send("Error al resetear los datos");
    }
});

app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});