
//creating the middleware and Handleing the Production Grade Error Message 

module.exports = (err, req, res, next) => {

    let error = { ...err };

    error.message = err.message;

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
    })
}