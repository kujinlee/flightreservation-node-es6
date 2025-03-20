import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Flight = sequelize.define('Flight', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    flightNumber: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        field: 'flight_number',
        validate: {
            len: [1, 10], // Ensure length is between 1 and 10 characters
        },
    },
    operatingAirlines: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        field: 'operating_airlines',
        validate: {
            len: [1, 50], // Ensure length is between 1 and 50 characters
        },
    },
    departureCity: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        field: 'departure_city',
        validate: {
            len: [1, 50], // Ensure length is between 1 and 50 characters
        },
    },
    arrivalCity: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        field: 'arrival_city',
        validate: {
            len: [1, 50], // Ensure length is between 1 and 50 characters
        },
    },
    dateOfDeparture: { 
        type: DataTypes.DATEONLY, 
        allowNull: false, 
        field: 'date_of_departure',
        validate: {
            isDate: true, // Ensure the value is a valid date
        },
    },
    estimatedDepartureTime: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, 
        field: 'estimated_departure_time',
        validate: {
            isDate: true, // Ensure the value is a valid date
        },
    },
    price: { 
        type: DataTypes.DOUBLE, 
        allowNull: false, 
        defaultValue: 0.0, 
        field: 'price',
        validate: {
            isFloat: true, // Ensure the value is a valid float
            min: 0, // Ensure the price is non-negative
        },
    },
}, {
    tableName: 'flight',
    timestamps: false,
});

// Add a beforeSave hook to validate fields conditionally
Flight.beforeSave((flight, options) => {
    if (process.env.NODE_ENV === 'development') {
        const validFields = Object.keys(Flight.getAttributes()); // Use getAttributes instead of rawAttributes

        // Check if all fields being updated exist in the model
        const fieldsToUpdate = Object.keys(flight._changed);
        for (const field of fieldsToUpdate) {
            if (!validFields.includes(field)) {
                throw new Error(`Field mismatch: ${field} does not exist in the Flight model.`);
            }
        }
    }
});

export default Flight;