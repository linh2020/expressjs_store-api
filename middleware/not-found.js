const notFoundMiddleware = (req, res, next) =>
  res.status(404).json({ msg: "Routes does not exist." });

module.exports = notFoundMiddleware;
