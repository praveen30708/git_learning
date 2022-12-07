//Middle Ware for the Promise

module.exports = (func) => (req, res, next) =>
    Promise.resolve(func(req, res, next)).catch(next)