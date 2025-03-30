import sequelize from '../config/database.js';
import Flight from './flight.js';
import Reservation from './reservation.js';
import Passenger from './passenger.js';
import logger from '../utils/logger.js';

// Set up associations with explicit foreign key names and aliases
Flight.hasMany(Reservation, { foreignKey: 'flight_id', as: 'reservations' });
Reservation.belongsTo(Flight, { foreignKey: 'flight_id', as: 'flight' });

Passenger.hasMany(Reservation, {
  foreignKey: 'passenger_id',
  as: 'reservations',
});
Reservation.belongsTo(Passenger, {
  foreignKey: 'passenger_id',
  as: 'passenger',
});

logger.info('Associations initialized:');
logger.info(Reservation.associations);
logger.info(Passenger.associations);
logger.info(Flight.associations);

export { sequelize, Flight, Reservation, Passenger };
