const { Router } = require('express');
const destinationController = require('../controllers/destinationController');
const activityController = require('../controllers/activityController');
const chatController = require('../controllers/chatController');

const router = Router();

// Destination routes
router.get('/destinations', destinationController.getAll);
router.get('/destinations/:id', destinationController.getById);
router.post('/destinations', destinationController.create);

// Activity routes
router.get('/activities', activityController.getAll);
router.get('/activities/:id', activityController.getById);
router.post('/activities', activityController.create);

// Chat route
router.post('/chat', chatController.chat);

// 404 catch-all for unmatched API routes
router.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

module.exports = router;
