import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Passenger = sequelize.define('Passenger', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    first_name: { 
        type: DataTypes.STRING(256), 
        allowNull: true,
        validate: {
            len: [1, 256], // Ensure length is between 1 and 256 characters
        },
    },
    last_name: { 
        type: DataTypes.STRING(256), 
        allowNull: true,
        validate: {
            len: [1, 256], // Ensure length is between 1 and 256 characters
        },
    },
    middle_name: { 
        type: DataTypes.STRING(256), 
        allowNull: true,
        validate: {
            len: [0, 256], // Ensure length is between 0 and 256 characters
        },
    },
    email: { 
        type: DataTypes.STRING(50), 
        allowNull: true,
        validate: {
            isEmail: true, // Ensure the value is a valid email address
        },
    },
    phone: { 
        type: DataTypes.STRING(10), 
        allowNull: true,
        validate: {
            isNumeric: true, // Ensure the value contains only numbers
            len: [10, 10], // Ensure the phone number is exactly 10 digits
        },
    },
}, {
    tableName: 'passenger',
    timestamps: false,
});

// Add a beforeSave hook to validate fields conditionally
Passenger.beforeSave((passenger, options) => {
    if (process.env.NODE_ENV === 'development') {
        const validFields = Object.keys(Passenger.getAttributes()); // Use getAttributes instead of rawAttributes

        // Check if all fields being updated exist in the model
        const fieldsToUpdate = Object.keys(passenger._changed);
        for (const field of fieldsToUpdate) {
            if (!validFields.includes(field)) {
                throw new Error(`Field mismatch: ${field} does not exist in the Passenger model.`);
            }
        }
    }
});

export default Passenger;