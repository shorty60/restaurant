class NoRestaurantError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NoRestaurantError'
  }
}

module.exports = {
  NoRestaurantError,
}
