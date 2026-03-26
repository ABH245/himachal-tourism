const chatService = require('../services/chatService');
const { validate } = require('../schemas/chatSchema');

function chat(req, res, next) {
  try {
    const { success, data, error } = validate(req.body);
    if (!success) return res.status(400).json({ error: 'Validation failed', details: error });
    const reply = chatService.reply(data.message);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
