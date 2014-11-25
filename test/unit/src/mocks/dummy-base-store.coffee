class DummyBaseStore extends FluxPlus.BaseStore
  entityName: 'dummies'

module.exports = new DummyBaseStore require './dispatcher'
