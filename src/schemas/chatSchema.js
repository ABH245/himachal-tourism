const { z } = require('zod');

const ChatMessageSchema = z.object({
  message: z.string().min(1).max(500),
});

function validate(payload) {
  const result = ChatMessageSchema.safeParse(payload);
  if (result.success) return { success: true, data: result.data, error: null };
  return { success: false, data: null, error: result.error.flatten() };
}

module.exports = { ChatMessageSchema, validate };
