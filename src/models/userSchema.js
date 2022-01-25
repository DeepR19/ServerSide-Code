const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, "user must have a firstname"],
        trim: true
    },
    lastName:{
        type: String,
        trim: true
    },
    age: {
        type: Number,
        min: 10,
        max: 60
    },
    age1: {
        type: Number
    },
    year: {
        type: Date
    },
    email:{
        type: String,
        required: [true, "user have an email"],
        unique: true
    },
    phone:{
        type: Number
    },
    summary:{
        type: String,
        trim: true
    },

    // Creating geolocation
    startLocation: {
        // GeoJSON
        type :{
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number], // array of number for lattitude and longitude
        address: String,
        descriprion: String
    },
    locations: [
        {
            type :{
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number], // array of number for lattitude and longitude
            address: String,
            descriprion: String,
            day: Number
        }
    ],
    

    guides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers' // define collection name of DB
        }
    ],


    date: {
        type: Date,
        default: Date.now,
        select: false
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});


//  --> those field query alot mark as index
//  -- it is very useful to find data very fast
// --> define indexes in the scheme <--
// userSchema.index({ })


// adding virtuals (optional attribute) in query output
userSchema.virtual("FullName").get(function(){
    return this.firstName + this.lastName
});

userSchema.pre(/^find/, function(next){
    this.populate('guides')
    console.log("find")
    next();
})

// -- get data from diff schema -- Embedded system --
// userSchema.pre('save', async function(next){
//     -- it will return array of promises --
//     const guidePromise = this.guides.map(async id => await Customer.findById(id));
    
//     -- it will save data of promises in this guides --
//     this.guides = await Promise.all(guidePromise);
// })

const user = new mongoose.model("Users", userSchema);

module.exports = user;