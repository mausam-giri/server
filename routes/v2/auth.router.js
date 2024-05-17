const router = require("express").Router();
const { dbpool, getConnectionPool } = require("../../database");

const crypto = require("crypto");
// router.get("/login", getConnectionPool, (req, res) => {
//   req.dbConn.query("Select * From users", (err, rows) => {
//     if (err) res.send(err);

//     console.log(err);
//     res.send(rows);
//     req.dbConn.release();
//   });
// });

function executeQuery(
  req,
  res,
  queryString,
  params,
  successCallback,
  errorCallback
) {
  req.dbConn.query(queryString, params, (err, rows) => {
    if (err) {
      if (errorCallback) return errorCallback(err);
      console.error(err);
      return res.send(err).status(500);
    }

    return successCallback(rows);
  });
}

router.post("/login", getConnectionPool, (req, res) => {
  const { username, passwd } = req.body;
  if (!username || !passwd) return res.send("Username/pass required");
  try {
    executeQuery(
      req,
      res,
      "Select * from users WHERE user=? AND passwd=?",
      [username, passwd],
      (rows) => {
        executeQuery(
          req,
          res,
          "SELECT * FROM tokens WHERE userid=?",
          [rows[0].id],
          (tData) => {
            if (tData.length > 0) {
              console.log("token already exists for the user ${}");
              return res.send(JSON.stringify(tData[0]));
            } else {
              const token = crypto.randomBytes(16).toString("hex");
              req.dbConn.query(
                "INSERT INTO tokens(userId, token) VALUES(?, ?)",
                [rows[0]["id"], token],
                (err, insertResult) => {
                  if (err) return res.send("Error", res);
                  console.log(insertResult);
                  return res.send(token);
                }
              );
            }
          }
        );
      }
    );
  } catch (error) {
  } finally {
    req.dbConn.release();
  }
});

module.exports = router;
