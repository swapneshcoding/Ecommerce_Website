const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Your Name"],
        maxLength:[30, "Name cannot exceed 30 characters"],
        minLength:[4, "Name should have atleast 4 characters"],
    },
    email:{
        type:String,
        required:[true, "Please Enter Email Address"],
        unique:true,
        validate:[validator.isEmail, "Please Enter a Valid Email"]
    },
    password:{
        type:String,
        required:[true, "Please Enter Your Password"],
        minLength:[8, "Password should be greater than 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

});

userSchema.pre('save', async function(next){
    
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})

// JWT Token

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_EXPIRE})
}

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generating reset password Token

userSchema.methods.getResetPasswordToken = function(){
    // generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15*60*1000; // 15 min

    return resetToken;
};


module.exports = mongoose.model("User", userSchema);