import express from 'express';
import {
  renderFindFlights,
  findFlights,
  renderCheckInPage,
  completeCheckIn,
  renderReservationPage,
  createReservation,
  completeReservation,
} from '../controllers/flightController.js';

const router = express.Router();

/**
 * @swagger
 * /findFlights:
 *   get:
 *     summary: Render the flight search form
 *     responses:
 *       200:
 *         description: Successfully rendered the flight search form
 */
router.get('/findFlights', renderFindFlights);

/**
 * @swagger
 * /findFlights:
 *   post:
 *     summary: Search for flights
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *               - departureDate
 *             properties:
 *               from:
 *                 type: string
 *                 description: Departure city
 *                 example: "New York"
 *               to:
 *                 type: string
 *                 description: Arrival city
 *                 example: "Los Angeles"
 *               departureDate:
 *                 type: string
 *                 format: date
 *                 description: Date of departure
 *                 example: "2024-01-01"
 *     responses:
 *       200:
 *         description: Successfully retrieved flight search results
 *       400:
 *         description: Invalid input data
 */
router.post('/findFlights', findFlights);

/**
 * @swagger
 * /checkIn:
 *   get:
 *     summary: Render the check-in page
 *     parameters:
 *       - in: query
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reservation to check in
 *         example: "123"
 *     responses:
 *       200:
 *         description: Successfully rendered the check-in page
 *       400:
 *         description: Reservation ID is required
 *       404:
 *         description: Reservation not found
 */
router.get('/checkIn', renderCheckInPage);

/**
 * @swagger
 * /completeCheckIn:
 *   post:
 *     summary: Complete the check-in process
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - reservationId
 *               - numberOfBags
 *             properties:
 *               reservationId:
 *                 type: string
 *                 description: The ID of the reservation
 *                 example: "123"
 *               numberOfBags:
 *                 type: integer
 *                 description: The number of bags for check-in
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully completed the check-in process
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Reservation not found
 */
router.post('/completeCheckIn', completeCheckIn);

/**
 * @swagger
 * /reserve:
 *   get:
 *     summary: Render the reservation page
 *     parameters:
 *       - in: query
 *         name: flightId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the flight to reserve
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully rendered the reservation page
 *       400:
 *         description: Flight ID is required
 *       404:
 *         description: Flight not found
 */
router.get('/reserve', renderReservationPage);

/**
 * @swagger
 * /createReservation:
 *   post:
 *     summary: Create a new reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flightId
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - cardNumber
 *               - amount
 *             properties:
 *               flightId:
 *                 type: string
 *                 description: The ID of the flight to reserve
 *                 example: "1"
 *               firstName:
 *                 type: string
 *                 description: The first name of the passenger
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: The last name of the passenger
 *                 example: "Doe"
 *               middleName:
 *                 type: string
 *                 description: The middle name of the passenger (optional)
 *                 example: "A"
 *               email:
 *                 type: string
 *                 description: The email address of the passenger
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 description: The phone number of the passenger
 *                 example: "1234567890"
 *               cardNumber:
 *                 type: string
 *                 description: The credit card number for payment
 *                 example: "4111111111111111"
 *               amount:
 *                 type: number
 *                 description: The amount to be paid for the reservation
 *                 example: 300.50
 *     responses:
 *       200:
 *         description: Successfully created a new reservation
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Flight not found
 */
router.post('/createReservation', createReservation);

/**
 * @swagger
 * /completeReservation:
 *   post:
 *     summary: Complete the reservation process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservationId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully completed the reservation process
 */
router.post('/completeReservation', completeReservation);

export default router;
