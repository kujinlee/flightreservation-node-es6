import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Flight = sequelize.define(
  'Flight',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    flightNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'flight_number', // snake_case for database field
      validate: {
        len: [1, 10], // Ensure length is between 1 and 10 characters
      },
    },
    operatingAirlines: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'operating_airlines', // snake_case for database field
      validate: {
        len: [1, 50], // Ensure length is between 1 and 50 characters
      },
    },
    departureCity: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'departure_city', // snake_case for database field
      validate: {
        len: [1, 50], // Ensure length is between 1 and 50 characters
      },
    },
    arrivalCity: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'arrival_city', // snake_case for database field
      validate: {
        len: [1, 50], // Ensure length is between 1 and 50 characters
      },
    },
    dateOfDeparture: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_of_departure', // snake_case for database field
      validate: {
        isDate: true, // Ensure the value is a valid date
      },
    },
    estimatedDepartureTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'estimated_departure_time', // snake_case for database field
      validate: {
        isDate: true, // Ensure the value is a valid date
      },
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
      field: 'price', // snake_case for database field
      validate: {
        isFloat: true, // Ensure the value is a valid float
        min: 0, // Ensure the price is non-negative
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at', // Map to snake_case column name
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at', // Map to snake_case column name
    },
  },
  {
    tableName: 'flight',
    timestamps: true, // Enable timestamps for createdAt and updatedAt
  }
);

export default Flight;
