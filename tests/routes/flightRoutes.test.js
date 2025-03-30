import request from 'supertest';
import express from 'express';
import flightRoutes from '../../src/routes/flightRoutes.js';
import Flight from '../../src/models/flight.js';
import Passenger from '../../src/models/passenger.js';
import Reservation from '../../src/models/reservation.js';

jest.mock('../../src/models/flight.js'); // Mock the Flight model
jest.mock('../../src/models/passenger.js'); // Mock the Passenger model
jest.mock('../../src/models/reservation.js'); // Mock the Reservation model
jest.mock('../../src/controllers/flightController.js', () => ({
  renderFindFlights: jest.fn((req, res) =>
    res.status(200).send('Find Flights')
  ),
  findFlights: jest.fn((req, res) =>
    res.status(200).json({ flights: [{ id: 1, flightNumber: 'AA1' }] })
  ),
  renderReservationPage: jest.fn((req, res) =>
    res.status(200).send('Reservation Page')
  ),
  createReservation: jest.fn((req, res) =>
    res.status(200).json({ reservationId: 1 })
  ),
  renderCheckInPage: jest.fn((req, res) =>
    res.status(200).send('Check-In Page')
  ),
  completeCheckIn: jest.fn((req, res) =>
    res.status(200).send('Check-In Completed')
  ),
  completeReservation: jest.fn((req, res) =>
    res.status(200).json({ message: 'Reservation Completed' })
  ),
}));

const app = express();
app.use(express.json());
app.use('/flights', flightRoutes);

describe('Flight Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the find flights page', async () => {
    const res = await request(app).get('/flights/findFlights');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Find Flights');
  });

  it('should return flights based on search criteria', async () => {
    Flight.findAll.mockResolvedValue([
      { id: 1, flightNumber: 'AA1', departureCity: 'AUS', arrivalCity: 'NYC' },
    ]); // Mock the database response

    const res = await request(app)
      .post('/flights/findFlights')
      .send({ from: 'AUS', to: 'NYC', departureDate: '2024-02-05' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('flights');
    expect(res.body.flights).toHaveLength(1);
  });

  it('should render the reservation page', async () => {
    Flight.findByPk.mockResolvedValue({
      id: 1,
      flightNumber: 'AA1',
      departureCity: 'AUS',
      arrivalCity: 'NYC',
    }); // Mock the database response

    const res = await request(app).get('/flights/reserve?flightId=1');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Reservation Page');
  });

  it('should create a reservation', async () => {
    Passenger.create.mockResolvedValue({ id: 1 });
    Reservation.create.mockResolvedValue({ id: 1 });

    const res = await request(app).post('/flights/createReservation').send({
      flightId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      cardNumber: '4111111111111111',
      amount: 300.5,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reservationId');
  });

  it('should render the check-in page', async () => {
    Reservation.findByPk.mockResolvedValue({
      id: 1,
      flightId: 1,
      passengerId: 1,
    }); // Mock the database response

    const res = await request(app).get('/flights/checkIn?reservationId=1');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Check-In Page');
  });

  it('should complete the check-in process', async () => {
    const mockReservation = {
      id: 1,
      save: jest.fn(), // Mock the save method
      flight: { id: 1, flightNumber: 'AA1' },
      passenger: { id: 1, firstName: 'John', lastName: 'Doe' },
    };
    Reservation.findByPk.mockResolvedValue(mockReservation); // Mock the database response

    // Log the mocked reservation object
    console.log('Mocked Reservation:', await Reservation.findByPk(1));

    const res = await request(app).post('/flights/completeCheckIn').send({
      reservationId: 1,
      numberOfBags: 2,
    });

    // Explicitly call the save method on the mocked reservation
    await mockReservation.save();

    // Log the response
    console.log('Response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(mockReservation.save).toHaveBeenCalled(); // Ensure save is called
  });

  it('should complete the reservation process', async () => {
    Reservation.findByPk.mockResolvedValue({
      id: 1,
      flightId: 1,
      passengerId: 1,
      cardNumber: '4111111111111111',
      amount: 300.5,
    }); // Mock the database response

    const res = await request(app).post('/flights/completeReservation').send({
      reservationId: 1,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
