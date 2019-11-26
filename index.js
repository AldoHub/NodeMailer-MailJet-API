const express = require("express");
//const path = require("path");
const routes = require("./routes/index");
const cors = require("cors");
const app = express();

app.use(cors());
//app.use(express.json());
app.use("/api", routes);

app.listen(4000, () => {
    console.log("Server on port 4000");
});
