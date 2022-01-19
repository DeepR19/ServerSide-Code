class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status  = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // it is used to prevent this constructor to show in err stack
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;