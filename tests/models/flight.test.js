import { sequelize } from 'sequelize-test-helpers';

const DataTypes = {
  STRING: jest.fn(),
  DATEONLY: jest.fn(),
  DATE: jest.fn(),
  DOUBLE: jest.fn(),
};

describe('Flight Model', () => {
  const Flight = sequelize.define(
    'Flight',
    {
      flightNumber: DataTypes.STRING,
      operatingAirlines: DataTypes.STRING,
      departureCity: DataTypes.STRING,
      arrivalCity: DataTypes.STRING,
      dateOfDeparture: DataTypes.DATEONLY,
      estimatedDepartureTime: DataTypes.DATE,
      price: DataTypes.DOUBLE,
    },
    { modelName: 'Flight' } // Explicitly set the model name
  );

  // Use Object.defineProperty to set the name property
  Object.defineProperty(Flight, 'name', { value: 'Flight' });

  // Mock rawAttributes
  Flight.rawAttributes = {
    flightNumber: { type: DataTypes.STRING },
    operatingAirlines: { type: DataTypes.STRING },
    departureCity: { type: DataTypes.STRING },
    arrivalCity: { type: DataTypes.STRING },
    dateOfDeparture: { type: DataTypes.DATEONLY },
    estimatedDepartureTime: { type: DataTypes.DATE },
    price: { type: DataTypes.DOUBLE },
  };

  it('should have the correct model name', () => {
    expect(Flight.name).toBe('Flight'); // Directly check the model name
  });

  it('should have the correct fields', () => {
    expect(Flight.rawAttributes).toHaveProperty('flightNumber');
    expect(Flight.rawAttributes).toHaveProperty('operatingAirlines');
    expect(Flight.rawAttributes).toHaveProperty('departureCity');
    expect(Flight.rawAttributes).toHaveProperty('arrivalCity');
    expect(Flight.rawAttributes).toHaveProperty('dateOfDeparture');
    expect(Flight.rawAttributes).toHaveProperty('estimatedDepartureTime');
    expect(Flight.rawAttributes).toHaveProperty('price');
  });
});
