const mysql = require("mysql");

const dbpool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

const getConnectionPool = (req, res, next) => {
  dbpool.getConnection((err, conn) => {
    if (err) return res.send(err).status(500);
    req.dbConn = conn;
    next();
  });
};

module.exports = { dbpool, getConnectionPool };
