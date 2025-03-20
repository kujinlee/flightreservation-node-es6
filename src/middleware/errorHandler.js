import CustomError from '../utils/CustomError.js';

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ error: err.message });
    }

    res.status(500).send({ error: 'An unexpected error occurred.' });
};

export default errorHandler;