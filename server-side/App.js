const express = require("express");
const app = express();

const path = require("path");
const multerMiddleware = require("./middleware/multer").multerMiddleware;

const authMiddleware = require("./middleware/auth").authMiddleware;

const mongoose = require("mongoose");

//graphql
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema").graphqlSchema;
const graphqlResolver = require("./graphql/resolver").graphqlResolver;



//please insert to make app work
const MONGOOSE_URI = "";
//looklike database must be not captial wht first letter

const imageController = require("./controllers/download");

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));//we use this to parse request also we duel with file so this is mandatory
app.use("/images", express.static(path.join(__dirname, "/images"))); //serve  files in folder images as static when request involes it also using join method of path to hanlde Window and Linux
app.use(multerMiddleware);//use to save image in server also check valid image


//handle CORS when sharing resource between 2 different localhosts
app.use((req, res, next) => {
 res.setHeader("Access-Control-Allow-Origin", "*");
 // res.setHeader("Access-Control-Allow-Credentials", "true");
 // res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
 //we use graphql and rest so
 res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
 // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization,Access-Control-Allow-Credentials, Access-Control-Allow-Origin, Access-Control-Allow-Methods, X-Requested-With, Origin,Accept, Content-Length");
 res.setHeader("Access-Control-Allow-Headers", "*");
 if (req.method === "OPTIONS") { //cuz we will use graphql and graphql just recognizes POST method but OPTION is sent for each request to check request is safe so this way is required
  return res.sendStatus(200);
 }
 next();
})

app.use(authMiddleware);

app.post("/post-image", (req, res, next) => {
 if (!req.isAuth) {
  const error = new Error("Authorized");
  error.statusCode = 403;
  throw error;
 }

 if (!req.file) {
  return res.status(200).json({ message: "No image" });
 }
 return res.status(201).json({ message: "Saved successfully in server", filePath: req.file.path });
});

app.put("/save-download-count-of-img", imageController.increaseDownloadCount);

app.use("/graphql", graphqlHTTP(
 {
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  formatError(err) {
   if (!err.originalError) {
    return err;
   }
   const message = err.message || "Something went wrong!";
   const data = err.originalError.data;
   const statusCode = err.originalError.statusCode || 500;
   return { message, statusCode, data };
  }
 }
));

app.use((err, req, res, next) => {
 console.log(err);
 const statusCode = err.statusCode || 500;
 const message = err.message;
 const data = err.data;
 res.status(statusCode).json(
  {
   message, data
  }
 )
});

mongoose.connect(
 MONGOOSE_URI
)
 .then(
  () => {
   // app.listen(8080);
   const server = app.listen(8080);
   const io = require("./socket").socketServer.init(server);
   io.on("connection", client => {
    console.log("Client connected");
   });
  }
 )
 .catch(
  err => {
   console.log(err);
  }
 );