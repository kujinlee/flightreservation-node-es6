import asyncHandler from '../utils/asyncHandler.js';
import CustomError from '../utils/CustomError.js';
import Reservation from '../models/reservation.js';
import Flight from '../models/flight.js';
import Passenger from '../models/passenger.js';

export const renderFindFlights = (req, res) => {
    res.render('findFlights');
};

export const findFlights = asyncHandler(async (req, res) => {
    const { from, to, departureDate } = req.body;

    const flights = await Flight.findAll({
        where: {
            departure_city: from,
            arrival_city: to,
            date_of_departure: departureDate,
        },
    });

    if (flights.length > 0) {
        res.render('findFlightsResults', { flights });
    } else {
        res.render('findFlightsResults', { flights: [], msg: 'No flights found for the given criteria.' });
    }
});

export const completeCheckIn = asyncHandler(async (req, res) => {
    const { reservationId, numberOfBags } = req.body;

    console.log('MYLOG: Check-in request body:', req.body);

    const reservation = await Reservation.findByPk(reservationId, {
        include: [
            { model: Flight, as: 'flight' }, // Include flight details
            { model: Passenger, as: 'passenger' }, // Include passenger details
        ],
    });

    if (!reservation) {
        throw new CustomError('Reservation not found', 404);
    }

    console.log('MYLOG: Reservation before update:', reservation.toJSON());

    // Update the reservation with the number of bags and mark it as checked in
    reservation.numberOfBags = numberOfBags;
    reservation.checkedIn = true;

    await reservation.save();

    console.log('MYLOG: Reservation after update:', reservation.toJSON());

    res.render('checkInConfirmation', {
        msg: 'Check-in completed successfully!',
        reservation,
        flight: reservation.flight,
        passenger: reservation.passenger, // Pass passenger details to the view
    });
});

export const renderReservationPage = asyncHandler(async (req, res) => {
    const { flightId } = req.query;

    const flight = await Flight.findByPk(flightId);
    if (!flight) {
        throw new CustomError('Flight not found', 404);
    }

    res.render('reserve', { flight });
});

export const createReservation = asyncHandler(async (req, res) => {
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

    // Save passenger information
    const passenger = await Passenger.create({
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName || null,
        email,
        phone,
    });

    console.log('MYLOG: Passenger created:', passenger.toJSON());

    // Create the reservation
    const reservation = await Reservation.create({
        flightId,
        passengerId: passenger.id,
        cardNumber,
        amount,
    });

    console.log('MYLOG: Reservation created:', reservation.toJSON());

    res.render('reservationConfirmation', { reservation });
});

export const completeReservation = asyncHandler(async (req, res) => {
    const {
        reservationId,
        cardNumber,
        expiryDate,
        cvv,
        firstName,
        lastName,
        middleName,
        email,
        phone,
    } = req.body;

    const passenger = await Passenger.create({
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName || null,
        email,
        phone,
    });

    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
        throw new CustomError(`Reservation with ID ${reservationId} not found.`, 404);
    }

    reservation.passengerId = passenger.id;
    reservation.cardNumber = cardNumber;
    await reservation.save();

    res.send('Reservation completed successfully!');
});

export const renderCheckInPage = asyncHandler(async (req, res) => {
    const { reservationId } = req.query;

    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
        throw new CustomError('Reservation not found', 404);
    }

    res.render('checkIn', { reservation });
});
