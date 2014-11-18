(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Action, ActionSource, Class, EntityOperation, InvalidArgumentError, ValidationError, assert, _ref, _ref1;

_ref = {}, ActionSource = _ref.ActionSource, EntityOperation = _ref.EntityOperation;

_ref1 = {}, InvalidArgumentError = _ref1.InvalidArgumentError, ValidationError = _ref1.ValidationError;

Class = FluxPlus.example;

Action = {};

assert = chai.assert;

describe("src/example/class", function() {
  return describe("example", function() {
    return it("should have an example property", function() {
      return Class.prototype.example.should.equal('Test 1, 2, 3...');
    });
  });
});


},{}]},{},[1]);
