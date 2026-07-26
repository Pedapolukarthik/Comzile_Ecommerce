import React from 'react';
import SellerManagement from './SellerManagement';

export const RejectedSellers = () => {
  return <SellerManagement filterStatus="REJECTED" />;
};

export default RejectedSellers;
