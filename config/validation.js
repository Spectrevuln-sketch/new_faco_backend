const { check, validationResult } = require('express-validator');
const User = require('../models/userModel');

exports.validate = (method) => {
  switch (method) {
    /* Validate user Register Page */
    case 'user_login': {
      return [
        check('no_tlp')
          .notEmpty().withMessage('No Telepon Harus Di isi !')
          .isLength({ min: 3 }).withMessage('Minimal 3 Karakter !')
          .custom(user => {
            return User.findOne({ where: { no_tlp: user } }).then(result => {
              if (result) {
                return Promise.reject('Username Already In Use');
              }
            })
          }),
        check('password1')
          .isLength({ min: 5 }).not().withMessage('Password Minimal 5 Karakter !')
          .notEmpty().withMessage('Password tidak boleh kosong !'),
        check('password2')
          .isLength({ min: 5 }).not().withMessage('Password Minimal 5 Karakter !')
          .notEmpty().withMessage('Konfrimasi Password Tidak Boleh Kosong !')
          .custom(((password2, { req }) => {
            if (password2 !== req.body.password1) {
              throw new Error('Password Tidak Sama!')
            }
            return true;
          }))
      ]
    }
  }
  switch (method) {
    /* Validate user Register Page */
    case 'user_register': {
      return [
        check('no_tlp')
          .notEmpty().withMessage('No Telepon Harus Di isi !')
          .isLength({ min: 3 }).withMessage('Minimal 3 Karakter !')
          .custom(user => {
            return User.findOne({ where: { no_tlp: user } }).then(result => {
              if (result) {
                return Promise.reject('Username Already In Use');
              }
            })
          }),
        // check('kode_akun')
        //   .notEmpty().withMessage('Kode Akun Harus Di Isi !')
        //   .isLength({ min: 3 }).withMessage('Minimal 3 Karakter !')
        //   .custom(() => {
        //     return User.findOne({ where: { kode_akun: kode_akun } }).then(result => {
        //       if (result) {
        //         return Promise.reject('Kode Undangan Tidak Ada');
        //       }
        //     })
        //   })
        // ,
        check('password1')
          .isLength({ min: 5 }).not().withMessage('Password Minimal 5 Karakter !')
          .notEmpty().withMessage('Password tidak boleh kosong !'),
        check('password2')
          .isLength({ min: 5 }).not().withMessage('Password Minimal 5 Karakter !')
          .notEmpty().withMessage('Konfrimasi Password Tidak Boleh Kosong !')
          .custom(((password2, { req }) => {
            if (password2 !== req.body.password1) {
              throw new Error('Password Tidak Sama!')
            }
            return true;
          }))
      ]
    }

  }
  switch (method) {
    /* Validate user Register Page */
    case 'edit_password': {
      return [
        check('sandi_baru')
          .isLength({ min: 5 }).not().withMessage('Password Minimal 5 Karakter !')
          .notEmpty().withMessage('Password tidak boleh kosong !'),
        check('konfrim_sandi')
          .isLength({ min: 5 }).not().withMessage('Password Minimal 5 Karakter !')
          .notEmpty().withMessage('Konfrimasi Password Tidak Boleh Kosong !')
          .custom(((password2, { req }) => {
            if (password2 !== req.body.password1) {
              throw new Error('Password Tidak Sama!')
            }
            return true;
          }))
      ]
    }
  }

}