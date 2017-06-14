const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
  console.log('getting here');
  res.render('login', { title: 'Login' });
};

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.checkBody('password', 'Password cannot be blank!').notEmpty();
  req.checkBody('confirm_password', 'Confirmed password cannot be blank!').notEmpty();
  req.checkBody('confirm_password', 'Oops! your passwords do not match!').equals(req.body.password);

  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    console.log(req.body);

    return res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    });
  }

  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);

  await register(user, req.body.password);
  next();
};