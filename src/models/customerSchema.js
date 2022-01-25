const crypto =require('crypto');
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
    
    ratingAvg:{
        type: Number,
        default: 4.4,
        min: [1, 'Rating must be above 1'],
        max: [5, "Rating must be below 5"],
        set: val => Math.round(val * 10) / 10
    },
    ratingQuantity:{
        type : Number,
        default: 0
    },
    password:{
        type: String,
        require: [true, "Plese enter a password"],
        minlength: 8,
        select: false
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
    },
    role:{
        type: String,
        select: true,
        enum: ["user", "admin"]
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum : ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
        
    },
    // "coordinates": [28.656464, 77.242696], // red dort 
    // "coordinates": [28.406655, 77.289626], // sgm
    location: [
        {
            type: {
                type: String,
                default: 'Point',
                enum : ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],


    passwordResetToken: String,
    passwordResetExpires: Date,

    passwordChangedAt: Date
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// FOr the goeModel first add an index of that field
// 2dsphere is used in index when we deal with real data of earth
// customerSchema.index({startLocation : '2dsphere'});

customerSchema.virtual('reviews',{
    ref: "Review",
    foreignField: "customerDetail",
    localField: "_id"
})

customerSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next()
})

// hash is async function
customerSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password =await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

// this is an instance function to compare the password of the user and DB password
customerSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}

customerSchema.methods.createPasswordResetToken= function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken)
    this.passwordResetExpires = Date.now() + 10*60*1000;

    return resetToken;
}


const Customer = new mongoose.model("Customers", customerSchema);

module.exports = Customer;