const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express backend 🚀");
});




const mongoUri = process.env.MONGO_URI
try{
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDb');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}catch(err){
  console.log('Failed to connect to mongodb',err);
}



// db connection 
// username = mohammadrstm2004_db_user
// pass = biriGAHbjm2J6qOP
