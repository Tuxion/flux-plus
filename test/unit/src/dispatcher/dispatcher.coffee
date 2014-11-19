ActionSource = FluxPlus.ActionSource
EntityOperation = FluxPlus.EntityOperation
{InvalidArgumentError, ValidationError} = FluxPlus.errors
Dispatcher = FluxPlus.Dispatcher
Action = FluxPlus.Action
{assert} = chai

describe "src/dispatcher/Dispatcher", ->
  
  describe "#dispatch", ->
    
    dispatcher = new FluxPlus.Dispatcher
    
    it "should override the dispatch function from Flux's dispatcher", ->
      dispatcher.__proto__.dispatch.should.not.equal Flux.Dispatcher.prototype
    
    it "should do strict type checking on Action instances as it's argument", ->
      payload = silly: 'format'
      (-> dispatcher.dispatch(payload)).should.throw InvalidArgumentError, /^Payload must be an instance of Action/
    
    it "should run a validation on the Action", ->
      payload = new Action
      validationSpy = sinon.spy payload, 'validate'
      (-> dispatcher.dispatch(payload)).should.throw ValidationError
      validationSpy.should.have.been.calledOnce
      
