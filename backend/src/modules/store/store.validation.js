const { z } = require('zod');

const storeIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Store ID parameter is required')
  })
});

module.exports = {
  storeIdParamSchema
};
