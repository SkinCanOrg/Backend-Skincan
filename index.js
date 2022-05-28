const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const db_Config = require('./config/Database');

const auth = require('./middlewares/auth.js');
const errors = require("./middlewares/errors.js");

const unless = require('express-unless');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(db_Config.db, {
    useUnifiedTopology: true,
    useNewUrlParser: true, // Set useNewUrlParser TRUE
})
.then( 
    ()=> { console.log("Database Connected"); },
    (error) => { 
        console.log("Failed to connect: " + error); 
    }
    );

//middle ware for authenticating token submitted with requests
/**
 * Kondisional , skip middleware when a condition met
 */

auth.authenticateToken.unless=unless;
app.use(
    auth.authenticateToken.unless({
        path: [
            { url: "/users/register", methods: ["POST"] },
            { url: "/users/login", methods: ["POST"] },
            { url: "/users/otpLogin", methods: ["POST"] },
            { url: "/users/verifylogin", methods: ["POST"] },
        ],
    })
);

app.use(json())

// Inisiasi routes
app.use("/users", require("./routes/routes"));

// For Error responses
app.use(error.errorHandler);

app.use(express.urlencoded({ extended: true}))

let port = process.env.PORT;
let host = process.env.HOST;

// Listen for Request
app.listen(port , host , () => {
    console.log("Server is running on "+ host,": " + port)
})