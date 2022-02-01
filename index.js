const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  bodyParser = require("body-parser");

const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/node_bcrypt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  joined: { type: Date, default: Date.now },
});

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.send("Welcome to authentication tutorial");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
    const insertResult = await User.create({
      username: req.body.username,
      password: hashedPwd,
    });
    res.send(insertResult);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (user) {
      const cmp = await bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        //   ..... further code to maintain authentication like jwt or sessions
        res.send("Auth Successful");
      } else {
        res.send("Wrong username or password.");
      }
    } else {
      res.send("Wrong username or password.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

app.listen(3001, () => {
  console.log("Server started at port 3001");
});