import React from 'react';
import SellerManagement from './SellerManagement';

export const PendingSellers = () => {
  return <SellerManagement filterStatus="PENDING" />;
};

export default PendingSellers;
