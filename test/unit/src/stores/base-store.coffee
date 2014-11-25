Action = FluxPlus.Action
ActionSource = FluxPlus.ActionSource
EntityOperation = FluxPlus.EntityOperation
{InvalidArgumentError, ValidationError} = FluxPlus.errors
Dispatcher = require 'test/unit/src/mocks/dispatcher'
expect = chai.expect

# Create an implementation we can test with.
class TestBaseStore extends FluxPlus.BaseStore

# Helper for creating an "insert" action.
insertDummyAction = (dummy) ->
  action = new Action
  action.name = 'Tests.InsertDummy'
  action.source = ActionSource.SERVER
  action.entities.dummies = EntityOperation.MERGE
  action.payload.dummies = [dummy]
  action.validate() # Just for easy test writing.
  return action

removeDummyAction = (dummy) ->
  action = new Action
  action.name = 'Tests.RemoveDummy'
  action.source = ActionSource.SERVER
  action.entities.dummies = EntityOperation.DELETE
  action.payload.dummies = [dummy]
  action.validate() # Just for easy test writing.
  return action

describe "src/stores/BaseStore", ->
  
  DummyBaseStore = null
  
  describe "constructor", ->
    
    it "should require an instance of the FluxPlus.Dispatcher to be provided", ->
      (-> new TestBaseStore()).should.throw Error,
        /^An instance of FluxPlus.Dispatcher should be provided/
    
    it "should require the entityName property to be overridden", ->
      (-> new TestBaseStore(Dispatcher)).should.throw Error,
        /^The property "entityName" must be set on implementations of the BaseStore/
    
    it "should define a callback on the dispatcher", ->
      
      registerSpy = sinon.spy Dispatcher.__proto__, 'register'
      DummyBaseStore = require 'test/unit/src/mocks/dummy-base-store'
      registerSpy.should.have.been.calledOnce
      DummyBaseStore.dispatcherIndex.should.be.ok
    
    it "should create it's own _ref and _elements objects", ->
      TestBaseStore.prototype.entityName = "tests"
      
      store1 = new TestBaseStore Dispatcher
      store1._refs.should.be.an.instanceOf Object
      store1._entities.should.be.an.instanceOf Object
      store2 = new TestBaseStore Dispatcher
      store1._refs.should.not.equal store2._refs
      store1._entities.should.not.equal store2._entities
    
  describe "getOne", ->
    
    it "should return null if no element was found", ->
      expect(DummyBaseStore.getOne(1234)).to.be.null
    
    it "should return the element if the element was found", ->
      
      # Insert a dummy.
      dummy = id: 1, title: 'test'
      DummyBaseStore.handleAction insertDummyAction dummy
      
      expect(DummyBaseStore.getOne(1)).to.equal dummy
      
      # Remove the dummy.
      DummyBaseStore.handleAction removeDummyAction dummy
  
  describe "getAll", ->
    
    it "should return empty object if no elements were inserted", ->
      expect(DummyBaseStore.getAll()).to.be.empty
      
    it "should contain the element if we insert one", ->
      
      # Insert a dummy.
      dummy = id: 1, title: 'test'
      DummyBaseStore.handleAction insertDummyAction dummy
      
      output = DummyBaseStore.getAll()
      expect(output).to.not.be.empty
      expect(output[1]).to.equal dummy
      
      # Remove the dummy.
      DummyBaseStore.handleAction removeDummyAction dummy
  
  describe "handleAction", ->
    
    it "should ignore client actions", ->
      
      dummy = id: 1, title: 'test'
      
      action = new Action
      action.name = 'client merge test'
      action.source = ActionSource.CLIENT
      action.entities.dummies = EntityOperation.MERGE
      action.payload.dummies = [dummy]
      action.validate() # Just for easy test writing.
      
      DummyBaseStore.handleAction action
      
      dummies = DummyBaseStore.getAll()
      expect(dummies[1]).to.be.undefined
    
    it "should ignore actions for other entities", ->
      
      dummy = id: 1, title: 'test'
      
      action = new Action
      action.name = 'client merge test'
      action.source = ActionSource.CLIENT
      action.entities.otherEntity = EntityOperation.MERGE
      action.payload.otherEntity = [dummy]
      action.validate() # Just for easy test writing.
      
      DummyBaseStore.handleAction action
      
      dummies = DummyBaseStore.getAll()
      expect(dummies[1]).to.be.undefined
    
    it "should handle server merge actions", ->
      
      dummy = id: 1, title: 'test'
      
      action = new Action
      action.name = 'server merge test'
      action.source = ActionSource.SERVER
      action.entities.dummies = EntityOperation.MERGE
      action.payload.dummies = [dummy]
      action.validate() # Just for easy test writing.
      
      DummyBaseStore.handleAction action
      
      dummies = DummyBaseStore.getAll()
      dummies[1].should.equal dummy
    
    it "should handle server replace actions", ->
      
      dummy = id: 1, title: 'test'
      
      action = new Action
      action.name = 'server replace test'
      action.source = ActionSource.SERVER
      action.entities.dummies = EntityOperation.REPLACE
      action.payload.dummies = [dummy]
      action.validate() # Just for easy test writing.
      
      DummyBaseStore.handleAction action
      
      dummies = DummyBaseStore.getAll()
      dummies[1].should.equal dummy
      
    it "should handle server delete actions", ->
      
      dummy = id: 1, title: 'test'
      
      action = new Action
      action.name = 'server delete test'
      action.source = ActionSource.SERVER
      action.entities.dummies = EntityOperation.DELETE
      action.payload.dummies = [dummy]
      action.validate() # Just for easy test writing.
      
      # Make sure it was there from other tests before.
      dummies = DummyBaseStore.getAll()
      expect(dummies[1]).to.be.ok
      
      DummyBaseStore.handleAction action
      
      # Aaaaaaand it's gone! Right?
      dummies = DummyBaseStore.getAll()
      expect(dummies[1]).to.be.undefined
