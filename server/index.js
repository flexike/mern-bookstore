const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

// Server Starting
app.listen(port, () => {
  console.log(`SERVER STARTED on port: ${port}`);
});
