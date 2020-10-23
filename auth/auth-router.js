const bcryptjs = require("bcryptjs");
const router = require('express').Router();
const Users = require("./auth-model");
const jwt = require("jsonwebtoken");
const restricted = require("./authenticate-middleware");

router.get("/", restricted, (req, res) => {

  Users.getAll()
  .then(response => {
    res.status(200).json(response)
  })
  .catch(error => {
    res.status(500).json(error);
  })
})

router.post('/register', (req, res) => {
  const user = req.body;
  console.log("this is req.body ",req.body);
  const rounds = process.env.BCRYPT_ROUNDS || 4;

  const hash = bcryptjs.hashSync(user.password, rounds)
  user.password = hash;

  Users.register(user)
  .then(response => {
    res.status(201).json(response)
  })
  .catch(error => {
    res.status(500).json({ message: error });
  })
});

router.post('/login', (req, res) => {
  // implement login
  const {username, password} = req.body;

    Users.findByUser({username: username})
    .then(([response]) => {
      // console.log(response);

      // compare the password the hash stored in the databse
      if(response && bcryptjs.compareSync(password, response.password)) {
        const token = createToken(response);

        res.status(200).json({ message: "Welcome to our API", token });
      }  else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
});

function createToken(user) {
  const payload = {
    sub: user.id,
    username: user.username,
    password: user.password,
  };

  const secret = process.env.JWT_SECRET || "shhh";

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
