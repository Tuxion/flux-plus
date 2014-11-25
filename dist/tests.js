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
    it("should create a new payload object property", function() {
      var action1, action2;
      action1 = new Action;
      action1.payload.should.be.an.instanceOf(Object);
      action2 = new Action;
      return action1.payload.should.not.equal(action2.payload);
    });
    return it("should create a new active object property", function() {
      var action1, action2;
      action1 = new Action;
      action1.active.should.be.an.instanceOf(Object);
      action2 = new Action;
      return action1.active.should.not.equal(action2.active);
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
require('./action');


},{"./action":1}],3:[function(require,module,exports){
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


},{}],4:[function(require,module,exports){
require('./dispatcher');


},{"./dispatcher":3}],5:[function(require,module,exports){
require('./actions');

require('./dispatcher');

require('./stores');


},{"./actions":2,"./dispatcher":4,"./stores":8}],6:[function(require,module,exports){
module.exports = new FluxPlus.Dispatcher;


},{}],7:[function(require,module,exports){
var Action, ActionSource, Dispatcher, EntityOperation, InvalidArgumentError, TestBaseStore, ValidationError, expect, insertDummyAction, removeDummyAction, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Action = FluxPlus.Action;

ActionSource = FluxPlus.ActionSource;

EntityOperation = FluxPlus.EntityOperation;

_ref = FluxPlus.errors, InvalidArgumentError = _ref.InvalidArgumentError, ValidationError = _ref.ValidationError;

Dispatcher = require('test/unit/src/mocks/dispatcher');

expect = chai.expect;

TestBaseStore = (function(_super) {
  __extends(TestBaseStore, _super);

  function TestBaseStore() {
    return TestBaseStore.__super__.constructor.apply(this, arguments);
  }

  return TestBaseStore;

})(FluxPlus.BaseStore);

insertDummyAction = function(dummy) {
  var action;
  action = new Action;
  action.name = 'Tests.InsertDummy';
  action.source = ActionSource.SERVER;
  action.entities.dummies = EntityOperation.MERGE;
  action.payload.dummies = [dummy];
  action.validate();
  return action;
};

removeDummyAction = function(dummy) {
  var action;
  action = new Action;
  action.name = 'Tests.RemoveDummy';
  action.source = ActionSource.SERVER;
  action.entities.dummies = EntityOperation.DELETE;
  action.payload.dummies = [dummy];
  action.validate();
  return action;
};

describe("src/stores/BaseStore", function() {
  var DummyBaseStore;
  DummyBaseStore = null;
  describe("constructor", function() {
    it("should require an instance of the FluxPlus.Dispatcher to be provided", function() {
      return (function() {
        return new TestBaseStore();
      }).should["throw"](Error, /^An instance of FluxPlus.Dispatcher should be provided/);
    });
    it("should require the entityName property to be overridden", function() {
      return (function() {
        return new TestBaseStore(Dispatcher);
      }).should["throw"](Error, /^The property "entityName" must be set on implementations of the BaseStore/);
    });
    it("should define a callback on the dispatcher", function() {
      var registerSpy;
      registerSpy = sinon.spy(Dispatcher.__proto__, 'register');
      DummyBaseStore = require('test/unit/src/mocks/dummy-base-store');
      registerSpy.should.have.been.calledOnce;
      return DummyBaseStore.dispatcherIndex.should.be.ok;
    });
    return it("should create it's own _ref and _elements objects", function() {
      var store1, store2;
      TestBaseStore.prototype.entityName = "tests";
      store1 = new TestBaseStore(Dispatcher);
      store1._refs.should.be.an.instanceOf(Object);
      store1._entities.should.be.an.instanceOf(Object);
      store2 = new TestBaseStore(Dispatcher);
      store1._refs.should.not.equal(store2._refs);
      return store1._entities.should.not.equal(store2._entities);
    });
  });
  describe("getOne", function() {
    it("should return null if no element was found", function() {
      return expect(DummyBaseStore.getOne(1234)).to.be["null"];
    });
    return it("should return the element if the element was found", function() {
      var dummy;
      dummy = {
        id: 1,
        title: 'test'
      };
      DummyBaseStore.handleAction(insertDummyAction(dummy));
      expect(DummyBaseStore.getOne(1)).to.equal(dummy);
      return DummyBaseStore.handleAction(removeDummyAction(dummy));
    });
  });
  describe("getAll", function() {
    it("should return empty object if no elements were inserted", function() {
      return expect(DummyBaseStore.getAll()).to.be.empty;
    });
    return it("should contain the element if we insert one", function() {
      var dummy, output;
      dummy = {
        id: 1,
        title: 'test'
      };
      DummyBaseStore.handleAction(insertDummyAction(dummy));
      output = DummyBaseStore.getAll();
      expect(output).to.not.be.empty;
      expect(output[1]).to.equal(dummy);
      return DummyBaseStore.handleAction(removeDummyAction(dummy));
    });
  });
  return describe("handleAction", function() {
    it("should ignore client actions", function() {
      var action, dummies, dummy;
      dummy = {
        id: 1,
        title: 'test'
      };
      action = new Action;
      action.name = 'client merge test';
      action.source = ActionSource.CLIENT;
      action.entities.dummies = EntityOperation.MERGE;
      action.payload.dummies = [dummy];
      action.validate();
      DummyBaseStore.handleAction(action);
      dummies = DummyBaseStore.getAll();
      return expect(dummies[1]).to.be.undefined;
    });
    it("should ignore actions for other entities", function() {
      var action, dummies, dummy;
      dummy = {
        id: 1,
        title: 'test'
      };
      action = new Action;
      action.name = 'client merge test';
      action.source = ActionSource.CLIENT;
      action.entities.otherEntity = EntityOperation.MERGE;
      action.payload.otherEntity = [dummy];
      action.validate();
      DummyBaseStore.handleAction(action);
      dummies = DummyBaseStore.getAll();
      return expect(dummies[1]).to.be.undefined;
    });
    it("should handle server merge actions", function() {
      var action, dummies, dummy;
      dummy = {
        id: 1,
        title: 'test'
      };
      action = new Action;
      action.name = 'server merge test';
      action.source = ActionSource.SERVER;
      action.entities.dummies = EntityOperation.MERGE;
      action.payload.dummies = [dummy];
      action.validate();
      DummyBaseStore.handleAction(action);
      dummies = DummyBaseStore.getAll();
      return dummies[1].should.equal(dummy);
    });
    it("should handle server replace actions", function() {
      var action, dummies, dummy;
      dummy = {
        id: 1,
        title: 'test'
      };
      action = new Action;
      action.name = 'server replace test';
      action.source = ActionSource.SERVER;
      action.entities.dummies = EntityOperation.REPLACE;
      action.payload.dummies = [dummy];
      action.validate();
      DummyBaseStore.handleAction(action);
      dummies = DummyBaseStore.getAll();
      return dummies[1].should.equal(dummy);
    });
    return it("should handle server delete actions", function() {
      var action, dummies, dummy;
      dummy = {
        id: 1,
        title: 'test'
      };
      action = new Action;
      action.name = 'server delete test';
      action.source = ActionSource.SERVER;
      action.entities.dummies = EntityOperation.DELETE;
      action.payload.dummies = [dummy];
      action.validate();
      dummies = DummyBaseStore.getAll();
      expect(dummies[1]).to.be.ok;
      DummyBaseStore.handleAction(action);
      dummies = DummyBaseStore.getAll();
      return expect(dummies[1]).to.be.undefined;
    });
  });
});


},{"test/unit/src/mocks/dispatcher":9,"test/unit/src/mocks/dummy-base-store":10}],8:[function(require,module,exports){
require('./base-store');


},{"./base-store":7}],9:[function(require,module,exports){
module.exports = new FluxPlus.Dispatcher;


},{}],10:[function(require,module,exports){
var DummyBaseStore,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

DummyBaseStore = (function(_super) {
  __extends(DummyBaseStore, _super);

  function DummyBaseStore() {
    return DummyBaseStore.__super__.constructor.apply(this, arguments);
  }

  DummyBaseStore.prototype.entityName = 'dummies';

  return DummyBaseStore;

})(FluxPlus.BaseStore);

module.exports = new DummyBaseStore(require('./dispatcher'));


},{"./dispatcher":6}]},{},[5]);
