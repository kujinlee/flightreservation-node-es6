import sequelize from '../config/database.js';
import Flight from './flight.js';
import Reservation from './reservation.js';
import Passenger from './passenger.js';

// Set up associations with explicit foreign key names and aliases
Flight.hasMany(Reservation, { foreignKey: 'flight_id', as: 'reservations' });
Reservation.belongsTo(Flight, { foreignKey: 'flight_id', as: 'flight' });

Passenger.hasMany(Reservation, { foreignKey: 'passenger_id', as: 'reservations' });
Reservation.belongsTo(Passenger, { foreignKey: 'passenger_id', as: 'passenger' });

console.log('Associations initialized:');
console.log(Reservation.associations);
console.log(Passenger.associations);
console.log(Flight.associations);

export { sequelize, Flight, Reservation, Passenger };