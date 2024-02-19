# Garage App

This is a simple garage management application built using Node.js, Express, and MySQL. The application allows you to simulate the entry and exit of cars in a garage, and it calculates the total cost for each stay.

## Requisites 
To run this application, you need to have the following installed:

- Node.js
- MySQL

## Getting Started 
1. Clone the repository:
    ```bash
    git clone https://github.com/alexonazo/Garage.git
    ```
2. Install the dependencies:
    ```bash
    cd garage-app
    npm install
    ```
3. Create a new MySQL database named `garage` and a user with privileges to access it and import db/garage.sql.
4. Update the `app.js` file with your MySQL credentials.
5. Start the application:
    ```bash
    node app.js
    ```
The application will start on port 3333.

## API Endpoints
- `GET /`: List all available parking spaces.
- `POST /entrada`: Simulate a car entering the garage.
- `POST /salida`: Simulate a car leaving the garage.
- `GET /detalleCompra?compraId=:id`: Get the details of a specific stay, including the total cost and individual cost per hour.
- `GET /reset`: Reset the data in the `compra` and `plaza` tables.

## Testing 
You can test the application using a tool like Postman or curl.

For example, to simulate a car entering the garage, send a POST request to `http://localhost:3333/entrada` with an empty body.

To simulate a car leaving the garage, send a POST request to `http://localhost:3333/salida` with an empty body.

To get the details of a specific stay, send a GET request to `http://localhost:3333/detalleCompra?compraId=:id`, replacing `:id` with the ID of the stay.

## Resetting Data 
To reset the data in the `compra` and `plaza` tables, send a GET request to `http://localhost:3333/reset`.

## Built With 
- Node.js
- Express
- MySQL

## Contributing 
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
