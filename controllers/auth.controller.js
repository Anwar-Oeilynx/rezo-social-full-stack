const UserModel = require('../models/user.model');
 const jwt = require('jsonwebtoken');
 const createToken = (id) => {
  //validite du token 3 jours
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge }); 
  }
const maxAge = 3 * 24 * 60 * 60; // 3 jours
 const bcrypt = require('bcrypt');
 const { signUpErrors, signInErrors } = require('../utils/errors.utils');

module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body
  
    try {
      const user = await UserModel.create({pseudo, email, password });
      res.status(201).json({ user: user._id});
    }
    catch(err) {
      const errors = signUpErrors(err);
      res.status(200).send({ errors })
    }
  }

  module.exports.signIn = async (req, res) => {   
    const {email, password} = req.body
  
    try {
      const user = await UserModel.login(email, password);
      const token = createToken(user.id)
      res.cookie('jwt', token, { httpOnly: true, maxAge });
      res.status(200).json({ user: user._id});
    }
    catch(err) {
      const errors = signInErrors(err);
      res.status(200).send({ errors })
    }
  }

  module.exports.logout = (req, res) => {
    res.clearCookie('jwt', { path: '/' });
    res.status(200).json({ message: 'Vous êtes déconnecté' });
  }