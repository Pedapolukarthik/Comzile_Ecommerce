import React from 'react';
import SellerManagement from './SellerManagement';

export const ApprovedSellers = () => {
  return <SellerManagement filterStatus="ACTIVE" />;
};

export default ApprovedSellers;
