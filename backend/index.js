const express = require("express");
const { getUserFromToken } = require("../middlewares/auth");// get authentication middleware
const { default: mongoose } = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });// get .env file

// get routers 
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const reviewRoutes = require("./routes/reviewRoutes");


const app = express();
const PORT = 5000;

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



// db connection 
// username = mohammadrstm2004_db_user
// pass = biriGAHbjm2J6qOP
