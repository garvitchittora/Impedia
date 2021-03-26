let mongoURL;

if (process.env.NODE_ENV === "production")
  mongoURL =
    "mongodb+srv://admin:admin@cluster0.vv3tn.mongodb.net/impedia?retryWrites=true&w=majority";
else if (process.env.NODE_ENV === "development")
  mongoURL =
    "mongodb+srv://admin:admin@cluster0.vv3tn.mongodb.net/impedia?retryWrites=true&w=majority";
else if (process.env.NODE_ENV)
  mongoURL = "mongodb://localhost:27017/impedia-test";

const key = "8RTDWTAYJd1IPgwx8MhoN9jKYyq1inNy";

module.exports = {
  mongoURL,
  key,
};
