const MESSAGES = {
  SUCCESS: 'Operation completed successfully.',
  HEALTH_OK: 'Multi-Tenant SaaS eCommerce API Health Check Passed.',
  UNAUTHORIZED: 'Authentication required. Invalid or missing token.',
  FORBIDDEN: 'Forbidden. Insufficient permissions for this resource.',
  NOT_FOUND: 'Requested resource not found.',
  TENANT_REQUIRED: 'Store ID / Tenant context is required for this operation.',
  TENANT_NOT_FOUND: 'Tenant / Store not found or inactive.',
  INTERNAL_ERROR: 'An internal server error occurred.'
};

module.exports = { MESSAGES };
