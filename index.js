const express = require("express");
const handleDbConnection = require("./connection");
const authRouter = require("./routes/auth");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.BASE_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

const databaseURL = process.env.DATABASE;
handleDbConnection(databaseURL);

app.get("/", (req, res) => {
  return res.send("Welcome to my habit tracking app!");
});
app.use("/auth", authRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
