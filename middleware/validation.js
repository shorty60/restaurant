const { body } = require('express-validator')

module.exports = {
  validators: [
    body('name').not().isEmpty().trim().withMessage('請輸入餐廳名字'),
    body('category').not().isEmpty().trim().withMessage('請輸入餐廳類型'),
    body('location').not().isEmpty().trim().withMessage('請輸入餐廳地址'),
    body('google_map')
      .not()
      .isEmpty()
      .trim()
      .withMessage('請輸入google地圖網址')
      .isURL()
      .withMessage('請輸入URL'),
    body('phone').not().isEmpty().trim().withMessage('請輸入店家連絡電話'),
    body('rating').not().isEmpty().trim().withMessage('請輸入店家評分'),
    body('image').isURL().trim().withMessage('請輸入圖片連結'),
    body('description')
      .trim()
      .isLength({ min: 0, max: 300 })
      .withMessage('請輸入300字以內的敘述'),
  ],
  userValidator: [
    body('email').isEmail().trim().withMessage('請輸入email'),
    body('password').not().isEmpty().trim().withMessage('請填寫密碼'),
    body('confirmPassword').not().isEmpty().trim().withMessage('請確認密碼'),
  ],
}
