module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) return next();
    req.send({ message: 'Please log in to view that resource' });
    res.redirect('/login');
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.redirect('/manageuser');
  }
};