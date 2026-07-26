const storeService = require('./store.service');
const sendResponse = require('../../utils/apiResponse');
const { STATUS_CODES } = require('../../constants/statusCodes');

class StoreController {
  getStoreDetails = async (req, res) => {
    const { id } = req.params;
    const store = await storeService.getStoreById(id);
    return sendResponse(res, STATUS_CODES.OK, true, 'Store context retrieved successfully', { store });
  };
}

module.exports = new StoreController();
