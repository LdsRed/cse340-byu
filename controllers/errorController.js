exports.triggerError = (req, res, next) => {

    // Simulate a 500 Error Server
    const error = new Error("This is a simulated 500 server error for Task N°3");
    error.status = 500;
    next(error);
}