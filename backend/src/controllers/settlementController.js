const settlementService = require("../services/settlementService");

const getGroupSettlement = async (req, res) => {
  try {
    const settlement = await settlementService.getGroupSettlement(
      req.params.groupId,
    );

    res.status(200).json({
      status: "success",
      data: settlement,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getGroupSettlement,
};
