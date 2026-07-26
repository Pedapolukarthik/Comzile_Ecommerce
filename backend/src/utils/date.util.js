const formatDateISO = (date = new Date()) => {
  return new Date(date).toISOString();
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

module.exports = {
  formatDateISO,
  addDays,
  isExpired
};
