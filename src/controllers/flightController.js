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

export const completeCheckIn = asyncHandler(async (req, res, next) => {
    const { reservationId, numberOfBags } = req.body;

    console.log('MYLOG: Check-in request body:', req.body);

    const reservation = await Reservation.findByPk(reservationId, {
        include: [
            { model: Flight, as: 'flight' }, // Include flight details
            { model: Passenger, as: 'passenger' }, // Include passenger details
        ],
    });

    if (!reservation) {
        return next(new CustomError('Reservation not found', 404));
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
        return next(new CustomError('Flight not found', 404));
    }

    // Render the confirmation page with the "Confirm Reservation" button
    res.render('reservationConfirmation', {
        reservation,
        flightDetails,
        passengerDetails: {
            name: `${passenger.first_name} ${passenger.last_name}`,
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
    const paymentSuccess = processPayment(reservation.cardNumber, reservation.amount);

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
            name: `${reservation.passenger.first_name} ${reservation.passenger.last_name}`,
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
    console.log(`Processing payment for card: ${cardNumber}, amount: ${amount}`);
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
