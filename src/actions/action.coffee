{ActionSource, EntityOperation} = require './constants'
{ValidationError} = require 'src/errors'

module.exports = class Action
  
  name: null
  source: null
  active: null
  entities: null
  payload: null
  
  constructor: ->
    @active = {}
    @entities = {}
    @payload = {}
  
  ###*
   * Perform a validation of all properties, to make sure it complies with our expected format.
   * @return {void}
  ###
  validate: ->
    
    # Check that the action is defined.
    throw new ValidationError "Action name is not defined." unless @name
    
    # Check that the source is a valid ActionSource.
    throw new ValidationError "Source '#{@source}' is not a valid ActionSource." unless ActionSource[@source]
    
    # Check all the payload parts.
    for key, data of @payload
      
      # It should be defined in the entities.
      throw new ValidationError "Payload with key '#{key}' is not defined in the entities." unless @entities[key]
      
      # The definition in entities should be a valid EntityOperation.
      unless EntityOperation[@entities[key]]
        throw new ValidationError "Entity '#{key}' has an invalid EntityOperation '#{@entities[key]}'."
      
      # Each part of the payload should be an array.
      throw new ValidationError "Payload with key '#{key}' is not an Array." unless Array.isArray data
