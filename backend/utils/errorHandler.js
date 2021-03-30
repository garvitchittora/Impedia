const errorHandler = (error, req, res, next) => {
  // console.error("It reaches here");
  if (error.name === "CastError") {
    return res.status(404).end();
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "MongoError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ error: "Invalid token" });
  }
  console.log("SOME WEIRD ERROR", error.message);
  next(error);
};
module.exports = errorHandler;
