const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// DB var for now
const database = {
  users: [
    {
      id: "10",
      name: "Johna",
      email: "johna@gmail.com",
      password: "fortnite",
      entries: 0,
      joined: new Date()
    },
    {
      id: "11",
      name: "Tama",
      email: "tama@gmail.com",
      password: "crazy",
      entries: 0,
      joined: new Date()
    },
    {
      id: "12",
      name: "Rose",
      email: "rose@gmail.com",
      password: "rose",
      entries: 0,
      joined: new Date()
    }
  ]
};

// / get this is working
app.get("/", (req, res) => {
  res.send(database.users);
});

// /signin post = success or fail
app.post("/signin", (req, res) => {
  checkUserPassword(
    req.body.password,
    "$2b$10$OwGL7uACsQwkyg7Up8sA..x.ymMCb3gTxRaYMiJ9aSpDOBPAfKsPO"
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  )
    res.json(database.users[0]);
  else res.status(400).json("error loggin in");
});

// /register post = user obj
app.post("/register", (req, res) => {
  const { id, email, password, name } = req.body;
  storeUserPassword(password, 10);
  database.users.push({
    id: id,
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});

// /profile/:id get = user
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) res.status(400).json("user not found");
});

// /image put = user
app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) res.status(400).json("user not found");
});

const storeUserPassword = (password, salt) => {
  bcrypt.hash(password, salt).then(hash => {
    // Store hash in your password DB.
    console.log(hash);
  });
};

const checkUserPassword = (enteredPassword, storedPasswordHash) => {
  bcrypt.compare(enteredPassword, storedPasswordHash).then(res => {
    // res returns true or false
    console.log(res);
  });
};

//-----APP LISTEN TO PORT 3000-----
app.listen(3000, () => console.log("Server running ok"));
