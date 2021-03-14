const { key, verify } = require("./jwt");

/*
Use this as middleware only for authenticated routes.
req.user will contain the user details
*/

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const user = verify(token, key);
      console.log("The user is", user);
      req.user = user;
      next();
    } catch (e) {
      console.log(e.message);
      return res.status(403).json({
        error: "Invalid API Key.",
      });
    }
  } else {
    res.status(401).json({
      error: "API Key is missing.",
    });
  }
};

module.exports = authenticate;
