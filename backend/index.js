const express = require("express");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const cors = require("cors");

// get routers 
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/reviewRoutes");


const app = express();
const PORT = 5000;
// allow request from different ports 
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true, 
}));
app.use(express.json());// parse json middlware 

// connect to mongo db
const mongoUri = process.env.MONGO_URI
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// connect routers
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



