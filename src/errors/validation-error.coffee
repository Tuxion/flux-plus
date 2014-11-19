module.exports = class ValidationError extends Error
  
  constructor: (@message) ->
    @name = "ValidationError"
    super
