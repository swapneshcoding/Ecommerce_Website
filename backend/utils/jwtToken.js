// creating token and saving in cookie

const sendToken = function(user, res, statusCode){
    const token = user.getJWTToken();

    // options for cookie

    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60*60*1000
        ), // miliseconds
        httpOnly:true,
    }

    res.status(statusCode).cookie("token", token, options).json({
        success:true,
        user,
        token
    })
}

module.exports = sendToken;