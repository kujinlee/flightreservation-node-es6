CREATE DATABASE IF NOT EXISTS reservation;

USE reservation;

CREATE TABLE IF NOT EXISTS flight (
  id BIGINT NOT NULL AUTO_INCREMENT,
  flight_number VARCHAR(20) NOT NULL, 
  operating_airlines VARCHAR(20) NOT NULL,
  departure_city VARCHAR(20) NOT NULL,
  arrival_city VARCHAR(20) NOT NULL,
  date_of_departure DATE NOT NULL,
  estimated_departure_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  price DOUBLE(10,2) NOT NULL DEFAULT 0.0, 
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS passenger (
  id BIGINT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(256),
  last_name VARCHAR(256),
  middle_name VARCHAR(256),
  email VARCHAR(50),
  phone VARCHAR(10),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS reservation (
  id BIGINT NOT NULL AUTO_INCREMENT,
  checked_in BIT NOT NULL DEFAULT 0,
  number_of_bags INT,
  passenger_id BIGINT,
  flight_id BIGINT,
  created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  card_number VARCHAR(20),
  amount DOUBLE(10,2) NOT NULL DEFAULT 0.0,
  PRIMARY KEY (id),
  FOREIGN KEY (passenger_id) REFERENCES passenger(id) ON DELETE CASCADE,
  FOREIGN KEY (flight_id) REFERENCES flight(id)
);
