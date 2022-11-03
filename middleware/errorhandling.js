const { NoRestaurantError } = require('../utilities/errortype') // Include errortype class define
module.exports = (err, req, res, next) => {
  // 找不到餐廳的錯誤處理->顯示首頁以及flash-message
  if (err instanceof NoRestaurantError) {
    const notFoundRestaurant = err.message
    return res.render('index', { notFoundRestaurant })
  }
  const serverError =
    'Sorry, we encounter some problem... please try again later'
  console.log(err)
  res.status(500).render('error', { serverError })
}
