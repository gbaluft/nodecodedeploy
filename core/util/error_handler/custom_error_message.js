class AppError extends Error {
    constructor(message, statusCode,fields) {
        super(message);
        this.statusCode = statusCode;
        //  this.status = statusCode >= 400 && statusCode < 500 ? 'fail':'error';
        this.status = (`${statusCode}`.startsWith('4') || `${statusCode}`.startsWith('5')) ? 'fail' : 'error';
        this.isOperational = true;
        this.fields = fields;
        Error.captureStackTrace(this,this.constructor)    //where the error actual occurs
    }
}

export default AppError;