const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = require("./routes/task");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/task", Routes);

const PORT = 9000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))