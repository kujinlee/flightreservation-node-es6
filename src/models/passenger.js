import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Passenger = sequelize.define(
  'Passenger',
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    firstName: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'first_name', // snake_case for database field
      validate: {
        len: [1, 256], // Ensure length is between 1 and 256 characters
      },
    },
    lastName: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'last_name', // snake_case for database field
      validate: {
        len: [1, 256], // Ensure length is between 1 and 256 characters
      },
    },
    middleName: {
      type: DataTypes.STRING(256),
      allowNull: true,
      field: 'middle_name', // snake_case for database field
      validate: {
        len: [0, 256], // Ensure length is between 0 and 256 characters
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'email', // snake_case for database field
      validate: {
        isEmail: true, // Ensure the value is a valid email address
      },
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'phone', // snake_case for database field
      validate: {
        isNumeric: true, // Ensure the value contains only numbers
        len: [10, 10], // Ensure the phone number is exactly 10 digits
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
    tableName: 'passenger',
    timestamps: true, // Enable Sequelize to handle createdAt and updatedAt
  }
);

export default Passenger;
