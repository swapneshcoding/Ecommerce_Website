class ErrorHandler extends Error{
    constructor(message, statusCode){
        super();
        this.statusCode = statusCode;
        this.message = message;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;