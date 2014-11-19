class DummyBaseStore extends FluxPlus.BaseStore
  elementName: 'dummies'

module.exports = new DummyBaseStore require './dispatcher'
