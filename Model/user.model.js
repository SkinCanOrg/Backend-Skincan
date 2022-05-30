const mongoose = require("mongoose");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

// this for removing _id,_v and password hash which we dont need to send back to the client
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;
        // delete , dont reveal passwordHash
        delete returnedObject.password;
    },
});

// The userSchema.plugin(uniqueValidator) method won’t let duplicate email id to be stored in the database.
userSchema.plugin(uniqueValidator, {message: "Email already in use." });

const User = mongoose.model("user", userSchema);
module.exports = User;