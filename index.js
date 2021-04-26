const mysql = require("mysql");
const express = require("express");
var app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json);

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "DDgg12@",
  database: "ProductCategoryDB",
  multipleStatements: true,
});

mysqlConnection.connect((err) => {
  if (!err) console.log("DB connection succeded");
  else
    console.log(
      "Db connection failed \n Error : " + JSON.stringify(err, undefined, 2)
    );
});

app.listen(3000, () =>
  console.log("Express server is running at port no: 3000")
);

//Get all product
app.get("/products", (req, res) => {
  mysqlConnection.query("SELECT * FROM Product", (err, rows, fields) => {
    if (!err) res.send(rows);
    // console.log(rows[0].ProductID);
    else console.log(err);
  });
});

//Get an product
app.get("/products/:id", (req, res) => {
  mysqlConnection.query(
    "SELECT * FROM ProductCategory WHERE ProductID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      // console.log(rows[0].ProductID);
      else console.log(err);
    }
  );
});

//Delete an product
app.delete("/products/:id", (req, res) => {
  mysqlConnection.query(
    "DELETE FROM ProductCategory WHERE ProductID = ?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Deleted successfully!");
      else console.log(err);
    }
  );
});

//Insert an product
app.post("/products", (req, res) => {
  let product = req.body;
  var sql =
    "SET @ProductID = ?;SET @Name = ?;SET @Price = ?;SET @Quantity = ?; \
   CALL ProductAddOrEdit(@ProductID,@Name,@Price,@Quantity);";
  mysqlConnection.query(
    sql,
    [product.ProductID, product.Name, product.Price, product.Quantity],
    [req.params.id],
    (err, rows, fields) => {
      if (!err)
        rows.forEach((element) => {
          if (element.constructor == Array)
            res.send("Inserted product id :" + element[0].ProductID);
        });
      else console.log(err);
    }
  );
});

//Update an product
app.put("/products", (req, res) => {
  let product = req.body;
  var sql =
    "SET @ProductID = ?;SET @Name = ?; \
   CALL ProductAddOrEdit(@ProductID,@Name);";
  mysqlConnection.query(
    sql,
    [product.ProductID, product.Name],
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Updated successfully");
      else console.log(err);
    }
  );
});
