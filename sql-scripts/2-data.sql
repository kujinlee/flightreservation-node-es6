INSERT INTO flight (id, flight_number, operating_airlines, departure_city, arrival_city, date_of_departure, estimated_departure_time, price, created_at, updated_at) 
VALUES 
(1, 'AA1', 'American Airlines', 'AUS', 'NYC', STR_TO_DATE('02-05-2024', '%m-%d-%Y'), '2024-02-05 03:14:07', 200.00, NOW(), NOW()),
(2, 'AA2', 'American Airlines', 'AUS', 'NYC', STR_TO_DATE('02-05-2024', '%m-%d-%Y'), '2024-02-05 05:14:07', 200.00, NOW(), NOW()),
(3, 'AA3', 'American Airlines', 'AUS', 'NYC', STR_TO_DATE('02-05-2024', '%m-%d-%Y'), '2024-02-05 06:14:07', 200.00, NOW(), NOW()),
(4, 'SW1', 'South West', 'AUS', 'NYC', STR_TO_DATE('02-05-2024', '%m-%d-%Y'), '2024-02-05 07:14:07', 200.00, NOW(), NOW()),
(5, 'UA1', 'United Airlines', 'NYC', 'DAL', STR_TO_DATE('02-05-2024', '%m-%d-%Y'), '2024-02-05 10:14:07', 200.00, NOW(), NOW()),
(6, 'UA1', 'United Airlines', 'NYC', 'DAL', STR_TO_DATE('02-05-2024', '%m-%d-%Y'), '2024-02-05 10:14:07', 200.00, NOW(), NOW()),
(7, 'SW1', 'South West', 'AUS', 'NYC', STR_TO_DATE('02-06-2024', '%m-%d-%Y'), '2024-02-06 07:14:07', 200.00, NOW(), NOW()),
(8, 'SW2', 'South West', 'AUS', 'NYC', STR_TO_DATE('02-06-2024', '%m-%d-%Y'), '2024-02-06 08:14:07', 200.00, NOW(), NOW()),
(9, 'SW3', 'South West', 'NYC', 'DAL', STR_TO_DATE('02-06-2024', '%m-%d-%Y'), '2024-02-06 10:14:07', 200.00, NOW(), NOW()),
(10, 'UA1', 'United Airlines', 'NYC', 'DAL', STR_TO_DATE('02-06-2024', '%m-%d-%Y'), '2024-02-06 10:14:07', 200.00, NOW(), NOW());
