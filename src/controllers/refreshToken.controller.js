const refreshToken = require('../services/refreshToken.services');
const icon = require('../services/icon.service');
const createError = require('http-errors');

class RefreshTokenController {
  static refreshToken = async (req, res, next) => {
    try {
      const refreshedUser = await refreshToken.refresh(req.cookies);
      const avatar = await icon.fetchIcon(refreshedUser.userId);
      res.status(200).json({
        status: 200,
        data: {
          message: "User refreshed",
          user: {
            ...refreshedUser,
            icon: avatar || 'No Icon'
          }
        }
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = RefreshTokenController;