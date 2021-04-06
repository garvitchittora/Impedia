const errorFormatter = (str) => {
  let temp = {};
  str
    .substr(str.indexOf(":") + 1)
    .trim()
    .split(",")
    .forEach((e) => {
      const [key, val] = e.split(":");
      temp[key.trim()] = val.trim();
    });
  return temp;
};
const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(404).end();
  } else if (error.name === "ValidationError") {
    const message = errorFormatter(error.message);
    return res.status(400).json({ error: message });
  } else if (error.name === "MongoError") {
    const message = errorFormatter(error.message);
    return res.status(400).json({ error: message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(400).json({ error: "Invalid token" });
  }
  console.log("SOME WEIRD ERROR", error);
  next(error);
};
module.exports = errorHandler;
