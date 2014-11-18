{ActionSource, EntityOperation} = {}
{InvalidArgumentError, ValidationError} = {}
Class = FluxPlus.example
Action = {}
{assert} = chai

describe "src/example/class", ->
  
  describe "example", ->
    
    it "should have an example property", ->
      Class.prototype.example.should.equal 'Test 1, 2, 3...'
