function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({ error: { message: err.message || 'Server error' } });
}
function notFound(req, res) {
  res.status(404).json({ error: { message: `Not found: ${req.method} ${req.path}` } });
}
module.exports = { errorHandler, notFound };
