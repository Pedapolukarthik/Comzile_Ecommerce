const PERMISSIONS = {
  // Global & Admin permissions
  MANAGE_PLATFORM: 'manage:platform',
  MANAGE_TENANTS: 'manage:tenants',

  // Store & Seller permissions
  MANAGE_STORE: 'manage:store',
  VIEW_STORE: 'view:store',
  MANAGE_PRODUCTS: 'manage:products',
  VIEW_PRODUCTS: 'view:products',
  MANAGE_ORDERS: 'manage:orders',
  VIEW_ORDERS: 'view:orders',

  // Customer permissions
  CREATE_ORDER: 'create:order',
  VIEW_OWN_ORDERS: 'view:own_orders'
};

module.exports = { PERMISSIONS };
