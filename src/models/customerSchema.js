const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "customer must have a name"]
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        require: [true, "Please provide your email"],
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    photo: String,
    password:{
        type: String,
        require: [true, "Plese enter a password"],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        require: [true, "Plese enter your password"],
        validate: {
            validator: function(el){
                return el === this.password
            }
        },
        message: "Password are not same"
    }
});
// hash is async function
customerSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password =await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
})


const Customer = new mongoose.model("Customers", customerSchema);

module.exports = Customer;