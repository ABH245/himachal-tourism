const { z } = require('zod');

const DestinationSchema = z.object({
  name: z.string().min(2).max(100),
  region: z.string().min(2).max(100),
  category: z.enum(['hill-station', 'adventure', 'religious', 'nature', 'heritage']),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0),
  price: z.number().min(0).optional(),
  emoji: z.string().optional(),
  description: z.string().max(500).optional(),
});

function validate(payload) {
  const result = DestinationSchema.safeParse(payload);
  if (result.success) return { success: true, data: result.data, error: null };
  return { success: false, data: null, error: result.error.flatten() };
}

module.exports = { DestinationSchema, validate };
