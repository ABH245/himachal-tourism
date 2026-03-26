const destinationService = require('../services/destinationService');
const { validate } = require('../schemas/destinationSchema');

function getAll(req, res, next) {
  try {
    const { search } = req.query;
    const destinations = destinationService.getAll(search);
    res.json({ destinations });
  } catch (err) {
    next(err);
  }
}

function getById(req, res, next) {
  try {
    const destination = destinationService.getById(req.params.id);
    res.json({ destination });
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const { success, data, error } = validate(req.body);
    if (!success) return res.status(400).json({ error: 'Validation failed', details: error });
    const destination = destinationService.create(data);
    res.status(201).json({ destination });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create };
