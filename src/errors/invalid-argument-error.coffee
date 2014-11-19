module.exports = class InvalidArgumentError extends Error
  
  constructor: (@message) ->
    @name = "InvalidArgumentError"
    super
