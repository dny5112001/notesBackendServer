const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const Authrouter = require("./Routes/auth");
const notesRouter = require("./Routes/notesapi");
const cookieParser = require("cookie-parser");

// add middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(morgan("common"));
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// env variable configuration
dotenv.config();

// database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

// Call the function to connect to the database
connectDB();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes middleware
app.use("/api/auth/", Authrouter);
app.use("/api/notes/", notesRouter);

// listen
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
