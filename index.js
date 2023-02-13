const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const bearerToken = require("express-bearer-token");

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(bearerToken());
app.use(express.static("src/public"));

app.get("/", (req, res) => {
  res.status(200).send("<h1>Socmed App API</h1>");
});

const { db } = require("./src/config/index");
db.connect((err) => {
  if (err) {
    console.log(`error: ${err.message}`);
  }
  console.log("Connected to MySql server");
});

const { usersRouter, contentRouter } = require("./src/routers");
app.use("/users", usersRouter);
app.use("/content", contentRouter);

app.listen(PORT, () => {
  console.log(`Socmed API running on port ${PORT}`);
});

// app.get("/users", (req, res) => {
//   let scriptQuery = `Select * from users;`;
//   if (req.query.username) {
//     scriptQuery = `Select * from users where username: ${db.escape(req.query.username)};`;
//   }
//   db.query(scriptQuery, (err, result) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(result);
//     }
//   });
// });

// app.post("/users",(req,res)=>{
//   console.log("data dari req.body: ", req.body)
//   let {username, email, password} = req.body
//   let insertQuery = `Insert into users values (null, ${db.escape(username)}, ${db.escape(email)}, ${db.escape(password)}, null, null, null, null)`
//   db.query(insertQuery, (err,result) => {
//     if(err) {
//       res.status(500).send(err);
//     }
//     db.query(`Select * from users where username = ${username}`, (err2, result2) => {
//       if(err2){
//         res.status(500).send(err2)
//       } else {
//         res.status(200).send({message: 'User added', data: result2})
//       }
//     })
//     // } else {
//     //   res.status(200).send(result);
//     // }
//   })
// })
