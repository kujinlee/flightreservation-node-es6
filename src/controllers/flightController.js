import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import Reservation from '../models/reservation.js';
import Flight from '../models/flight.js';
import Passenger from '../models/passenger.js';
import process from 'process';
import logger from '../utils/logger.js';
import { validateFields } from '../utils/validateFields.js';

export const renderFindFlights = (req, res) => {
  res.render('findFlights');
};

export const findFlights = asyncHandler(async (req, res) => {
  const { from, to, departureDate } = req.body;
  logger.debug('Searching for flights with criteria:', {
    from,
    to,
    departureDate,
  });

  const flights = await Flight.findAll({
    where: {
      departureCity: from, // camelCase for JavaScript
      arrivalCity: to, // camelCase for JavaScript
      dateOfDeparture: departureDate, // camelCase for JavaScript
    },
  });

  if (flights.length > 0) {
    logger.debug('Flights found:', { count: flights.length });
    res.render('findFlightsResults', { flights });
  } else {
    logger.debug('No flights found for the given criteria.');
    res.render('findFlightsResults', {
      flights: [],
      msg: 'No flights found for the given criteria.',
    });
  }
});

export const completeCheckIn = asyncHandler(async (req, res, next) => {
  const { reservationId, numberOfBags } = req.body;

  logger.debug('MYLOG: Check-in request body:', req.body);

  const reservation = await Reservation.findByPk(reservationId, {
    include: [
      { model: Flight, as: 'flight' }, // Include flight details
      { model: Passenger, as: 'passenger' }, // Include passenger details
    ],
  });

  if (!reservation) {
    return next(new CustomError('Reservation not found', 404));
  }

  logger.debug('MYLOG: Reservation before update:', reservation.toJSON());

  // Update the reservation with the number of bags and mark it as checked in
  reservation.numberOfBags = numberOfBags;
  reservation.checkedIn = true;

  // Log before calling save
  console.log('Calling save on reservation:', reservation);

  // Ensure the save method is called
  await reservation.save();

  // Log after calling save
  console.log('Save method called successfully on reservation.');

  logger.debug('MYLOG: Reservation after update:', reservation.toJSON());

  res.render('checkInConfirmation', {
    msg: 'Check-in completed successfully!',
    reservation,
    flight: reservation.flight,
    passenger: reservation.passenger, // Pass passenger details to the view
  });
});

export const renderReservationPage = asyncHandler(async (req, res, next) => {
  const { flightId } = req.query;

  const flight = await Flight.findByPk(flightId);
  if (!flight) {
    return next(new CustomError('Flight not found', 404));
  }

  res.render('reserve', { flight });
});

export const createReservation = asyncHandler(async (req, res, next) => {
  const {
    flightId,
    firstName,
    lastName,
    middleName,
    email,
    phone,
    cardNumber,
    amount,
  } = req.body;

  logger.debug('Creating reservation with data:', {
    flightId,
    firstName,
    lastName,
    email,
  });

  // Validate passenger fields
  validateFields({ firstName, lastName, middleName, email, phone }, Passenger);

  // Save passenger information
  const passenger = await Passenger.create({
    firstName,
    lastName,
    middleName: middleName || null,
    email,
    phone,
  });

  logger.debug('Passenger created:', passenger.toJSON());

  // Validate reservation fields
  validateFields({ flightId, cardNumber, amount }, Reservation);

  // Create the reservation
  const reservation = await Reservation.create({
    flightId,
    passengerId: passenger.id,
    cardNumber,
    amount,
  });

  logger.debug('Reservation created:', reservation.toJSON());

  // Fetch flight details
  const flightDetails = await Flight.findByPk(flightId, {
    attributes: [
      'flightNumber',
      'departureCity',
      'arrivalCity',
      'dateOfDeparture',
      'estimatedDepartureTime',
    ],
  });
  if (!flightDetails) {
    logger.debug('Flight not found for reservation:', { flightId });
    return next(new CustomError('Flight not found', 404));
  }

  logger.debug(
    'Flight details fetched for reservation:',
    flightDetails.toJSON()
  );

  // Render the confirmation page with the "Confirm Reservation" button
  res.render('reservationConfirmation', {
    reservation,
    flightDetails,
    passengerDetails: {
      name: `${passenger.firstName} ${passenger.lastName}`,
      email: passenger.email,
    },
    showConfirmButton: true,
    message: 'Reservation created successfully!',
    BASE_URL: process.env.BASE_URL,
  });
});

export const completeReservation = asyncHandler(async (req, res, next) => {
  const { reservationId } = req.body;

  // Fetch reservation and associated passenger
  const reservation = await Reservation.findByPk(reservationId, {
    include: [{ model: Passenger, as: 'passenger' }],
  });
  if (!reservation) {
    return next(new CustomError('Reservation not found', 404));
  }

  // Placeholder for external payment processing
  const paymentSuccess = processPayment(
    reservation.cardNumber,
    reservation.amount
  );

  // Fetch flight details
  const flightDetails = await Flight.findByPk(reservation.flightId, {
    attributes: [
      'flightNumber',
      'departureCity',
      'arrivalCity',
      'dateOfDeparture',
      'estimatedDepartureTime',
    ],
  });
  if (!flightDetails) {
    return next(new CustomError('Flight not found', 404));
  }

  // Render the confirmation page with a success or failure message
  res.render('reservationConfirmation', {
    reservation,
    flightDetails,
    passengerDetails: {
      name: `${reservation.passenger.firstName} ${reservation.passenger.lastName}`,
      email: reservation.passenger.email,
    },
    showConfirmButton: false,
    message: paymentSuccess
      ? 'Payment processed successfully! You can now check in.'
      : 'Payment failed. Please try again.',
    BASE_URL: process.env.BASE_URL,
  });
});

// Placeholder function for payment processing
function processPayment(cardNumber, amount) {
  logger.debug(`Processing payment for card: ${cardNumber}, amount: ${amount}`);
  // Simulate payment success
  return true;
}

export const renderCheckInPage = asyncHandler(async (req, res, next) => {
  const { reservationId } = req.query;

  if (!reservationId) {
    return next(new CustomError('Reservation ID is required', 400));
  }

  const reservation = await Reservation.findByPk(reservationId);
  if (!reservation) {
    return next(new CustomError('Reservation not found', 404));
  }

  res.render('checkIn', { reservation });
});
