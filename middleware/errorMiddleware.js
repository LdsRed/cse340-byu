module.exports = (err, req, res, next) => {
    //This will allow us to debug the error
    console.log(err.stack);

    const statusCode = err.status || 500;

    // Now render the view
    if(statusCode == 500) {
        res.status(500).render("errors/internalServerError", {
            errorTitle: "500 - Intentional Internal Error Server",
            internalErrorMessage: "Something wen wrong in the server. Please, try again later",
        });
    } else {
        next(err);
    }
    
};
