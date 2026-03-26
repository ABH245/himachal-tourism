const { z } = require('zod');

const ActivitySchema = z.object({
  name: z.string().min(2).max(100),
  location: z.string().min(2).max(100),
  category: z.enum(['trekking', 'skiing', 'paragliding', 'camping', 'sightseeing', 'rafting']),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0),
  price: z.number().min(0),
  duration: z.string().optional(),
  emoji: z.string().optional(),
  description: z.string().max(500).optional(),
});

function validate(payload) {
  const result = ActivitySchema.safeParse(payload);
  if (result.success) return { success: true, data: result.data, error: null };
  return { success: false, data: null, error: result.error.flatten() };
}

module.exports = { ActivitySchema, validate };
