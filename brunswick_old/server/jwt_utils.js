const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const JWT_SIGN_SECRET = process.env.SECRET;

function generateTokenForUser(userData, expiresIn = null) {
  return jwt.sign(
    {
      userId: userData.id,
      userType: userData.type
    },
    JWT_SIGN_SECRET,
    expiresIn ? { expiresIn } : {}
  );
}

function parseAuthorization(authorization) {
  return authorization ? authorization.replace("Bearer ", "") : null;
}

function getUserType(authorization) {
  let userType = "";
  const token = module.exports.parseAuthorization(authorization);

  if (token !== null) {
    try {
      const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
      if (jwtToken !== null) {
        ({ userType } = jwtToken);
      }
    } catch (err) {}
  }

  return userType;
}

function getUserId(authorization) {
  let userId = -1;
  const token = module.exports.parseAuthorization(authorization);
  if (token !== null) {
    try {
      const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
      if (jwtToken !== null) {
        ({ userId } = jwtToken);
      }
    } catch (err) {}
  }
  return userId;
}

module.exports = {
  generateTokenForUser,
  parseAuthorization,
  getUserType,
  getUserId
};
