{ActionSource, EntityOperation} = require 'src/actions/constants'
{InvalidArgumentError} = require 'src/errors'
Dispatcher = require 'src/dispatcher/dispatcher'

elements = {}
refs =
  active: null

module.exports = class BaseStore extends EventEmitter
  
  # The element name should be provided in your implementation of the store.
  elementName: null
  
  # Default way of fetching the ID.
  extractId: (element) ->
    return element.id
  
  # Default way of finding the active element.
  extractActive: (action) ->
    active = action.active?[@elementName]
    return if active == undefined then false else active
  
  # Creates a new store.
  constructor: (dispatcher) ->
    
    # Since FluxPlus does not provide an instance of the dispatcher, it needs to be provided.
    unless dispatcher instanceof Dispatcher
      throw new InvalidArgumentError 'An instance of FluxPlus.Dispatcher should be provided.'
    
    # We need the elementName property for the basic store operations.
    unless @elementName?
      throw new Error 'The property "elementName" must be set on implementations of the BaseStore.'
    
    # Register our basic actions.
    @dispatcherIndex = dispatcher.register (action) =>
      @handleAction(action)
  
  # Gets the currently active instance.
  getActive: ->
    return refs.active
  
  # Provides one instance based on an ID.
  getOne: (id) ->
    if id instanceof Object
      id = @extractId id
    return elements[id] || null
  
  # Provides a clone of the internal elements object.
  getAll: ->
    clone = {}
    clone[k]=v for k, v of elements
    return clone
  
  # Handles our basic EntityOperations.
  handleAction: (action) ->
    
    # Attempt to update the active 
    active = @extractActive action
    if active != false
      refs.active = active
      
      # In case it was a client action, emit change before we return.
      if action.source = ActionSource.CLIENT
        @emit 'change'
        return
    
    # Only elements from the server are interesting to us.
    # This is not an optimistic implementation.
    return unless action.source is ActionSource.SERVER
    return unless action.entities[@elementName]
    
    # Implement our usual operations.
    switch action.entities[@elementName]
      when EntityOperation.REPLACE
        elements = {}
        elements[@extractId(item)] = item for item in action.payload[@elementName]
      when EntityOperation.MERGE
        elements[@extractId(item)] = item for item in action.payload[@elementName]
      when EntityOperation.DELETE
        for item in action.payload[@elementName]
          delete elements[@extractId(item)]
    
    # Fire our change event.
    @emit 'change'
    
    # Make sure we return void.
    return
