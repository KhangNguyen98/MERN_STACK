const jwt = require("jsonwebtoken");


//yeah body guard of my web(after login and takes action which require author ALWAYS depends on it)
exports.authMiddleware = (req, res, next) => {
 if (!req.get("Authorization")) {
  req.isAuth = false;
  return next();
 }
 const token = req.get("Authorization").split(" ")[1];
 if (!token) {
  req.isAuth = false;
  return next(); //even i get DRY but this way will help to concise also i want to store token to verify
 }
 let decodedToken;
 try {
  decodedToken = jwt.verify(token, "secretkey") //argument is when we use jwt.sign method
 } catch (error) {
  req.isAuth = false;
  return next(error);
 }
 req.isAuth = true;
 req.userID = decodedToken.userID;
 next();//pass to other middlewares
}