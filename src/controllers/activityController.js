const activityService = require('../services/activityService');
const { validate } = require('../schemas/activitySchema');

function getAll(req, res, next) {
  try {
    const { search } = req.query;
    const activities = activityService.getAll(search);
    res.json({ activities });
  } catch (err) {
    next(err);
  }
}

function getById(req, res, next) {
  try {
    const activity = activityService.getById(req.params.id);
    res.json({ activity });
  } catch (err) {
    next(err);
  }
}

function create(req, res, next) {
  try {
    const { success, data, error } = validate(req.body);
    if (!success) return res.status(400).json({ error: 'Validation failed', details: error });
    const activity = activityService.create(data);
    res.status(201).json({ activity });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create };
