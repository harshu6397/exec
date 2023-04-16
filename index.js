// Compiler using Express and Node.js

// Importing the required modules
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 4000;

// Setting up the middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Setting up the routes
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/execute_c_program", function (req, res) {
  const code = req.body.code;

  // Creating the file
  fs.writeFile("code.c", code, function (err) {
    if (err) {
      console.log(err);
    }
  });

  const compile_c = async () => {
    return new Promise((resolve, reject) => {
      exec("gcc -o code code.c", async function (error, stdout, stderr) {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  };

  const run_c = async () => {
    return new Promise((resolve, reject) => {
      exec("./code", async function (error, stdout, stderr) {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  };

  const main_c = async () => {
    await compile_c();
    const result = await run_c();
    fs.unlinkSync("code.c");
    fs.unlinkSync("code");
    res.send(result);
  };

  main_c();
});

app.post("/execute_java_program", function (req, res) {
  const code = req.body.code;

  // Creating the file
  fs.writeFile("code.java", code, function (err) {
    if (err) {
      console.log(err);
    }
  });

  const compile_java = async () => {
    return new Promise((resolve, reject) => {
      exec("javac code.java", async function (error, stdout, stderr) {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  };

  const run_java = async () => {
    return new Promise((resolve, reject) => {
      exec("java code", async function (error, stdout, stderr) {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  };

  const main_java = async () => {
    await compile_java();
    const result = await run_java();
    fs.unlinkSync("code.java");
    fs.unlinkSync("code.class");
    res.send(result);
  };

  main_java();
});

// Setting up the port
const port = process.env.PORT || 4000;

// Creating the server
app.listen(port, function () {
  console.log("Listening on port " + PORT);
});

// Url = http://localhost:4000/execute_c_program
