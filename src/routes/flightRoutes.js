import express from 'express';
import {
    renderFindFlights,
    findFlights,
    renderCheckInPage,
    completeCheckIn,
    renderReservationPage,
    createReservation,
    completeReservation
} from '../controllers/flightController.js';

const router = express.Router();

router.get('/findFlights', renderFindFlights);
router.post('/findFlights', findFlights);
router.get('/checkIn', renderCheckInPage);
router.post('/completeCheckIn', completeCheckIn);
router.get('/reserve', renderReservationPage);
router.post('/createReservation', createReservation);
router.post('/completeReservation', completeReservation);

export default router;