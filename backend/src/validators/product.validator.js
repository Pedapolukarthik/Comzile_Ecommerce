const { z } = require('zod');

const createProductSchema = z
  .object({
    name: z.string({ required_error: 'Product name is required' }).min(1, 'Product name cannot be empty').trim(),
    sku: z.string({ required_error: 'SKU is required' }).min(1, 'SKU cannot be empty').trim(),
    categoryId: z.string().optional().nullable(),
    shortDescription: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    brand: z.string().optional().nullable(),
    regularPrice: z.coerce
      .number({ required_error: 'Regular price is required' })
      .gt(0, 'Regular price must be greater than 0'),
    salePrice: z.coerce.number().min(0, 'Sale price cannot be negative').optional().nullable(),
    stockQuantity: z.coerce
      .number({ required_error: 'Stock quantity is required' })
      .int()
      .min(0, 'Stock quantity cannot be negative'),
    lowStockThreshold: z.coerce.number().int().min(0).optional().default(5),
    weight: z.coerce.number().min(0).optional().nullable(),
    dimensions: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK']).optional().default('ACTIVE'),
    featured: z.coerce.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      if (data.salePrice !== undefined && data.salePrice !== null && data.salePrice > 0) {
        return data.salePrice <= data.regularPrice;
      }
      return true;
    },
    {
      message: 'Sale price must be less than or equal to regular price',
      path: ['salePrice'],
    }
  );

const updateProductSchema = z
  .object({
    name: z.string().min(1).trim().optional(),
    sku: z.string().min(1).trim().optional(),
    categoryId: z.string().optional().nullable(),
    shortDescription: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    brand: z.string().optional().nullable(),
    regularPrice: z.coerce.number().gt(0, 'Regular price must be greater than 0').optional(),
    salePrice: z.coerce.number().min(0).optional().nullable(),
    stockQuantity: z.coerce.number().int().min(0, 'Stock quantity cannot be negative').optional(),
    lowStockThreshold: z.coerce.number().int().min(0).optional(),
    weight: z.coerce.number().min(0).optional().nullable(),
    dimensions: z.string().optional().nullable(),
    status: z.enum(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK']).optional(),
    featured: z.coerce.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.salePrice !== undefined &&
        data.salePrice !== null &&
        data.regularPrice !== undefined &&
        data.regularPrice !== null
      ) {
        return data.salePrice <= data.regularPrice;
      }
      return true;
    },
    {
      message: 'Sale price must be less than or equal to regular price',
      path: ['salePrice'],
    }
  );

const updateStockSchema = z.object({
  stockQuantity: z.coerce
    .number({ required_error: 'Stock quantity is required' })
    .int()
    .min(0, 'Stock quantity cannot be negative'),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
};
