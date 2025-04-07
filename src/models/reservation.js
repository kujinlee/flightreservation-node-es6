import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Reservation = sequelize.define(
  'Reservation',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    checkedIn: {
      type: DataTypes.BOOLEAN, // Use BOOLEAN for Sequelize, but map it to BIT in MySQL
      allowNull: false,
      defaultValue: false,
      field: 'checked_in', // snake_case for database field
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
      field: 'number_of_bags', // snake_case for database field
      validate: {
        min: 0, // Ensure the number of bags is non-negative
      },
    },
    passengerId: {
      type: DataTypes.BIGINT,
      field: 'passenger_id', // snake_case for database field
      allowNull: false,
    },
    flightId: {
      type: DataTypes.BIGINT,
      field: 'flight_id', // snake_case for database field
      allowNull: false,
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created', // snake_case for database field
    },
    cardNumber: {
      type: DataTypes.STRING(20),
      field: 'card_number', // snake_case for database field
      validate: {
        isCreditCard: true,
      },
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
      field: 'amount', // snake_case for database field
      validate: {
        isFloat: true,
        min: 0,
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
    tableName: 'reservation',
    timestamps: true, // Enable Sequelize to handle createdAt and updatedAt
  }
);

export default Reservation;
