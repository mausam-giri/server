const bodyParser = require("body-parser");
const express = require("express");
const crypto = require("crypto");
const multer = require("multer");
const upload = multer({ dest: "./uploads" });

// const mysql = require("mysql");
// const v1Router = require("./routes/v1");

const v2Router = require("./routes/v2");

const app = express();
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// const conn = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "test2",
// });

// conn.connect((err) => {
//   if (err) throw err;
//   console.log("Mysql Connected ....");
// });

app.use("/v2", v2Router);

app.get("/", (req, res) => {
  const token = crypto.randomBytes(16).toString("hex");
  res.status(200).send(["Homepage", token]);
});

// app.use("/v1", v1Router);

app.get("/v1/auth/login", (req, res) => {
  let sql = "SELECT * FROM ";
  return "Hello";
});

app.post("/upload", upload.single("file"), (req, res, next) => {
  console.log(req.body);
  res.send("uploaded");
});

const PORT = 5230;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
