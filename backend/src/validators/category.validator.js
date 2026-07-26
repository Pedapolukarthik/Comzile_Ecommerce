const { z } = require('zod');

const createCategorySchema = z.object({
  name: z.string({ required_error: 'Category name is required' }).min(1, 'Category name cannot be empty').trim(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  sortOrder: z.coerce.number().int().optional().default(0),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
