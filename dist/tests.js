(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Action, ActionSource, EntityOperation, InvalidArgumentError, ValidationError, _ref;

ActionSource = FluxPlus.ActionSource;

EntityOperation = FluxPlus.EntityOperation;

_ref = FluxPlus.errors, InvalidArgumentError = _ref.InvalidArgumentError, ValidationError = _ref.ValidationError;

Action = FluxPlus.Action;

describe("src/actions/Action", function() {
  describe("constructor", function() {
    it("should create a new entities object property", function() {
      var action1, action2;
      action1 = new Action;
      action1.entities.should.be.an.instanceOf(Object);
      action2 = new Action;
      return action1.entities.should.not.equal(action2.entities);
    });
    return it("should create a new payload object property", function() {
      var action1, action2;
      action1 = new Action;
      action1.payload.should.be.an.instanceOf(Object);
      action2 = new Action;
      return action1.payload.should.not.equal(action2.payload);
    });
  });
  return describe("#validate", function() {
    var newInstance;
    newInstance = function() {
      var action;
      action = new Action;
      action.name = 'testing-action';
      action.source = ActionSource.CLIENT;
      action.entities = {
        sampleData: EntityOperation.MERGE,
        removeData: EntityOperation.DELETE
      };
      action.payload.sampleData = ['Hello', 'world!'];
      action.payload.removeData = ['Unwanted', 'data'];
      return action;
    };
    it("should check for a name", function() {
      var action;
      action = newInstance();
      action.name = null;
      return (function() {
        return action.validate();
      }).should["throw"](ValidationError, /^Action name is not defined/);
    });
    it("should check for a valid ActionSource", function() {
      var action;
      action = newInstance();
      action.source = null;
      return (function() {
        return action.validate();
      }).should["throw"](ValidationError, /^Source \'.+\' is not a valid ActionSource/);
    });
    it("should check for valid EntityOperations", function() {
      var action;
      action = newInstance();
      action.entities.sampleData = 'this is totally weird and invalid';
      return (function() {
        return action.validate();
      }).should["throw"](ValidationError, /^Entity \'sampleData\' has an invalid EntityOperation \'.+\'/);
    });
    it("should check for matching entities", function() {
      var action;
      action = newInstance();
      action.entities.sampleData = null;
      return (function() {
        return action.validate();
      }).should["throw"](ValidationError, /^Payload with key \'sampleData\' is not defined in the entities/);
    });
    return it("should check that payloads are arrays", function() {
      var action;
      action = newInstance();
      action.payload.removeData = {
        strange: 'things'
      };
      return (function() {
        return action.validate();
      }).should["throw"](ValidationError, /^Payload with key \'removeData\' is not an Array/);
    });
  });
});


},{}],2:[function(require,module,exports){
var Action, ActionSource, Dispatcher, EntityOperation, InvalidArgumentError, ValidationError, assert, _ref;

ActionSource = FluxPlus.ActionSource;

EntityOperation = FluxPlus.EntityOperation;

_ref = FluxPlus.errors, InvalidArgumentError = _ref.InvalidArgumentError, ValidationError = _ref.ValidationError;

Dispatcher = FluxPlus.Dispatcher;

Action = FluxPlus.Action;

assert = chai.assert;

describe("src/dispatcher/Dispatcher", function() {
  return describe("#dispatch", function() {
    var dispatcher;
    dispatcher = new FluxPlus.Dispatcher;
    it("should override the dispatch function from Flux's dispatcher", function() {
      return dispatcher.__proto__.dispatch.should.not.equal(Flux.Dispatcher.prototype);
    });
    it("should do strict type checking on Action instances as it's argument", function() {
      var payload;
      payload = {
        silly: 'format'
      };
      return (function() {
        return dispatcher.dispatch(payload);
      }).should["throw"](InvalidArgumentError, /^Payload must be an instance of Action/);
    });
    return it("should run a validation on the Action", function() {
      var payload, validationSpy;
      payload = new Action;
      validationSpy = sinon.spy(payload, 'validate');
      (function() {
        return dispatcher.dispatch(payload);
      }).should["throw"](ValidationError);
      return validationSpy.should.have.been.calledOnce;
    });
  });
});


},{}],3:[function(require,module,exports){
require('./actions/action');

require('./dispatcher/dispatcher');


},{"./actions/action":1,"./dispatcher/dispatcher":2}]},{},[3]);
