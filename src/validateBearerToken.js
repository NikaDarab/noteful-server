// const { API_TOKEN } = require("./config");
function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log(apiToken);
  console.log(authToken);
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    console.log(authToken.split(" ")[1]);
    return res.status(401).json({ error: "Unauthorized request" });
  }
  //   move to the next middleware
  next();
}

module.exports = validateBearerToken;
