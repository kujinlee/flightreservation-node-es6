import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Reservation = sequelize.define('Reservation', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    checkedIn: { 
        type: DataTypes.BOOLEAN, // Use BOOLEAN for Sequelize, but map it to BIT in MySQL
        allowNull: false, 
        defaultValue: false, 
        field: 'checked_in',
        get() {
            // Convert BIT(1) to BOOLEAN when retrieving from the database
            const value = this.getDataValue('checkedIn');
            return value === 1; // Convert 1 to true, 0 to false
        },
        set(value) {
            // Convert BOOLEAN to 0 or 1 when saving to the database
            this.setDataValue('checkedIn', value ? 1 : 0);
        },
    },
    numberOfBags: { 
        type: DataTypes.INTEGER, 
        field: 'number_of_bags',
        validate: {
            min: 0, // Ensure the number of bags is non-negative
        },
    },
    passengerId: { 
        type: DataTypes.BIGINT, 
        field: 'passenger_id',
        allowNull: false,
    },
    flightId: { 
        type: DataTypes.BIGINT, 
        field: 'flight_id',
        allowNull: false,
    },
    created: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, 
        field: 'created',
    },
    cardNumber: { 
        type: DataTypes.STRING(20), 
        field: 'card_number',
        validate: {
            isCreditCard: true,
        },
    },
    amount: { 
        type: DataTypes.DOUBLE, 
        allowNull: false, 
        defaultValue: 0.0, 
        field: 'amount',
        validate: {
            isFloat: true,
            min: 0,
        },
    },
}, {
    tableName: 'reservation',
    timestamps: false,
});

// Add a beforeSave hook to validate fields conditionally
Reservation.beforeSave((reservation, options) => {
    if (process.env.NODE_ENV === 'development') {
        const validFields = Object.keys(Reservation.getAttributes()); // Use getAttributes instead of rawAttributes

        // Check if all fields being updated exist in the model
        const fieldsToUpdate = Object.keys(reservation._changed);
        for (const field of fieldsToUpdate) {
            if (!validFields.includes(field)) {
                throw new Error(`Field mismatch: ${field} does not exist in the Reservation model.`);
            }
        }
    }
});

export default Reservation;