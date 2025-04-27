require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const initAiModel = require('./src/utils/initModel')

const app = express();

const allowedOrigins = [
  `http://localhost:${process.env.APP_PORT}`,
  `http://127.0.0.1:${process.env.APP_PORT}`,
  `http://192.168.1.118:${process.env.APP_PORT}`,
  `http://192.168.1.18:${process.env.APP_PORT}`,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(express.json());


app.use(require("./src/routes/index"));

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB);
    console.log("✅ Connected to DB");
  } catch (error) {
    console.error("❌ Error connecting to DB", error);
    process.exit(1); 
  }
}
connectToDatabase();
initAiModel()


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Rex running: http://localhost:${PORT}`));
