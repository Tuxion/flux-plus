ActionSource = FluxPlus.ActionSource
EntityOperation = FluxPlus.EntityOperation
{InvalidArgumentError, ValidationError} = FluxPlus.errors
Action = FluxPlus.Action

describe "src/actions/Action", ->
  
  describe "constructor", ->
    
    it "should create a new entities object property", ->
      action1 = new Action
      action1.entities.should.be.an.instanceOf Object
      action2 = new Action
      action1.entities.should.not.equal action2.entities
    
    it "should create a new payload object property", ->
      action1 = new Action
      action1.payload.should.be.an.instanceOf Object
      action2 = new Action
      action1.payload.should.not.equal action2.payload
    
    it "should create a new active object property", ->
      action1 = new Action
      action1.active.should.be.an.instanceOf Object
      action2 = new Action
      action1.active.should.not.equal action2.active
  
  describe "#validate", ->
    
    newInstance = ->
      action = new Action
      action.name = 'testing-action'
      action.source = ActionSource.CLIENT
      action.entities =
        sampleData: EntityOperation.MERGE
        removeData: EntityOperation.DELETE
      action.payload.sampleData = ['Hello', 'world!']
      action.payload.removeData = ['Unwanted', 'data']
      return action
    
    it "should check for a name", ->
      action = newInstance()
      action.name = null
      (-> action.validate()).should.throw ValidationError, /^Action name is not defined/
    
    it "should check for a valid ActionSource", ->
      action = newInstance()
      action.source = null
      (-> action.validate()).should.throw ValidationError, /^Source \'.+\' is not a valid ActionSource/
    
    it "should check for valid EntityOperations", ->
      action = newInstance()
      action.entities.sampleData = 'this is totally weird and invalid'
      (-> action.validate()).should.throw ValidationError, /^Entity \'sampleData\' has an invalid EntityOperation \'.+\'/
    
    it "should check for matching entities", ->
      action = newInstance()
      action.entities.sampleData = null
      (-> action.validate()).should.throw ValidationError, /^Payload with key \'sampleData\' is not defined in the entities/
    
    it "should check that payloads are arrays", ->
      action = newInstance()
      action.payload.removeData = strange: 'things'
      (-> action.validate()).should.throw ValidationError, /^Payload with key \'removeData\' is not an Array/
