# Flight Reservation System (Node.js)

This is a Node.js implementation of the Flight Reservation System. It allows users to search for flights, complete reservations, and check-in for flights.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [Docker](https://www.docker.com/) (for database setup)
- [OpenSSL](https://www.openssl.org/) (for generating SSL/TLS certificates)

---

## Setup

1. **Clone the Repository**:

   ```sh
   git clone https://github.com/kujinlee/flightreservation-node-es6.git
   cd flightreservation-node-es6
   ```

2. **Install Dependencies**:

   ```sh
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and configure the following variables:

   ```plaintext
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=<your-password>
   DB_NAME=reservation
   PORT=8080
   EXPOSED_PORT=8082
   DOCKER_ENV=true
   NODE_ENV=development
   HOST_URL=localhost
   USE_HTTPS=true
   BASE_URL=/flightreservation-node-es6
   DEBUG=sequelize:*
   ```

   Replace `<your-password>` with your actual MySQL root password.

   - **DB_HOST**: The hostname of your database (e.g., `localhost` or `db` if using Docker Compose).
   - **DB_USER**: The username for your database (e.g., `root`).
   - **DB_PASSWORD**: The password for your database user.
   - **DB_NAME**: The name of the database to use (e.g., `reservation`).
   - **PORT**: The internal port the application will run on (default: `8080`).
   - **EXPOSED_PORT**: The port exposed to the host machine (default: `8082`).
   - **DOCKER_ENV**: Set to `true` if running in a Docker environment.
   - **NODE_ENV**: The environment mode (e.g., `development`, `production`).
   - **HOST_URL**: The hostname or IP address of the application (default: `localhost`).
   - **USE_HTTPS**: Set to `true` to enable HTTPS, `false` for HTTP.
   - **BASE_URL**: The base URL path for the application (e.g., `/flightreservation-node-es6`).
   - **DEBUG**: Debugging options for Sequelize (e.g., `sequelize:*` for all Sequelize logs).

4. **Generate SSL/TLS Certificates for Development**:
   If `USE_HTTPS=true` is set in the `.env` file, you need to generate self-signed SSL/TLS certificates for development:

   ```sh
   mkdir certs
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
       -keyout certs/key.pem \
       -out certs/cert.pem \
       -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"
   ```

   - This will create two files in the `certs/` directory:
     - `key.pem`: The private key.
     - `cert.pem`: The self-signed certificate.
   - Ensure the `certs/` directory is excluded from the repository (already handled in `.gitignore`).

5. **Start the Application and Database**:
   Use Docker Compose to start both the application and the MySQL database:

   ```sh
   docker-compose up -d
   ```

   - This command will:
     - Start the **MySQL database** on port `3306`.
     - Start the **Node.js application** on port `8082` (mapped to the app's internal port `8080`).

6. **Initialize the Database**:
   Once the MySQL database is running, execute the SQL scripts to set up the schema and seed data:

   ```sh
   docker exec -i <mysql-container-name> mysql -u root -p<your-password> reservation < sql-scripts/1-schema.sql
   docker exec -i <mysql-container-name> mysql -u root -p<your-password> reservation < sql-scripts/2-seed.sql
   ```

   - Replace `<mysql-container-name>` with the name of your MySQL container (e.g., `flightreservation-node-es6_db_1`).
   - The `mysql-data/` directory will be automatically created to persist the database data.

7. **Access the Application**:
   Open your browser and navigate to:
   [https://localhost:8082/flightreservation-node-es6/findFlights](https://localhost:8082/flightreservation-node-es6/findFlights)

   - This will take you to the first page of the application.
   - Ensure that the `BASE_URL` in your `.env` file is set to `/flightreservation-node-es6` for the application to work correctly.

---

## Directory Descriptions

### **`certs/`**

- This directory is used to store SSL/TLS certificates for enabling HTTPS.
- **Important**: Certificates should not be pushed to the repository. They are excluded by the `.gitignore` file.
- If HTTPS is enabled (`USE_HTTPS=true` in `.env`), ensure that valid certificates (`cert.pem` and `key.pem`) are placed in this directory.

### **`mysql-data/`**

- This directory is used to persist MySQL database data when running the database in a Docker container.
- **Important**: This directory should not be pushed to the repository. It is excluded by the `.gitignore` file.
- The data in this directory ensures that the database state is preserved across container restarts.
- It will be automatically created when the SQL scripts are executed.

---

## Notes

- Ensure that the `.env` file is **not pushed to the repository**. It is already excluded by the `.gitignore` file.
- Use a secure password for your database and avoid hardcoding it in the codebase.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## User Interaction Flow

1. **Search for Flights**:

   - **Route**: `GET /findFlights`
   - **Description**: Renders the `findFlights` view (flight search form).
   - **Next Step**: User submits the form to search for flights.

2. **View Flight Search Results**:

   - **Route**: `POST /findFlights`
   - **Description**: Executes the `findFlights` function to query the database for flights matching the search criteria. Renders the `findFlightsResults` view with the search results.
   - **Next Step**: User selects a flight and clicks the "Reserve" button.

3. **Reserve a Flight**:

   - **Route**: `GET /reserve`
   - **Description**: Executes the `renderReservationPage` function to render the `reserve` view with the selected flight details. The view contains a form to collect passenger data.
   - **Next Step**: User submits the form to reserve the flight.

4. **Create a Reservation**:

   - **Route**: `POST /createReservation`
   - **Description**: Executes the `createReservation` function to:
     - Create a passenger object and save it in the database.
     - Create a reservation object with the passenger ID and save it in the database.
     - Render the `reservationConfirmation` view with reservation, flight, and passenger details.
   - **Next Step**: User can either:
     - Click the "Continue to Check-In" link to proceed to check-in.
     - Click the "Confirm Reservation" button to complete the reservation.

5. **Complete Reservation**:

   - **Route**: `POST /completeReservation`
   - **Description**: Executes the `completeReservation` function to:
     - Process payment for the ticket using a mock payment function.
     - Render the `reservationConfirmation` view with a success or failure message and a "Check-In" link.
   - **Next Step**: User clicks the "Check-In" link to proceed to check-in.

6. **Check-In**:

   - **Route**: `GET /checkIn`
   - **Description**: Executes the `renderCheckInPage` function to render the `checkIn` view. The view displays reservation details and contains a form to enter the "Number of Bags."
   - **Next Step**: User submits the form to complete check-in.

7. **Complete Check-In**:
   - **Route**: `POST /completeCheckIn`
   - **Description**: Executes the `completeCheckIn` function to:
     - Update the reservation with the number of bags and mark it as checked in.
     - Render the final reservation details.

---

## API Documentation with Swagger

This project uses **Swagger** (OpenAPI) to document and test the API endpoints.

### Setting Up Swagger

1. Install Swagger dependencies:

   ```bash
   npm install swagger-ui-express swagger-jsdoc
   ```

2. Access the Swagger UI at `http://localhost:<port>/api-docs`.

3. To add new routes, annotate them with Swagger comments in the route files.

---

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Access the application at `http://localhost:<port>`.
