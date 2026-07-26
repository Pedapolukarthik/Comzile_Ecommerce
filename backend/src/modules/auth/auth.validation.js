const { z } = require('zod');

const demoTokenSchema = z.object({
  body: z.object({
    role: z.enum(['SUPER_ADMIN', 'SELLER', 'CUSTOMER', 'STAFF']).optional(),
    email: z.string().email().optional(),
    storeId: z.string().optional()
  })
});

module.exports = {
  demoTokenSchema
};
