/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  // Add code here to verify users are logged in
  const token = req.headers.authorization;

  if(token) {
    const secret = process.env.JWT_SECRET || "shhh";

    jwt.verify(token, secret, (error, decodedToken) => {
      if(error) {
        // The token is invalid
        res.status(401).json({ you: 'shall not pass! 401' });
      } else {
        // The token is good
        req.jwt = decodedToken;
        
        next();
      }
    })
  } else {
    res.status(400).json({ message: "You cannot pass! 401" });
  }
};
