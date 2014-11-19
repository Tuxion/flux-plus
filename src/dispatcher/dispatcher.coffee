{InvalidArgumentError} = require 'src/errors'
Action = require 'src/actions/action'

module.exports = class Dispatcher extends Flux.Dispatcher
  
  # Override dispatch function to be strict about our internal Action formatting.
  dispatch: (payload) ->
    throw new InvalidArgumentError "Payload must be an instance of Action." unless payload instanceof Action
    payload.validate()
    return super
