{ActionSource, EntityOperation} = require 'src/actions/constants'
{InvalidArgumentError} = require 'src/errors'
Dispatcher = require 'src/dispatcher/dispatcher'

module.exports = class BaseStore extends EventEmitter
  
  # The entity name should be provided in your implementation of the store.
  entityName: null
  _entities: null
  _refs: null
  
  # Default way of fetching the ID.
  extractId: (entity) ->
    return entity.id
  
  # Default way of finding the active entity.
  extractActive: (action) ->
    active = action.active?[@entityName]
    return if active == undefined then false else active
  
  # Creates a new store.
  constructor: (dispatcher) ->
    
    # Since FluxPlus does not provide an instance of the dispatcher, it needs to be provided.
    unless dispatcher instanceof Dispatcher
      throw new InvalidArgumentError 'An instance of FluxPlus.Dispatcher should be provided.'
    
    # We need the entityName property for the basic store operations.
    unless @entityName?
      throw new Error 'The property "entityName" must be set on implementations of the BaseStore.'
    
    # Create local collections.
    @_entities = {}
    @_refs =
      active: null
    
    # Register our basic actions.
    @dispatcherIndex = dispatcher.register (action) =>
      @handleAction(action)
  
  # Gets the currently active instance.
  getActive: ->
    return @_refs.active
  
  # Provides one instance based on an ID.
  getOne: (id) ->
    if id instanceof Object
      id = @extractId id
    return @_entities[id] || null
  
  # Provides a clone of the internal entities object.
  getAll: ->
    clone = {}
    clone[k]=v for k, v of @_entities
    return clone
  
  # Handles our basic EntityOperations.
  handleAction: (action) ->
    
    # Attempt to update the active entity
    active = @extractActive action
    if active != false
      @_refs.active = active
      
      # In case it was a client action, emit change before we return.
      if action.source == ActionSource.CLIENT
        @emit 'change'
        return
    
    # Only entities from the server are interesting to us.
    # This is not an optimistic implementation.
    return unless action.source is ActionSource.SERVER
    return unless action.entities[@entityName]
    
    # Implement our usual operations.
    switch action.entities[@entityName]
      when EntityOperation.REPLACE
        @_entities = {}
        @_entities[@extractId(item)] = item for item in action.payload[@entityName]
      when EntityOperation.MERGE
        @_entities[@extractId(item)] = item for item in action.payload[@entityName]
      when EntityOperation.DELETE
        for item in action.payload[@entityName]
          delete @_entities[@extractId(item)]
    
    # Fire our change event.
    @emit 'change'
    
    # Make sure we return void.
    return
