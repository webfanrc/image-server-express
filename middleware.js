exports.setHeader = function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin","http://localhost:8080");
  res.setHeader("Content-Type","text/html; charset=UTF-8");
  console.log('req.originalUrl: ', req.originalUrl);
  next();
};